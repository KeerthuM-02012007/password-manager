// Global variable to store passwords
let passwords = [];
let searchTerm = '';

function renderTable() {
    const passwordTableBody = document.getElementById('passwordTableBody');
    passwordTableBody.innerHTML = '';
    const filteredPasswords = passwords.filter(entry =>
        entry.website.toLowerCase().includes(searchTerm) ||
        entry.email.toLowerCase().includes(searchTerm)
    );
    filteredPasswords.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.website}</td>
            <td>${entry.email}</td>
            <td><span class="password-text" data-id="${entry.id}">••••••</span> <button onclick="togglePassword(event, ${entry.id})">👁️</button></td>
            <td><button onclick="copyPassword(${entry.id})">Copy</button> <button onclick="deletePassword(${entry.id})">Delete</button></td>
        `;
        passwordTableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if logged in
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    document.getElementById('welcomeMessage').textContent = `Welcome, ${loggedInUser}`;

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        searchTerm = this.value.toLowerCase();
        renderTable();
    });

    // Password toggle for form
    const passwordInput = document.getElementById('password');
    document.getElementById('toggleFormPassword').addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            this.textContent = '👁️';
        }
    });

    const passwordForm = document.getElementById('passwordForm');

    // Load saved passwords from localStorage
    passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    // Ensure each has an id
    passwords = passwords.map(entry => entry.id ? entry : { ...entry, id: Date.now() + Math.random() });

    // Initial render
    renderTable();

    // Handle form submission
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const website = document.getElementById('website').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Encrypt password using Base64
        const encryptedPassword = btoa(password);

        // Add to passwords array with id
        const id = Date.now();
        passwords.push({ id, website, email, password: encryptedPassword });

        // Save to localStorage
        localStorage.setItem('passwords', JSON.stringify(passwords));

        // Clear form
        passwordForm.reset();

        // Re-render table
        renderTable();
    });
});

window.deletePassword = function(id) {
    const index = passwords.findIndex(entry => entry.id === id);
    if (index !== -1) {
        passwords.splice(index, 1);
        localStorage.setItem('passwords', JSON.stringify(passwords));
        renderTable();
    }
};

window.togglePassword = function(event, id) {
    const button = event.target;
    const span = document.querySelector(`.password-text[data-id="${id}"]`);
    const entry = passwords.find(e => e.id === id);
    let decrypted;
    try {
        decrypted = atob(entry.password);
    } catch (e) {
        decrypted = entry.password;
    }
    if (span.textContent === '••••••') {
        span.textContent = decrypted;
        button.textContent = '🙈';
    } else {
        span.textContent = '••••••';
        button.textContent = '👁️';
    }
};

window.copyPassword = function(id) {
    const entry = passwords.find(e => e.id === id);
    let decrypted;
    try {
        decrypted = atob(entry.password);
    } catch (e) {
        decrypted = entry.password;
    }
    navigator.clipboard.writeText(decrypted).then(() => {
        alert('Password copied to clipboard!');
    });
};