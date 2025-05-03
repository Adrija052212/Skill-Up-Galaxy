// API Base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api/v1'; // For development
// const API_BASE_URL = 'https://your-deployed-backend.com/api/v1'; // For production

// Global variables
let currentUser = null;
let authToken = null;

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

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
<<<<<<< HEAD
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
=======

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
});

// Check if user is already logged in
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                currentUser = user;
                authToken = token;
                updateUIForLoggedInUser();
                loadInitialData();
            } else {
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error('Error checking auth status:', err);
        }
    }
}

// Setup event listeners
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
    
    // Close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Form submissions
<<<<<<< HEAD
    submitSkillBtn.addEventListener('click', addNewSkill);
    submitRequestBtn.addEventListener('click', addNewRequest);
    saveNoteBtn.addEventListener('click', saveNewNote);

    // Goal handling
    goalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            progressData.goals.push(this.value.trim());
            renderGoals();
            this.value = '';
=======
    submitLogin.addEventListener('click', handleLogin);
    submitSignup.addEventListener('click', handleSignup);
    
    // Skill-related event listeners
    document.getElementById('offerSkillBtn').addEventListener('click', () => {
        if (!currentUser) {
            showAuthModal();
            return;
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099
        }
        document.getElementById('offerSkillModal').style.display = 'block';
    });
    
    document.getElementById('submitSkillBtn').addEventListener('click', addNewSkill);
    
    // Note-related event listeners
    document.getElementById('saveNoteBtn').addEventListener('click', saveNewNote);
    document.getElementById('summarizeBtn').addEventListener('click', summarizeContent);
    
    // Chatbot event listeners
    document.querySelector('.chatbot-btn').addEventListener('click', toggleChatbot);
    document.getElementById('sendChatbotQuery').addEventListener('click', sendChatbotMessage);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        authToken = data.token;
        currentUser = data.user;
        
        // Update UI
        updateUIForLoggedInUser();
        authModal.style.display = 'none';
        loadInitialData();
        
    } catch (err) {
        alert(err.message);
        console.error('Login error:', err);
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        authToken = data.token;
        currentUser = data.user;
        
        // Update UI
        updateUIForLoggedInUser();
        authModal.style.display = 'none';
        loadInitialData();
        
    } catch (err) {
        alert(err.message);
        console.error('Signup error:', err);
    }
}

// Update UI when user logs in
function updateUIForLoggedInUser() {
    // Hide auth buttons
    document.querySelector('.auth-buttons').style.display = 'none';
    
    // Show user profile (you'll need to add this element to your HTML)
    const userProfile = document.createElement('div');
    userProfile.className = 'user-profile';
    userProfile.innerHTML = `
        <img src="${currentUser.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}" alt="${currentUser.name}">
        <span>${currentUser.name}</span>
        <button id="logoutBtn">Logout</button>
    `;
    document.querySelector('header .container').appendChild(userProfile);
    
    // Add logout event listener
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    authToken = null;
    currentUser = null;
    location.reload(); // Refresh the page to reset the UI
}

// Load initial data after login
async function loadInitialData() {
    try {
        // Load skills
        const skillsResponse = await fetch(`${API_BASE_URL}/skills`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const skillsData = await skillsResponse.json();
        renderSkills(skillsData.data);
        
        // Load notes
        const notesResponse = await fetch(`${API_BASE_URL}/notes`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const notesData = await notesResponse.json();
        renderNotes(notesData.data);
        
        // Load progress
        const progressResponse = await fetch(`${API_BASE_URL}/progress`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const progressData = await progressResponse.json();
        renderProgress(progressData.data);
        
    } catch (err) {
        console.error('Error loading initial data:', err);
    }
}

// Render skills to the page
function renderSkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = '';
    
    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <h3>${skill.title}</h3>
            <span class="category">${skill.category}</span>
            <p class="description">${skill.description}</p>
            <div class="user">
                <img src="${skill.user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}" alt="${skill.user.name}">
                <div class="user-info">
                    <span class="name">${skill.user.name}</span>
                </div>
            </div>
            <button class="btn request-btn">Request Help</button>
        `;
        skillsGrid.appendChild(skillCard);
    });
<<<<<<< HEAD

    sendChatbotQuery.addEventListener('click', sendChatbotMessage);
=======
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099
}

// Add new skill
async function addNewSkill() {
    const name = document.getElementById('skillName').value;
    const category = document.getElementById('skillCategory').value;
    const description = document.getElementById('skillDescription').value;

<<<<<<< HEAD
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
=======
    if (!name || !category || !description) {
        alert('Please fill all fields');
        return;
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099
    }

    try {
        const response = await fetch(`${API_BASE_URL}/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title: name,
                category,
                description
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add skill');
        }

        // Refresh skills list
        loadInitialData();
        document.getElementById('offerSkillModal').style.display = 'none';
        document.getElementById('skillName').value = '';
        document.getElementById('skillDescription').value = '';
        
    } catch (err) {
        alert(err.message);
        console.error('Error adding skill:', err);
    }
}

// Save new note
async function saveNewNote() {
    const title = document.getElementById('noteTitle').value;
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value;
    const pdfFile = document.getElementById('pdfUpload').files[0];

    if (!title || !subject || !content) {
        alert('Please fill all required fields');
        return;
    }

<<<<<<< HEAD
        notesData.push(newNote);
        renderNotes(notesData);
=======
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('content', content);
    if (pdfFile) {
        formData.append('file', pdfFile);
    }
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099

    try {
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to save note');
        }

        // Refresh notes list
        loadInitialData();
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('pdfUpload').value = '';
        document.getElementById('fileName').textContent = 'No file chosen';
        
    } catch (err) {
        alert(err.message);
        console.error('Error saving note:', err);
    }
}

<<<<<<< HEAD
// Send chatbot message
function sendChatbotMessage() {
    const query = chatbotQuery.value.trim();
    if (query) {
        // Add user message
        addChatbotMessage(query, 'user');
=======
// Summarize content
async function summarizeContent() {
    const content = document.getElementById('noteContent').value;
    
    if (!content) {
        alert('Please enter some content to summarize');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/chatbot/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ text: content })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to generate summary');
        }

        // Show summary (you might want to display this in a modal or directly in the UI)
        alert(`Summary:\n\n${data.summary}`);
        
    } catch (err) {
        alert(err.message);
        console.error('Error summarizing content:', err);
    }
}

// Chatbot functions
function toggleChatbot() {
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotModal.style.display = chatbotModal.style.display === 'block' ? 'none' : 'block';
}
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099

async function sendChatbotMessage() {
    const query = document.getElementById('chatbotQuery').value.trim();
    if (!query) return;

    // Add user message to chat
    addChatMessage(query, 'user-message');
    document.getElementById('chatbotQuery').value = '';

    try {
        const response = await fetch(`${API_BASE_URL}/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ message: query })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get chatbot response');
        }

        // Add bot response to chat
        addChatMessage(data.response, 'bot-message');
        
    } catch (err) {
        addChatMessage("Sorry, I'm having trouble responding right now.", 'bot-message');
        console.error('Error with chatbot:', err);
    }
}

function addChatMessage(message, className) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
<<<<<<< HEAD

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
=======
>>>>>>> 5838be9b4f69981d98068b2b8b48c651c6e77099
