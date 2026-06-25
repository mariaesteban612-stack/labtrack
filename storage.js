/**
 * STORAGE.JS - Gestión de persistencia con localStorage
 * Wrapper centralizado para todas las operaciones de almacenamiento
 */

const Storage = {
  // ============================================
  // USUARIOS
  // ============================================
  
  saveUsers(users) {
    localStorage.setItem('sc_users', JSON.stringify(users));
  },

  getUsers() {
    const data = localStorage.getItem('sc_users');
    return data ? JSON.parse(data) : [];
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return user;
  },

  updateUser(email, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      return users[userIndex];
    }
    return null;
  },

  // ============================================
  // SESIONES
  // ============================================

  saveSession(sessionData) {
    const session = {
      ...sessionData,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem('sc_session', JSON.stringify(session));
  },

  getSession() {
    const data = localStorage.getItem('sc_session');
    if (!data) return null;
    
    const session = JSON.parse(data);
    
    // Validar que la sesión no esté expirada
    if (new Date(session.expiresAt) < new Date()) {
      this.clearSession();
      return null;
    }
    
    return session;
  },

  clearSession() {
    localStorage.removeItem('sc_session');
  },

  isLoggedIn() {
    return this.getSession() !== null;
  },

  // ============================================
  // RESERVAS
  // ============================================

  saveReservas(reservas) {
    localStorage.setItem('sc_reservas', JSON.stringify(reservas));
  },

  getReservas() {
    const data = localStorage.getItem('sc_reservas');
    return data ? JSON.parse(data) : [];
  },

  addReserva(reserva) {
    const reservas = this.getReservas();
    const newReserva = {
      id: 'RES-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'activa',
      ...reserva
    };
    reservas.push(newReserva);
    this.saveReservas(reservas);
    return newReserva;
  },

  updateReserva(id, updates) {
    const reservas = this.getReservas();
    const index = reservas.findIndex(r => r.id === id);
    if (index !== -1) {
      reservas[index] = { ...reservas[index], ...updates };
      this.saveReservas(reservas);
      return reservas[index];
    }
    return null;
  },

  deleteReserva(id) {
    const reservas = this.getReservas();
    const filtered = reservas.filter(r => r.id !== id);
    this.saveReservas(filtered);
  },

  getReservasByUser(email) {
    const reservas = this.getReservas();
    return reservas.filter(r => r.usuarioEmail === email);
  },

  getReservasByLab(lab) {
    const reservas = this.getReservas();
    return reservas.filter(r => r.laboratorio === lab);
  },

  // ============================================
  // EQUIPOS / PCs
  // ============================================

  savePCs(pcs) {
    localStorage.setItem('sc_pcs', JSON.stringify(pcs));
  },

  getPCs() {
    const data = localStorage.getItem('sc_pcs');
    return data ? JSON.parse(data) : [];
  },

  getPCsByLab(lab) {
    const pcs = this.getPCs();
    return pcs.filter(p => p.laboratorio === lab);
  },

  updatePC(id, updates) {
    const pcs = this.getPCs();
    const index = pcs.findIndex(p => p.id === id);
    if (index !== -1) {
      pcs[index] = { ...pcs[index], ...updates };
      this.savePCs(pcs);
      return pcs[index];
    }
    return null;
  },

  // ============================================
  // SALAS/LABORATORIOS
  // ============================================

  saveLaboratorios(labs) {
    localStorage.setItem('sc_laboratorios', JSON.stringify(labs));
  },

  getLaboratorios() {
    const data = localStorage.getItem('sc_laboratorios');
    return data ? JSON.parse(data) : [];
  },

  // ============================================
  // DATOS SIMULADOS BI
  // ============================================

  saveDataBI(data) {
    localStorage.setItem('sc_data_bi', JSON.stringify(data));
  },

  getDataBI() {
    const data = localStorage.getItem('sc_data_bi');
    return data ? JSON.parse(data) : [];
  },

  // ============================================
  // LIMPIAR TODO (DEV)
  // ============================================

  clearAll() {
    localStorage.removeItem('sc_users');
    localStorage.removeItem('sc_session');
    localStorage.removeItem('sc_reservas');
    localStorage.removeItem('sc_pcs');
    localStorage.removeItem('sc_laboratorios');
    localStorage.removeItem('sc_data_bi');
  }
};
