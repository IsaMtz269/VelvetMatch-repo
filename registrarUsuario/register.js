// ============================================================
// register.js — Velvet Match
// Misma estructura y funciones que login.js
// ============================================================

// Toggle de visibilidad de contraseña
// Acepta el id del input y del ícono para reutilizarlo en los 2 campos
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Manejo del formulario de registro
function handleRegister(event) {
    event.preventDefault();

    const firstName       = document.getElementById('firstName').value.trim();
    const lastName        = document.getElementById('lastName').value.trim();
    const email           = document.getElementById('email').value.trim();
    const birthdate       = document.getElementById('birthdate').value;
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // --- Validaciones ---

    // Campos vacíos
    if (!firstName || !lastName || !email || !birthdate || !password || !confirmPassword) {
        showToast('Por favor completa todos los campos', 'error');
        return;
    }

    // Nombre y apellido: solo letras
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        showToast('El nombre solo puede contener letras', 'error');
        return;
    }

    // Formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Por favor ingresa un email válido', 'error');
        return;
    }

    // Edad mínima: 18 años
    const today    = new Date();
    const birth    = new Date(birthdate);
    const age      = today.getFullYear() - birth.getFullYear();
    const monthOk  = today.getMonth() > birth.getMonth() ||
                     (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    const realAge  = monthOk ? age : age - 1;
    if (realAge < 18) {
        showToast('Debes tener al menos 18 años para registrarte', 'error');
        return;
    }

    // Contraseña mínimo 8 caracteres
    if (password.length < 8) {
        showToast('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    // Las contraseñas deben coincidir
    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }

    // --- Registro exitoso ---
    // Aquí se haría el llamado al backend; por ahora simulamos el éxito
    showToast('¡Cuenta creada exitosamente!', 'success');

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Toast notification (misma función que en login.js)
function showToast(message, type = 'info') {
    const toast        = document.getElementById('toast');
    const toastIcon    = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    // Ícono según tipo
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error')   iconClass = 'fa-exclamation-circle';

    toastIcon.className    = `fas ${iconClass}`;
    toastMessage.textContent = message;

    // Color según tipo
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
    } else {
        toast.style.background = 'var(--gradient-primary)';
    }

    toast.classList.remove('hidden');

    // Ocultar después de 3 segundos
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Efectos de focus en los inputs (igual que login.js)
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Animación de entrada de la tarjeta (igual que login.js)
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.login-card');
    card.style.opacity = '0';
    setTimeout(() => {
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        card.style.opacity    = '1';
    }, 100);
});

// Enter key también dispara el registro
document.getElementById('registerForm').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleRegister(e);
    }
});

// Parallax de los elementos flotantes al hacer scroll (igual que login.js)
window.addEventListener('scroll', () => {
    const floatingElements = document.querySelectorAll('.floating-element');
    const scrolled = window.pageYOffset;
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});