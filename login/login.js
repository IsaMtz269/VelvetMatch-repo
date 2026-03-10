// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validación básica
    if (!email || !password) {
        showToast('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Validación de contraseña (mínimo 8 caracteres)
    if (password.length < 8) {
        showToast('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    // Simulación de login exitoso
    showToast('¡Inicio de sesión exitoso!', 'success');
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = 'pantalla_principal.html';
    }, 2000);
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    // Configurar icono según el tipo
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    
    toastIcon.className = `fas ${iconClass}`;
    toastMessage.textContent = message;
    
    // Cambiar color según el tipo
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
    } else {
        toast.style.background = 'var(--gradient-primary)';
    }
    
    // Mostrar toast
    toast.classList.remove('hidden');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Animate floating elements on scroll
window.addEventListener('scroll', () => {
    const floatingElements = document.querySelectorAll('.floating-element');
    const scrolled = window.pageYOffset;
    
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = scrolled * speed;
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add focus effects to inputs
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Smooth reveal animation for login card
document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.opacity = '0';
    
    setTimeout(() => {
        loginCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        loginCard.style.opacity = '1';
    }, 100);
});

// Prevent form submission on enter key (handled by handleLogin)
document.getElementById('loginForm').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin(e);
    }
});