// API Base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api/v1'; // For development
// const API_BASE_URL = 'https://your-deployed-backend.com/api/v1'; // For production

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
    submitLogin.addEventListener('click', handleLogin);
    submitSignup.addEventListener('click', handleSignup);
    
    // Skill-related event listeners
    document.getElementById('offerSkillBtn').addEventListener('click', () => {
        if (!currentUser) {
            showAuthModal();
            return;
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
}

// Add new skill
async function addNewSkill() {
    const name = document.getElementById('skillName').value;
    const category = document.getElementById('skillCategory').value;
    const description = document.getElementById('skillDescription').value;

    if (!name || !category || !description) {
        alert('Please fill all fields');
        return;
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('content', content);
    if (pdfFile) {
        formData.append('file', pdfFile);
    }

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
