const STUDENTS_DATA = [
    "Yo misma", "Annelis Alzolar", "Franniel Rodriguez", "Laura Fermín", 
    "Rania Cabeza", "Yenny Perdomo", "Gabriela Requena", "Fiorella Colina", 
    "Diego Marín", "Matías Becerra", "Leonardo Portero", "Oliver Josué", 
    "Pablo Navarro", "Samuel Jiménez", "París Elena", "HATE GENERAL"
];

const KEY_PREFIX = 'studentDiary_';
let currentStudentName = null;
let currentBookId = null;

// CARGAR DATOS
function loadBooks(name) {
    const data = localStorage.getItem(KEY_PREFIX + name);
    return data ? JSON.parse(data) : [];
}

function saveBooks(name, books) {
    localStorage.setItem(KEY_PREFIX + name, JSON.stringify(books));
}

// NAVEGACIÓN
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

// RENDERIZADO
function renderList() {
    const list = document.getElementById('student-list');
    list.innerHTML = '';
    STUDENTS_DATA.forEach(name => {
        const books = loadBooks(name);
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="card-avatar">${name.charAt(0)}</div>
            <span class="student-name">${name}</span>
            <span style="font-size:0.6rem; color:gray">${books.length} Libros</span>
        `;
        card.onclick = () => {
            currentStudentName = name;
            document.getElementById('profile-title').textContent = name.split(' ')[0];
            renderLibrary();
            switchScreen('profile-screen');
        };
        list.appendChild(card);
    });
}

function renderLibrary() {
    const container = document.getElementById('diary-library');
    container.innerHTML = '';
    const books = loadBooks(currentStudentName);

    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        div.innerHTML = `
            <button class="delete-book-btn" onclick="deleteBook('${book.id}', event)"><i class="fas fa-times"></i></button>
            <div class="book-cover"><i class="fas fa-book"></i></div>
            <span class="book-label">${book.title}</span>
        `;
        div.onclick = () => {
            currentBookId = book.id;
            document.getElementById('book-title-display').textContent = book.title;
            document.getElementById('book-content').value = book.content;
            switchScreen('writing-screen');
        };
        container.appendChild(div);
    });
}

// ACCIONES
function deleteBook(id, e) {
    e.stopPropagation();
    if(confirm("¿Borrar libro?")) {
        let books = loadBooks(currentStudentName);
        books = books.filter(b => b.id !== id);
        saveBooks(currentStudentName, books);
        renderLibrary();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderList();

    document.getElementById('add-book-btn').onclick = () => {
        const t = prompt("Título (Ej: Día 1 o Fecha):");
        if(!t) return;
        const books = loadBooks(currentStudentName);
        books.push({ id: Date.now().toString(), title: t, content: "" });
        saveBooks(currentStudentName, books);
        renderLibrary();
    };

    document.getElementById('book-content').oninput = () => {
        const books = loadBooks(currentStudentName);
        const b = books.find(x => x.id === currentBookId);
        if(b) {
            b.content = document.getElementById('book-content').value;
            saveBooks(currentStudentName, books);
            const ind = document.getElementById('save-indicator');
            ind.style.opacity = 1; setTimeout(()=> ind.style.opacity = 0, 800);
        }
    };

    document.getElementById('back-button').onclick = () => switchScreen('home-screen');
    document.getElementById('close-book-btn').onclick = () => { renderLibrary(); switchScreen('profile-screen'); };
    
    document.getElementById('reset-all-btn').onclick = () => {
        if(confirm("¿Limpiar todos los diarios?")) { localStorage.clear(); location.reload(); }
    };
});