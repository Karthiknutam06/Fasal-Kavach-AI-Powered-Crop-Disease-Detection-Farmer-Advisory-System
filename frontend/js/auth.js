
document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

    // ---- Event Listeners ----
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        loginForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        registerForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
                if (input.id === 'password' || input.id === 'confirmPassword') {
                    validatePasswordsMatch();
                }
            });
            input.addEventListener('blur', () => {
                validateField(input);
                if (input.id === 'password' || input.id === 'confirmPassword') {
                    validatePasswordsMatch();
                }
            });
        });
    }

    // Toggle Password Visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            toggleVisibility('password', this);
        });
    }

    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            toggleVisibility('confirmPassword', this);
        });
    }
});

function toggleVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.replace('ph-eye', 'ph-eye-closed');
    } else {
        input.type = 'password';
        iconElement.classList.replace('ph-eye-closed', 'ph-eye');
    }
}

function validateField(input) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Reset classes
    input.classList.remove('valid', 'invalid');

    if (value === '') {
        isValid = false;
        errorMessage = `${input.parentElement.querySelector('label').textContent} is required.`;
    } else {
        // Specific validations
        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
            case 'password':
                // For register form, enforce strong password
                if (input.closest('#registerForm')) {
                    const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
                    if (!passRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Min 8 chars, 1 uppercase, 1 number.';
                    }
                } else {
                    // Just verify it's not empty for login
                    if (value.length < 1) {
                        isValid = false;
                        errorMessage = 'Password cannot be empty.';
                    }
                }
                break;
            case 'text':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Must be at least 3 characters.';
                }
                break;
        }
    }

    if (!isValid) {
        input.classList.add('invalid');
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.style.display = 'block';
        }
    } else {
        input.classList.add('valid');
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
    }

    return isValid;
}

function validatePasswordsMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if (!confirmPassword || !password) return true;

    const errorSpan = confirmPassword.parentElement.querySelector('.error-message');
    let isValid = true;

    // First validate the individual inputs
    const isConfirmValid = validateField(confirmPassword);

    if (isConfirmValid && password.value !== confirmPassword.value) {
        confirmPassword.classList.remove('valid');
        confirmPassword.classList.add('invalid');
        if (errorSpan) {
            errorSpan.textContent = 'Passwords do not match.';
            errorSpan.style.display = 'block';
        }
        isValid = false;
    } else if (isConfirmValid) {
        // If they match and the field is otherwise valid
        confirmPassword.classList.remove('invalid');
        confirmPassword.classList.add('valid');
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
    }

    return isValid && isConfirmValid;
}

async function handleLogin(e) {
    e.preventDefault();

    let isFormValid = true;
    const inputs = e.target.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!validateField(input)) isFormValid = false;
    });

    if (!isFormValid) return;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Realistic Mock Authentication logic
    const regEmail = localStorage.getItem('registeredEmail') || 'kisan@example.com';
    const regPass = localStorage.getItem('registeredPassword') || 'Fasal@123';

    if (email !== regEmail || password !== regPass) {
        const passInput = document.getElementById('password');
        passInput.classList.remove('valid');
        passInput.classList.add('invalid');
        const errSpan = document.getElementById('passwordError');
        errSpan.textContent = 'Incorrect email or password.';
        errSpan.style.display = 'block';
        return;
    }

    const btn = document.getElementById('loginBtn');
    
    btn.innerHTML = '<i class="ph ph-spinner" style="animation: spin 1s linear infinite;"></i> Authenticating...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        // Success animation before redirect
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Success!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    }, 1500);
}

async function handleRegister(e) {
    e.preventDefault();

    let isFormValid = true;
    const inputs = e.target.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!validateField(input)) isFormValid = false;
    });

    if (!validatePasswordsMatch()) isFormValid = false;

    if (!isFormValid) return;

    // Save registered credentials to local storage for realistic login later
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('registeredPassword', password);

    const btn = document.getElementById('registerBtn');
    btn.innerHTML = '<i class="ph ph-spinner" style="animation: spin 1s linear infinite;"></i> Creating Account...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Account Created!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    }, 1500);
}
