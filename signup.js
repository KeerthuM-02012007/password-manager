document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    // Handle form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Load users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert('Email already exists');
            return;
        }

        // Add new user
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Account created successfully! Please login.');
        window.location.href = 'login.html';
    });

    // Password toggle
    const passwordInput = document.getElementById('password');
    document.getElementById('toggleSignupPassword').addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            this.textContent = '👁️';
        }
    });
});