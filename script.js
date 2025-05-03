// Sample data for the application
let skillsData = [
    {
        id: 1,
        name: "Python Tutoring",
        category: "Technical",
        description: "I can help with Python programming basics, data structures, and small projects.",
        user: {
            name: "Alex Johnson",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 4.8
        }
    },
    {
        id: 2,
        name: "Essay Editing",
        category: "Academic",
        description: "I can proofread and edit essays for grammar, structure, and clarity.",
        user: {
            name: "Maria Garcia",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 4.9
        }
    }
];

let requestsData = [
    {
        id: 1,
        title: "Need help with Calculus",
        category: "Academic",
        description: "Struggling with derivatives and integrals. Need someone to explain concepts clearly.",
        user: {
            name: "Jamie Smith",
            avatar: "https://randomuser.me/api/portraits/women/33.jpg"
        }
    }
];

let notesData = [
    {
        id: 1,
        title: "Python Data Structures",
        subject: "Programming",
        content: "Lists: mutable, ordered collection\nTuples: immutable, ordered\nDictionaries: key-value pairs\nSets: unordered, unique elements",
        date: new Date().toISOString().split('T')[0],
        hasPDF: false,
        fileName: null
    }
];

let progressData = {
    subjects: [
        { name: "Math", percentage: 75 },
        { name: "Science", percentage: 60 },
        { name: "History", percentage: 85 },
        { name: "Language", percentage: 50 },
        { name: "Programming", percentage: 90 }
    ],
    goals: []
};

let activityLogs = {
    skills: [],
    notes: [],
    lectures: []
};

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const skillsGrid = document.getElementById('skillsGrid');
const notesList = document.getElementById('notesList');
const progressStats = document.getElementById('progressStats');
const goalList = document.getElementById('goalList');
const goalInput = document.getElementById('goalInput');
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const offerSkillModal = document.getElementById('offerSkillModal');
const requestSkillModal = document.getElementById('requestSkillModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const offerSkillBtn = document.getElementById('offerSkillBtn');
const requestSkillBtn = document.getElementById('requestSkillBtn');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const closeButtons = document.querySelectorAll('.close-btn');
const submitSkillBtn = document.getElementById('submitSkillBtn');
const submitRequestBtn = document.getElementById('submitRequestBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const pdfUpload = document.getElementById('pdfUpload');
const fileName = document.getElementById('fileName');
const chatbotBtn = document.querySelector('.chatbot-btn');
const chatbotModal = document.getElementById('chatbotModal');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotQuery = document.getElementById('chatbotQuery');
const sendChatbotQuery = document.getElementById('sendChatbotQuery');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    fetchSkills();
    fetchNotes();
    fetchProgress();
    renderGoals();
    setupEventListeners();
    initializeChart();

    // Set up PDF upload display
    pdfUpload.addEventListener('change', function () {
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

// Fetch progress data from the backend
async function fetchProgress() {
    try {
        const response = await fetch(`${API_BASE_URL}/progress`);
        if (!response.ok) throw new Error('Failed to fetch progress');
        const progress = await response.json();
        renderProgress(progress.subjects);
    } catch (err) {
        console.error('Error fetching progress:', err);
        alert('Unable to load progress data. Please try again later.');
    }
}

// Render progress stats
function renderProgress(subjects) {
    progressStats.innerHTML = '';
    subjects.forEach(subject => {
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        progressItem.innerHTML = `
            <div class="progress-header">
                <span class="subject-name">${subject.name}</span>
                <span class="percentage">${subject.percentage}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${subject.percentage}%"></div>
            </div>
        `;
        progressStats.appendChild(progressItem);
    });
}

// Render goals
function renderGoals() {
    goalList.innerHTML = '';
    progressData.goals.forEach((goal, index) => {
        const goalItem = document.createElement('li');
        goalItem.className = 'goal-item';
        goalItem.innerHTML = `
            <span>${goal}</span>
            <button class="delete-goal" data-index="${index}">×</button>
        `;
        goalList.appendChild(goalItem);
    });
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const labels = progressData.subjects.map(subject => subject.name);
    const data = progressData.subjects.map(subject => subject.percentage);

    new Chart(ctx, {
        type: 'bar', // You can change this to 'line', 'pie', etc.
        data: {
            labels: labels,
            datasets: [{
                label: 'Progress (%)',
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    // Auth modal toggles
    loginBtn.addEventListener('click', () => authModal.style.display = 'block');
    signupBtn.addEventListener('click', () => authModal.style.display = 'block');
    switchToSignup.addEventListener('click', () => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    switchToLogin.addEventListener('click', () => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Skill modals
    offerSkillBtn.addEventListener('click', () => offerSkillModal.style.display = 'block');
    requestSkillBtn.addEventListener('click', () => requestSkillModal.style.display = 'block');
    
    // Close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Form submissions
    submitSkillBtn.addEventListener('click', addNewSkill);
    submitRequestBtn.addEventListener('click', addNewRequest);
    saveNoteBtn.addEventListener('click', saveNewNote);

    // Goal handling
    goalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            progressData.goals.push(this.value.trim());
            renderGoals();
            this.value = '';
        }
    });

    // Chatbot handling
    chatbotBtn.addEventListener('click', () => {
        chatbotModal.style.display = chatbotModal.style.display === 'block' ? 'none' : 'block';
    });

    sendChatbotQuery.addEventListener('click', sendChatbotMessage);
}

// Add new skill
function addNewSkill() {
    const name = document.getElementById('skillName').value;
    const category = document.getElementById('skillCategory').value;
    const description = document.getElementById('skillDescription').value;

    if (name && category && description) {
        const newSkill = {
            id: skillsData.length + 1,
            name,
            category,
            description,
            user: {
                name: "Current User",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                rating: 5.0
            }
        };

        skillsData.push(newSkill);
        renderSkills(skillsData);
        offerSkillModal.style.display = 'none';

        // Reset form
        document.getElementById('offerSkillForm').reset();
    }
}

// Add new request
function addNewRequest() {
    const title = document.getElementById('requestTitle').value;
    const category = document.getElementById('requestCategory').value;
    const description = document.getElementById('requestDescription').value;

    if (title && category && description) {
        const newRequest = {
            id: requestsData.length + 1,
            title,
            category,
            description,
            user: {
                name: "Current User",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg"
            }
        };

        requestsData.push(newRequest);
        requestSkillModal.style.display = 'none';

        // Reset form
        document.getElementById('requestSkillForm').reset();

        // In a real app, you would update the requests display
        alert('Request submitted successfully!');
    }
}

// Save new note
function saveNewNote() {
    const title = document.getElementById('noteTitle').value;
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value;
    const pdfFile = pdfUpload.files[0];

    if (title && subject && content) {
        const newNote = {
            id: notesData.length + 1,
            title,
            subject,
            content,
            date: new Date().toISOString().split('T')[0],
            hasPDF: !!pdfFile,
            fileName: pdfFile ? pdfFile.name : null
        };

        notesData.push(newNote);
        renderNotes(notesData);

        // Reset form
        document.getElementById('noteForm').reset();
        fileName.textContent = 'No file chosen';
    }
}

// Send chatbot message
function sendChatbotMessage() {
    const query = chatbotQuery.value.trim();
    if (query) {
        // Add user message
        addChatbotMessage(query, 'user');

        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "I can help with that. What specific information do you need?",
                "That's an interesting question. Let me look that up for you.",
                "I'm still learning, but I'll do my best to answer your question.",
                "Could you provide more details about what you're asking?"
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addChatbotMessage(response, 'bot');
        }, 1000);

        chatbotQuery.value = '';
    }
}

// Add message to chatbot
function addChatbotMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
            localStorage.setItem('token', data.token);
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
            localStorage.setItem('token', data.token);
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
document.getElementById('submitLogin').addEventListener('click', handleLogin);
document.getElementById('submitSignup').addEventListener('click', handleSignUp);

// Close modals when clicking outside
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});