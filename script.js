// script.js - Interactivity, charts, animations, task management, reminders.

document.addEventListener('DOMContentLoaded', () => {
    // Setup Main Radar Chart
    const mainRadarCtx = document.getElementById('main-radar-chart').getContext('2d');
    new Chart(mainRadarCtx, {
        type: 'radar',
        data: {
            labels: ['Physical', 'Creative', 'Mental', 'Social', 'Moral'],
            datasets: [{
                label: 'Life Potential',
                data: [80, 70, 90, 60, 85],
                backgroundColor: 'rgba(170, 170, 170, 0.2)',
                borderColor: '#888',
                pointBackgroundColor: '#000'
            }]
        },
        options: {
            scales: {
                r: { beginAtZero: true }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutBounce'
            }
        }
    });

    // Setup Sub Radar Chart (more sections based on reference)
    const subRadarCtx = document.getElementById('sub-radar-chart').getContext('2d');
    new Chart(subRadarCtx, {
        type: 'radar',
        data: {
            labels: ['Willpower', 'Health', 'Mood', 'Physical Lv', 'Psyche Lv', 'Intel Lv', 'Spirit Lv', 'Core Lv'],
            datasets: [{
                label: 'Expanded Attributes',
                data: [70, 70, 70, 0, 7, 0, 0, 7],
                backgroundColor: 'rgba(170, 170, 170, 0.2)',
                borderColor: '#888',
                pointBackgroundColor: '#000'
            }]
        },
        options: {
            scales: {
                r: { beginAtZero: true }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutBounce'
            }
        }
    });

    // Setup Activity Line Chart (like references)
    const activityCtx = document.getElementById('activity-chart').getContext('2d');
    new Chart(activityCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Activity',
                data: [10, 20, 15, 25, 30],
                borderColor: '#888',
                backgroundColor: 'rgba(170, 170, 170, 0.2)'
            }]
        },
        options: {
            animation: {
                duration: 1500
            }
        }
    });

    // Task Management
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');

    addTaskBtn.addEventListener('click', () => {
        if (newTaskInput.value.trim()) {
            const li = document.createElement('li');
            li.textContent = newTaskInput.value;
            li.classList.add('animated-task');
            taskList.appendChild(li);
            newTaskInput.value = '';
        }
    });

    // Schedule Task & Reminder (simple example: alert after 5 seconds)
    const scheduleTaskBtn = document.getElementById('schedule-task-btn');
    scheduleTaskBtn.addEventListener('click', () => {
        alert('Task scheduled! Reminder will pop up in 5 seconds.');
        setTimeout(() => {
            alert('Reminder: Your scheduled task is complete!');
        }, 5000);
    });

    // Placeholder for AI and Anki interactions (expand later)
    // For now, just console log inputs
    const aiSendBtn = document.querySelector('.ai-section button');
    const aiInput = document.querySelector('.ai-section input');
    aiSendBtn.addEventListener('click', () => {
        console.log('AIRI Prompt:', aiInput.value);
        aiInput.value = '';
    });
});

// Add CSS for animated-task
// In style.css, add: .animated-task { animation: fadeIn 0.5s; }
