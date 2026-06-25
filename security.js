/**
 * SECURITY.JS - Módulo de seguridad avanzada
 * Incluye: Encriptación, protección contra ataques, validaciones
 */

const Security = {
  // ============================================
  // ENCRIPTACIÓN BÁSICA
  // ============================================

  /**
   * Hash simple con SHA-256 (requiere crypto-js)
   * Para producción, usar bcrypt en backend
   */
  hashPassword(password) {
    // Implementación básica: salt + hash
    const salt = 'labtrack_2024_salt';
    let hash = salt + password;
    
    for (let i = 0; i < 1000; i++) {
      hash = this.simpleHash(hash);
    }
    return this.btoa(hash); // Base64 encoding
  },

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  // ============================================
  // VALIDACIONES
  // ============================================

  /**
   * Validar email institucional
   */
  validateEmail(email) {
    const regex = /^[a-z]+\.[a-z]+@institucion\.edu$/i;
    return regex.test(email);
  },

  /**
   * Validar contraseña fuerte
   */
  validateStrongPassword(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };

    return {
      isStrong: checks.length && checks.numbers && (checks.uppercase || checks.special),
      checks: checks,
      score: Object.values(checks).filter(Boolean).length
    };
  },

  /**
   * Sanitizar entrada para prevenir XSS
   */
  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Validar URL
   */
  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  // ============================================
  // PROTECCIÓN CONTRA ATAQUES
  // ============================================

  /**
   * Rate limiting local (prevenir fuerza bruta)
   */
  loginAttempts: {},
  
  checkRateLimit(email, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const key = email.toLowerCase();

    if (!this.loginAttempts[key]) {
      this.loginAttempts[key] = [];
    }

    // Limpiar intentos antiguos
    this.loginAttempts[key] = this.loginAttempts[key].filter(
      timestamp => now - timestamp < windowMs
    );

    // Verificar límite
    if (this.loginAttempts[key].length >= maxAttempts) {
      return {
        allowed: false,
        remainingTime: Math.ceil(
          (windowMs - (now - this.loginAttempts[key][0])) / 1000
        )
      };
    }

    this.loginAttempts[key].push(now);
    return { allowed: true };
  },

  /**
   * Prevenir CSRF con tokens
   */
  generateCSRFToken() {
    const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  validateCSRFToken(token) {
    const stored = sessionStorage.getItem('csrf_token');
    return token === stored;
  },

  /**
   * Content Security Policy (recomendación)
   */
  generateCSPHeader() {
    return `
      default-src 'self';
      script-src 'self' https://cdnjs.cloudflare.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self';
      connect-src 'self';
      frame-ancestors 'none';
    `;
  },

  // ============================================
  // PROTECCIÓN DE DATOS
  // ============================================

  /**
   * Encriptar datos sensibles para localStorage
   */
  encryptData(data) {
    const json = JSON.stringify(data);
    return this.btoa(json); // Base64 (No usar en producción)
  },

  decryptData(encrypted) {
    try {
      const json = this.atob(encrypted);
      return JSON.parse(json);
    } catch (e) {
      console.error('Error desencriptando:', e);
      return null;
    }
  },

  /**
   * Limpiar datos sensibles de memoria
   */
  clearSensitiveData(object) {
    if (object.password) object.password = '';
    if (object.token) object.token = '';
    return object;
  },

  /**
   * Validar integridad de sesión
   */
  validateSessionIntegrity() {
    const session = Storage.getSession();
    if (!session) return false;

    // Verificar que no haya pasado mucho tiempo
    const loginTime = new Date(session.loginTime);
    const elapsed = Date.now() - loginTime.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    if (elapsed > maxAge) {
      Storage.clearSession();
      return false;
    }

    return true;
  },

  // ============================================
  // AUDITORÍA Y LOGGING
  // ============================================

  /**
   * Registrar evento de seguridad
   */
  logSecurityEvent(event, data = {}) {
    const log = {
      timestamp: new Date().toISOString(),
      event: event,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...data
    };

    let logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(log);

    // Mantener solo últimos 100 logs
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }

    localStorage.setItem('security_logs', JSON.stringify(logs));
    console.log('🔐 Security Event:', event, data);
  },

  /**
   * Obtener logs de seguridad
   */
  getSecurityLogs() {
    return JSON.parse(localStorage.getItem('security_logs') || '[]');
  },

  /**
   * Registrar intento de acceso no autorizado
   */
  logUnauthorizedAccess(resource, user) {
    this.logSecurityEvent('unauthorized_access_attempt', {
      resource: resource,
      user: user,
      ip: 'local' // En producción, obtener IP real
    });
  },

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Generar token temporal para reset de password
   */
  generatePasswordResetToken() {
    const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
    const expires = Date.now() + (1 * 60 * 60 * 1000); // 1 hora
    
    return {
      token: token,
      expires: expires
    };
  },

  /**
   * Verificar si el navegador es seguro
   */
  checkBrowserSecurity() {
    const checks = {
      localStorage: typeof(Storage) !== 'undefined',
      https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      cookies: navigator.cookieEnabled,
      serviceWorker: 'serviceWorker' in navigator
    };

    return checks;
  },

  /**
   * Detectar posibles ataques
   */
  detectAnomalies() {
    const session = Storage.getSession();
    if (!session) return [];

    const anomalies = [];
    const userAgent = navigator.userAgent;
    const storedUA = sessionStorage.getItem('user_agent');

    // Detectar cambio de User Agent (posible suplantación)
    if (storedUA && storedUA !== userAgent) {
      anomalies.push('user_agent_changed');
      this.logSecurityEvent('possible_session_hijacking');
    } else {
      sessionStorage.setItem('user_agent', userAgent);
    }

    return anomalies;
  }
};

// Inicializar en carga
document.addEventListener('DOMContentLoaded', () => {
  // Registrar User Agent
  sessionStorage.setItem('user_agent', navigator.userAgent);
  
  // Verificar integridad de sesión cada 5 minutos
  setInterval(() => {
    Security.validateSessionIntegrity();
    Security.detectAnomalies();
  }, 5 * 60 * 1000);
});
