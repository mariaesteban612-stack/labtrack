/**
 * USERS.JS - Gestión de usuarios y generación de datos iniciales
 * Genera usuarios automáticamente con contraseñas iniciales
 */

const Users = {
  // Base de datos inicial de personas de la institución
  INITIAL_DATA: [
    // ADMINISTRADORES
    { nombre: 'Carlos', apellido: 'García', role: 'admin' },
    { nombre: 'María', apellido: 'López', role: 'admin' },
    
    // DOCENTES
    { nombre: 'Juan', apellido: 'Pérez', role: 'docente' },
    { nombre: 'Ana', apellido: 'Martínez', role: 'docente' },
    { nombre: 'Luis', apellido: 'Rodríguez', role: 'docente' },
    { nombre: 'Patricia', apellido: 'González', role: 'docente' },
    
    // ESTUDIANTES
    { nombre: 'Roberto', apellido: 'Fernández', role: 'estudiante' },
    { nombre: 'Sofia', apellido: 'Ramírez', role: 'estudiante' },
    { nombre: 'Diego', apellido: 'Torres', role: 'estudiante' },
    { nombre: 'Laura', apellido: 'Vargas', role: 'estudiante' },
    { nombre: 'Miguel', apellido: 'Sánchez', role: 'estudiante' },
    { nombre: 'Elena', apellido: 'Moreno', role: 'estudiante' },
    { nombre: 'Carlos', apellido: 'Jiménez', role: 'estudiante' },
    { nombre: 'Isabella', apellido: 'Castro', role: 'estudiante' },
    { nombre: 'Fernando', apellido: 'Ruiz', role: 'estudiante' },
    { nombre: 'Valentina', apellido: 'Flores', role: 'estudiante' }
  ],

  DOMAIN: '@institucion.edu',

  /**
   * Generar correo institucional
   * Formato: nombre.apellido@institucion.edu
   */
  generateEmail(nombre, apellido) {
    const clean = (str) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
    
    return clean(nombre) + '.' + clean(apellido) + this.DOMAIN;
  },

  /**
   * Generar contraseña inicial
   * Formato: 00000_PA (00000 + _ + Primera letra Apellido + Primera letra Nombre)
   * Ejemplo: Juan Pérez -> 00000_pj
   */
  generateInitialPassword(nombre, apellido) {
    const firstApellido = apellido.charAt(0).toLowerCase();
    const firstNombre = nombre.charAt(0).toLowerCase();
    return `00000_${firstApellido}${firstNombre}`;
  },

  /**
   * Inicializar base de datos de usuarios
   * Crea usuarios desde INITIAL_DATA si no existen
   */
  initializeUsers() {
    const existingUsers = Storage.getUsers();
    
    // Si ya hay usuarios, no reinicializar
    if (existingUsers.length > 0) {
      return existingUsers;
    }

    // Crear usuarios nuevos
    const newUsers = this.INITIAL_DATA.map(person => {
      const email = this.generateEmail(person.nombre, person.apellido);
      const password = this.generateInitialPassword(person.nombre, person.apellido);
      
      return {
        id: 'USR-' + Date.now() + Math.random(),
        nombre: person.nombre,
        apellido: person.apellido,
        email: email,
        password: password,
        role: person.role,
        activo: true,
        primerLogin: true,
        passwordChanged: false,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
    });

    // Guardar en localStorage
    Storage.saveUsers(newUsers);
    console.log('✅ Base de datos de usuarios inicializada:', newUsers.length, 'usuarios creados');
    
    return newUsers;
  },

  /**
   * Obtener todos los usuarios
   */
  getAllUsers() {
    return Storage.getUsers();
  },

  /**
   * Obtener usuarios por rol
   */
  getUsersByRole(role) {
    return Storage.getUsers().filter(u => u.role === role && u.activo);
  },

  /**
   * Buscar usuario por email
   */
  findUserByEmail(email) {
    return Storage.getUserByEmail(email);
  },

  /**
   * Validar contraseña
   */
  validatePassword(user, password) {
    return user.password === password;
  },

  /**
   * Cambiar contraseña
   */
  changePassword(email, oldPassword, newPassword) {
    const user = Storage.getUserByEmail(email);
    
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (!this.validatePassword(user, oldPassword)) {
      return { success: false, message: 'Contraseña actual incorrecta' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }

    Storage.updateUser(email, {
      password: newPassword,
      passwordChanged: true,
      primerLogin: false
    });

    return { success: true, message: 'Contraseña actualizada exitosamente' };
  },

  /**
   * Registrar último login
   */
  updateLastLogin(email) {
    Storage.updateUser(email, {
      lastLogin: new Date().toISOString()
    });
  },

  /**
   * Verificar si es primer login
   */
  isPrimerLogin(email) {
    const user = Storage.getUserByEmail(email);
    return user ? user.primerLogin : false;
  },

  /**
   * Obtener información del perfil del usuario
   */
  getUserProfile(email) {
    const user = Storage.getUserByEmail(email);
    if (!user) return null;

    const { password, ...profile } = user;
    return profile;
  }
};
