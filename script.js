// API Base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api/v1'; // For development

// Global variables
let currentUser = null;
let authToken = null;

// DOM Elements
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const submitLogin = document.getElementById('submitLogin');
const submitSignup = document.getElementById('submitSignup');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const closeButtons = document.querySelectorAll('.close-btn');
const submitSkillBtn = document.getElementById('submitSkillBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const pdfUpload = document.getElementById('pdfUpload');
const fileName = document.getElementById('fileName');
const skillsGrid = document.getElementById('skillsGrid');
const notesList = document.getElementById('notesList');
const progressStats = document.getElementById('progressStats');
const chatbotBtn = document.querySelector('.chatbot-btn');
const chatbotModal = document.getElementById('chatbotModal');
const closeChatbotBtn = chatbotModal.querySelector('.close-btn');
const searchInput = document.querySelector('.search-bar input');

// DOM Elements for Goals
const goalInput = document.getElementById('goalInput');
const addGoalBtn = document.getElementById('addGoalBtn');
const goalList = document.getElementById('goalList');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    if (!authModal || !skillsGrid || !notesList || !progressStats) {
        console.error('Required DOM elements are missing');
        return;
    }

    fetchSkills();
    fetchNotes();
    fetchProgress();
    setupEventListeners();

    // Set up PDF upload display
    pdfUpload?.addEventListener('change', function () {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
});

// Fetch skills from the backend
async function fetchSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        const skills = await response.json();
        renderSkills(skills);
    } catch (err) {
        console.error('Error fetching skills:', err);
        alert('Unable to load skills. Please try again later.');
    }
}

// Render skills to the page
function renderSkills(skills) {
    skillsGrid.innerHTML = '';
    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <h3>${skill.name}</h3>
            <span class="category">${skill.category}</span>
            <p class="description">${skill.description}</p>
            <div class="user">
                <img src="${skill.user.avatar}" alt="${skill.user.name}">
                <div class="user-info">
                    <span class="name">${skill.user.name}</span>
                    <span class="rating">${skill.user.rating} ★</span>
                </div>
            </div>
            <button class="btn request-btn">Request Help</button>
        `;
        skillsGrid.appendChild(skillCard);
    });
}

// Fetch notes from the backend
async function fetchNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/notes`);
        if (!response.ok) throw new Error('Failed to fetch notes');
        const notes = await response.json();
        renderNotes(notes);
    } catch (err) {
        console.error('Error fetching notes:', err);
        alert('Unable to load notes. Please try again later.');
    }
}

// Render notes to the page
function renderNotes(notes) {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <div class="note-header">
                <h3>${note.title}</h3>
                <span class="subject">${note.subject}</span>
            </div>
            <p class="note-content">${note.content}</p>
            <div class="note-footer">
                <span class="date">${note.date}</span>
                ${note.hasPDF ? '<span class="pdf-badge">PDF</span>' : ''}
            </div>
        `;
        notesList.appendChild(noteItem);
    });
}

// Fetch progress data and render the graph
async function fetchProgress() {
    try {
        const response = await fetch(`${API_BASE_URL}/progress`);
        if (!response.ok) throw new Error(`Failed to fetch progress: ${response.status}`);
        const progress = await response.json();
        renderProgress(progress.subjects);
    } catch (err) {
        console.error('Error fetching progress:', err);
        alert('Unable to load progress data. Please try again later.');
    }
}

// Render the progress graph
function renderProgress(subjects) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects.map(subject => subject.name),
            datasets: [{
                label: 'Progress (%)',
                data: subjects.map(subject => subject.progress),
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Update the Progress Summary Box
    const progressStats = document.querySelector('.progress-stats ul');
    progressStats.innerHTML = subjects.map(subject => `
        <li>
            <span class="subject">${subject.name}</span>
            <span class="percentage">${subject.progress}%</span>
        </li>
    `).join('');
}

// Handle Login
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            authToken = data.token;
            localStorage.setItem('token', authToken);
            authModal.style.display = 'none';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred during login. Please try again.');
    }
}

// Handle Sign Up
async function handleSignUp() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Sign up successful!');
            authToken = data.token;
            localStorage.setItem('token', authToken);
            authModal.style.display = 'none';
        } else {
            alert(data.message || 'Sign up failed');
        }
    } catch (err) {
        console.error('Error during sign up:', err);
        alert('An error occurred during sign up. Please try again.');
    }
}

// Event Listeners for Login and Sign Up
document.getElementById('submitLogin')?.addEventListener('click', handleLogin);
document.getElementById('submitSignup')?.addEventListener('click', handleSignUp);

// Close modals when clicking outside
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Chatbot functionality
chatbotBtn?.addEventListener('click', () => {
    chatbotModal?.classList.toggle('visible'); // Use CSS class for visibility
});

closeChatbotBtn?.addEventListener('click', () => {
    chatbotModal?.classList.remove('visible');
});

window.addEventListener('click', (event) => {
    if (event.target === chatbotModal) {
        chatbotModal?.classList.remove('visible');
    }
});

// Search functionality for skills
searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const skills = skillsGrid?.querySelectorAll('.skill-card'); // Assuming each skill is a .skill-card

    skills?.forEach(skill => {
        const skillName = skill.textContent.toLowerCase();
        skill.style.display = skillName.includes(query) ? 'block' : 'none';
    });
});

// Add Goal Event Listener
addGoalBtn?.addEventListener('click', () => {
    const goalText = goalInput.value.trim();
    if (goalText === '') {
        alert('Please enter a goal.');
        return;
    }

    // Create a new goal item
    const goalItem = document.createElement('li');
    goalItem.innerHTML = `
        ${goalText}
        <button class="remove-goal-btn">Remove</button>
    `;

    // Add remove functionality
    goalItem.querySelector('.remove-goal-btn').addEventListener('click', () => {
        goalItem.remove();
    });

    // Append to the goal list
    goalList.appendChild(goalItem);

    // Clear the input
    goalInput.value = '';
});

// Call fetchProgress on page load
document.addEventListener('DOMContentLoaded', fetchProgress);
