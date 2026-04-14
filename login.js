document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    // Load users from localStorage, or set default
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        users.push({ email: 'admin@example.com', password: 'admin123' });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check if user exists
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('loggedInUser', email);
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password');
        }
    });

    // Password toggle
    const passwordInput = document.getElementById('password');
    document.getElementById('toggleLoginPassword').addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            this.textContent = '👁️';
        }
    });
});