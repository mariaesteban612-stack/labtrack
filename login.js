/**
 * LOGIN.JS - Lógica de login y gestión del formulario
 */

// Inicializar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar base de datos de usuarios
    Users.initializeUsers();

    // Si ya está logueado, redirigir al dashboard
    if (Auth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
});

/**
 * Manejar el login
 */
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Limpiar mensajes previos
    clearError();

    // Intentar login
    const result = Auth.login(email, password);

    if (!result.success) {
        showError(result.message);
        return;
    }

    // Login exitoso
    showToast('✅ ' + result.message, 'success');

    // Si es primer login, mostrar modal de cambio de contraseña
    if (result.user.primerLogin) {
        setTimeout(() => {
            showChangePasswordModal();
        }, 500);
    } else {
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
}

/**
 * Manejar cambio de contraseña
 */
function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (newPassword.length < 6) {
        showChangePasswordError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (newPassword !== confirmPassword) {
        showChangePasswordError('Las contraseñas no coinciden');
        return;
    }

    // Obtener usuario actual
    const user = Auth.getCurrentUser();
    if (!user) {
        showChangePasswordError('Error: Usuario no encontrado');
        return;
    }

    // Cambiar contraseña
    const result = Users.changePassword(user.email, currentPassword, newPassword);

    if (!result.success) {
        showChangePasswordError(result.message);
        return;
    }

    // Actualizar sesión con primerLogin = false
    Storage.updateUser(user.email, { primerLogin: false });

    showToast('✅ Contraseña actualizada correctamente', 'success');

    setTimeout(() => {
        document.getElementById('changePasswordModal').style.display = 'none';
        window.location.href = 'dashboard.html';
    }, 1500);
}

/**
 * Mostrar modal de cambio de contraseña
 */
function showChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'flex';
}

/**
 * Alternar visibilidad de contraseña
 */
function togglePasswordVisibility() {
    const input = document.getElementById('password');
    const button = document.querySelector('.toggle-password');

    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

/**
 * Mostrar error
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

/**
 * Limpiar error
 */
function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
}

/**
 * Mostrar error en modal de cambio de contraseña
 */
function showChangePasswordError(message) {
    const errorDiv = document.getElementById('changePasswordError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

/**
 * Mostrar notificación tipo toast
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
