/**
 * AUTH.JS - Sistema de autenticación y manejo de sesiones
 * Gestiona login, logout y validación de credenciales
 */

const Auth = {
  /**
   * Validar que sea correo institucional
   */
  isValidInstitutionalEmail(email) {
    return email.toLowerCase().endsWith('@institucion.edu');
  },

  /**
   * Login de usuario
   * @param {string} email - Email institucional
   * @param {string} password - Contraseña
   * @returns {object} - {success: boolean, user: object, message: string}
   */
  login(email, password) {
    // Validar que sea correo institucional
    if (!this.isValidInstitutionalEmail(email)) {
      return {
        success: false,
        message: 'Solo se permiten correos institucionales (@institucion.edu)'
      };
    }

    // Buscar usuario
    const user = Storage.getUserByEmail(email);
    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado. Verifique su correo institucional'
      };
    }

    // Verificar que esté activo
    if (!user.activo) {
      return {
        success: false,
        message: 'Este usuario ha sido desactivado. Contacte al administrador'
      };
    }

    // Validar contraseña
    if (!Users.validatePassword(user, password)) {
      return {
        success: false,
        message: 'Contraseña incorrecta'
      };
    }

    // Crear sesión
    const sessionData = {
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
      primerLogin: user.primerLogin
    };

    Storage.saveSession(sessionData);
    Users.updateLastLogin(email);

    return {
      success: true,
      user: sessionData,
      message: 'Sesión iniciada exitosamente'
    };
  },

  /**
   * Logout del usuario
   */
  logout() {
    Storage.clearSession();
    return { success: true, message: 'Sesión cerrada' };
  },

  /**
   * Obtener usuario actual de la sesión
   */
  getCurrentUser() {
    return Storage.getSession();
  },

  /**
   * Verificar si hay usuario logueado
   */
  isLoggedIn() {
    return Storage.isLoggedIn();
  },

  /**
   * Verificar permisos del usuario para una acción
   */
  hasPermission(role) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const hierarchy = {
      'admin': ['admin', 'docente', 'estudiante'],
      'docente': ['docente', 'estudiante'],
      'estudiante': ['estudiante']
    };

    return hierarchy[user.role] && hierarchy[user.role].includes(role);
  },

  /**
   * Verificar si es admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  /**
   * Verificar si es docente
   */
  isDocente() {
    const user = this.getCurrentUser();
    return user && (user.role === 'docente' || user.role === 'admin');
  },

  /**
   * Verificar si es estudiante
   */
  isEstudiante() {
    const user = this.getCurrentUser();
    return user && user.role === 'estudiante';
  },

  /**
   * Redirigir a login si no está autenticado
   */
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  /**
   * Redirigir según rol
   */
  redirectByRole() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    window.location.href = 'dashboard.html';
  }
};
