// script.js - Interactivity, charts, animations, task management, reminders.

document.addEventListener('DOMContentLoaded', () => {
    // ------ Data Layer ------
    const STORAGE_KEY = 'ephy_v1';
    const defaultState = { habits: [], tasks: [], settings: { personality: 'calm', notifications: false } };

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...defaultState };
            const parsed = JSON.parse(raw);
            return { ...defaultState, ...parsed };
        } catch (error) {
            console.error('Failed to load state', error);
            return { ...defaultState };
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save state', error);
        }
    }

    function uid() {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    function formatDate(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function calculateStreak(history) {
        let count = 0;
        const cursor = new Date();
        while (history[formatDate(cursor)]) {
            count += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return count;
    }

    let state = loadState();

    // ------ DOM References ------
    const habitNameEl = document.getElementById('habit-name');
    const habitDomainEl = document.getElementById('habit-domain');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitListEl = document.getElementById('habit-list');
    const streaksOverviewEl = document.getElementById('streaks-overview');

    const taskTitleEl = document.getElementById('task-title');
    const taskPriorityEl = document.getElementById('task-priority');
    const taskDueEl = document.getElementById('task-due');
    const addTaskBtn = document.getElementById('add-task');
    const taskListEl = document.getElementById('task-list');

    const personalitySelect = document.getElementById('personality-select');
    const encourageBtn = document.getElementById('encourage-btn');
    const enableNotifsBtn = document.getElementById('enable-notifs-btn');
    const aiMessageEl = document.getElementById('ai-message');
    const orbEl = document.getElementById('avatar-orb');

    // ------ AI Personality ------
    const PERSONALITIES = {
        calm: [
            'Breathe. One more small step today is enough.',
            'Quiet progress is still progress.',
            'Consistency over intensity. You are doing fine.'
        ],
        encouraging: [
            'Proud of you. Keep stacking wins!',
            'Your streak is growing—let’s make it unbreakable.',
            'You showed up. That matters most.'
        ],
        energetic: [
            'Let’s go! One more rep, one more page!',
            'Energy up! Turn momentum into mastery!',
            'You’re on fire—lock in and push!' 
        ]
    };

    function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

    function speakEncouragement(context) {
        const personality = state.settings.personality;
        const base = randomFrom(PERSONALITIES[personality]);
        const message = `${base} ${context ?? ''}`.trim();
        aiMessageEl.textContent = message;
        tintOrb(personality);
    }

    function tintOrb(personality) {
        const colors = {
            calm: 'rgba(147,197,253,0.55)',
            encouraging: 'rgba(167,139,250,0.60)',
            energetic: 'rgba(250,204,21,0.65)'
        };
        const glow = colors[personality];
        orbEl.style.boxShadow = `0 0 40px ${glow}, inset 0 0 30px rgba(255,255,255,0.22)`;
        orbEl.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${glow}, rgba(15,20,27,0.9))`;
    }

    // ------ Habits ------
    addHabitBtn.addEventListener('click', () => {
        const name = habitNameEl.value.trim();
        if (!name) return;
        state.habits.push({
            id: uid(),
            name,
            domain: habitDomainEl.value,
            createdAt: Date.now(),
            history: {}
        });
        habitNameEl.value = '';
        saveState(state);
        renderHabits();
        speakEncouragement('New habit created.');
    });

    function toggleHabitToday(habitId) {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return;
        const key = formatDate(new Date());
        habit.history[key] = !habit.history[key];
        saveState(state);
        renderHabits();
        const streak = calculateStreak(habit.history);
        speakEncouragement(`Streak: ${streak} day(s).`);
    }

    function deleteHabit(habitId) {
        state.habits = state.habits.filter(h => h.id !== habitId);
        saveState(state);
        renderHabits();
    }

    function renderHabits() {
        habitListEl.innerHTML = '';
        state.habits.forEach(habit => {
            const li = document.createElement('li');
            li.className = 'habit-item';
            const streak = calculateStreak(habit.history);
            const todayKey = formatDate(new Date());
            const todayDone = !!habit.history[todayKey];
            li.innerHTML = `
                <span><strong>${habit.name}</strong> <small>(${habit.domain})</small> · <span class="streak-badge">🔥 ${streak}</span></span>
                <span>
                    <button data-action="toggle" aria-pressed="${todayDone}" title="Mark today">${todayDone ? 'Unmark' : 'Mark Today'}</button>
                    <button data-action="delete" title="Delete">Delete</button>
                </span>
            `;
            li.querySelector('[data-action="toggle"]').addEventListener('click', () => toggleHabitToday(habit.id));
            li.querySelector('[data-action="delete"]').addEventListener('click', () => deleteHabit(habit.id));
            habitListEl.appendChild(li);
        });
        renderStreaksOverview();
    }

    function renderStreaksOverview() {
        const totals = state.habits.map(h => calculateStreak(h.history));
        const best = Math.max(0, ...totals);
        const sum = totals.reduce((a,b) => a+b, 0);
        streaksOverviewEl.textContent = `Total streak days: ${sum} · Best streak: ${best}`;
    }

    // ------ Tasks ------
    addTaskBtn.addEventListener('click', () => {
        const title = taskTitleEl.value.trim();
        if (!title) return;
        const due = taskDueEl.value ? new Date(taskDueEl.value).toISOString() : null;
        const task = {
            id: uid(), title, priority: taskPriorityEl.value, due, done: false, createdAt: Date.now()
        };
        state.tasks.unshift(task);
        taskTitleEl.value = '';
        taskDueEl.value = '';
        saveState(state);
        renderTasks();
        scheduleReminder(task);
    });

    function toggleTask(taskId) {
        const t = state.tasks.find(x => x.id === taskId);
        if (!t) return;
        t.done = !t.done;
        saveState(state);
        renderTasks();
    }

    function deleteTask(taskId) {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        saveState(state);
        renderTasks();
    }

    function renderTasks() {
        taskListEl.innerHTML = '';
        state.tasks.forEach(task => {
            const li = document.createElement('li');
            const dueText = task.due ? new Date(task.due).toLocaleString() : 'No due';
            li.innerHTML = `
                <label>
                    <input type="checkbox" ${task.done ? 'checked' : ''} />
                    ${task.title} <small>(${task.priority}) · ${dueText}</small>
                </label>
                <button data-action="delete">Delete</button>
            `;
            li.querySelector('input').addEventListener('change', () => toggleTask(task.id));
            li.querySelector('[data-action="delete"]').addEventListener('click', () => deleteTask(task.id));
            taskListEl.appendChild(li);
        });
    }

    // ------ Reminders ------
    async function ensureNotificationPermission() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        if (Notification.permission !== 'denied') {
            const res = await Notification.requestPermission();
            return res === 'granted';
        }
        return false;
    }

    function scheduleReminder(task) {
        if (!task.due) return;
        const deltaMs = new Date(task.due).getTime() - Date.now();
        if (deltaMs <= 0 || deltaMs > 1000 * 60 * 60 * 24) return; // only schedule within 24h
        setTimeout(async () => {
            const granted = state.settings.notifications && await ensureNotificationPermission();
            const text = `Reminder: ${task.title}`;
            if (granted) new Notification(text);
            else alert(text);
        }, deltaMs);
    }

    // ------ Personality UI ------
    personalitySelect.value = state.settings.personality;
    personalitySelect.addEventListener('change', () => {
        state.settings.personality = personalitySelect.value;
        saveState(state);
        tintOrb(state.settings.personality);
        speakEncouragement('Style updated.');
    });

    encourageBtn.addEventListener('click', () => speakEncouragement());

    enableNotifsBtn.addEventListener('click', async () => {
        const ok = await ensureNotificationPermission();
        state.settings.notifications = ok;
        saveState(state);
        aiMessageEl.textContent = ok ? 'Notifications enabled.' : 'Notifications not available.';
    });

    // ------ Charts (keep simple sample data) ------
    try {
        const mainRadarCtx = document.getElementById('main-radar-chart').getContext('2d');
        new Chart(mainRadarCtx, {
            type: 'radar',
            data: {
                labels: ['Physical', 'Creative', 'Mental', 'Social', 'Moral'],
                datasets: [{
                    label: 'Life Potential',
                    data: [80, 70, 90, 60, 85],
                    backgroundColor: 'rgba(170, 170, 170, 0.15)',
                    borderColor: '#9ca3af',
                    pointBackgroundColor: '#e5e7eb'
                }]
            },
            options: { scales: { r: { beginAtZero: true } }, animation: { duration: 1200 } }
        });

        const subRadarCtx = document.getElementById('sub-radar-chart').getContext('2d');
        new Chart(subRadarCtx, {
            type: 'radar',
            data: {
                labels: ['Willpower', 'Health', 'Mood', 'Physical Lv', 'Psyche Lv', 'Intel Lv', 'Spirit Lv', 'Core Lv'],
                datasets: [{
                    label: 'Expanded Attributes',
                    data: [70, 70, 70, 0, 7, 0, 0, 7],
                    backgroundColor: 'rgba(170, 170, 170, 0.15)',
                    borderColor: '#9ca3af',
                    pointBackgroundColor: '#e5e7eb'
                }]
            },
            options: { scales: { r: { beginAtZero: true } }, animation: { duration: 1200 } }
        });

        const activityCtx = document.getElementById('activity-chart').getContext('2d');
        new Chart(activityCtx, {
            type: 'line',
            data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], datasets: [{ label: 'Activity', data: [10,20,15,25,30], borderColor: '#9ca3af', backgroundColor: 'rgba(170,170,170,0.18)' }] },
            options: { animation: { duration: 900 } }
        });
    } catch (e) {
        console.warn('Charts setup skipped:', e);
    }

    // ------ Initial Render ------
    tintOrb(state.settings.personality);
    renderHabits();
    renderTasks();
});

