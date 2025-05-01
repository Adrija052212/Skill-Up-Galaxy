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
const summarizeBtn = document.getElementById('summarizeBtn');
const chatbotBtn = document.querySelector('.chatbot-btn');
const chatbotModal = document.getElementById('chatbotModal');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotQuery = document.getElementById('chatbotQuery');
const sendChatbotQuery = document.getElementById('sendChatbotQuery');
const summarizeNoteBtn = document.getElementById('summarizeNoteBtn');
const summarizeVideoBtn = document.getElementById('summarizeVideoBtn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderSkills();
    renderNotes();
    renderProgress();
    renderGoals();
    setupEventListeners();
    initializeChart();
    
    // Set up PDF upload display
    pdfUpload.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
});

// Render skills to the page
function renderSkills() {
    skillsGrid.innerHTML = '';
    skillsData.forEach(skill => {
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

// Render notes to the page
function renderNotes() {
    notesList.innerHTML = '';
    notesData.forEach(note => {
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
// Render progress stats
function renderProgress() {
    progressStats.innerHTML = '';
    progressData.subjects.forEach(subject => {
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
    summarizeBtn.addEventListener('click', () => summarizeContent());

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

    // Summarize buttons
    summarizeNoteBtn.addEventListener('click', () => summarizeContent('note'));
    summarizeVideoBtn.addEventListener('click', () => summarizeContent('video'));
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
        renderSkills();
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
        renderNotes();

        // Reset form
        document.getElementById('noteForm').reset();
        fileName.textContent = 'No file chosen';
    }
}

// Summarize content
function summarizeContent(type) {
    let content;
    if (type === 'note') {
        content = document.getElementById('noteContent').value;
    } else if (type === 'video') {
        content = "Video transcription would go here";
    } else {
        content = document.getElementById('summarizeText').value;
    }

    if (content) {
        // In a real app, this would call an API
        const summary = "This is a simulated summary of the content. In a real application, this would be generated by an AI service.";
        alert(`Summary:\n\n${summary}`);
    } else {
        alert(`Please enter some ${type === 'note' ? 'note content' : type === 'video' ? 'video URL' : 'text'} to summarize.`);
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

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});