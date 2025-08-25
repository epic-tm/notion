/* script.js — small interactivity */
const views = {
  dashboard: document.getElementById('dashboard-view'),
  notes: document.getElementById('notes-view'),
  projects: document.getElementById('projects-view'),
};

function switchView(name){
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.view === name);
  });
}

document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.addEventListener('click', ()=> switchView(btn.dataset.view));
});

// Simple in-memory demo data (also stored in localStorage)
const DB_KEY = 'notion_lite_demo';
const defaultData = {
  notes: [
    {id: 'n1', title: 'Welcome', body: 'This is a small Notion-like demo. Click notes to edit.'},
    {id: 'n2', title: 'Groceries', body: '- Milk\n- Eggs\n- Coffee'},
  ],
  projects: [
    {id:'p1', title: 'Website Redesign', status: 'In Progress'},
    {id:'p2', title: 'Study Plan', status: 'Planned'}
  ],
  activeNoteId: null
};

function loadData(){
  const raw = localStorage.getItem(DB_KEY);
  if(!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }
  try { return JSON.parse(raw); } catch(e){ localStorage.removeItem(DB_KEY); return JSON.parse(JSON.stringify(defaultData)); }
}
function saveData(d){ localStorage.setItem(DB_KEY, JSON.stringify(d)); }

let DATA = loadData();

// Render helpers
function renderQuickNotes(){
  const ul = document.getElementById('quick-notes');
  ul.innerHTML = '';
  DATA.notes.slice(0,5).forEach(n=>{
    const li = document.createElement('li'); li.textContent = n.title;
    li.onclick = ()=> openNote(n.id);
    ul.appendChild(li);
  });
}

function renderProjectsGrid(el){
  el.innerHTML = '';
  DATA.projects.forEach(p=>{
    const card = document.createElement('div'); card.className='project-card';
    card.innerHTML = `<strong>${p.title}</strong><div class="muted">${p.status}</div>`;
    el.appendChild(card);
  });
}

function renderNotesList(){
  const ul = document.getElementById('notes-list-ul'); ul.innerHTML='';
  DATA.notes.forEach(n=>{
    const li = document.createElement('li'); li.textContent = n.title;
    li.onclick = ()=> selectNote(n.id);
    ul.appendChild(li);
  });
}

function openNote(id){
  DATA.activeNoteId = id;
  const note = DATA.notes.find(x=>x.id===id);
  if(!note) return;
  document.getElementById('note-title').value = note.title;
  document.getElementById('note-body').value = note.body;
  switchView('dashboard');
  renderQuickNotes();
}

function selectNote(id){
  const note = DATA.notes.find(x=>x.id===id);
  if(!note) return;
  document.getElementById('note-title-2').value = note.title;
  document.getElementById('note-body-2').value = note.body;
  DATA.activeNoteId = id;
}

document.getElementById('new-quick-note').addEventListener('click', ()=>{
  const id = 'n'+Date.now();
  DATA.notes.unshift({id, title: 'New note', body: ''});
  saveData(DATA); renderQuickNotes(); renderNotesList();
});

document.getElementById('add-note').addEventListener('click', ()=>{
  const id = 'n'+Date.now();
  DATA.notes.unshift({id, title: 'New note', body: ''});
  saveData(DATA); renderNotesList(); selectNote(id);
});

document.getElementById('save-note').addEventListener('click', ()=>{
  const id = DATA.activeNoteId || ('n'+Date.now());
  const title = document.getElementById('note-title').value || 'Untitled';
  const body = document.getElementById('note-body').value || '';
  const existing = DATA.notes.find(n=>n.id===id);
  if(existing){ existing.title = title; existing.body = body; }
  else { DATA.notes.unshift({id,title,body}); }
  DATA.activeNoteId = id;
  saveData(DATA); renderQuickNotes(); renderNotesList();
});

document.getElementById('save-note-2').addEventListener('click', ()=>{
  const id = DATA.activeNoteId;
  if(!id) return alert('Pick a note from the list or create a new one.');
  const title = document.getElementById('note-title-2').value || 'Untitled';
  const body = document.getElementById('note-body-2').value || '';
  const existing = DATA.notes.find(n=>n.id===id);
  if(existing){ existing.title = title; existing.body = body; saveData(DATA); renderQuickNotes(); renderNotesList(); }
});

document.getElementById('delete-note-2').addEventListener('click', ()=>{
  const id = DATA.activeNoteId;
  if(!id) return alert('No note selected to delete.');
  DATA.notes = DATA.notes.filter(n=>n.id!==id);
  DATA.activeNoteId = null;
  saveData(DATA); renderQuickNotes(); renderNotesList();
  document.getElementById('note-title-2').value=''; document.getElementById('note-body-2').value='';
});

document.getElementById('close-note').addEventListener('click', ()=>{
  DATA.activeNoteId = null;
  document.getElementById('note-title').value=''; document.getElementById('note-body').value='';
  renderQuickNotes();
});

// Initial render
renderQuickNotes();
renderProjectsGrid(document.getElementById('projects-grid'));
renderProjectsGrid(document.getElementById('projects-view-grid'));
renderNotesList();
