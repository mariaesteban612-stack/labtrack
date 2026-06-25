/**
 * DASHBOARD.JS - Lógica del dashboard y gestión de datos
 */

// Estado global del dashboard
const Dashboard = {
  currentUser: null,
  laboratorios: [
    { id: 'lab-a', nombre: 'Laboratorio A', capacidad: 30, ubicacion: 'Piso 2' },
    { id: 'lab-b', nombre: 'Laboratorio B', capacidad: 25, ubicacion: 'Piso 3' },
    { id: 'lab-c', nombre: 'Laboratorio C', capacidad: 20, ubicacion: 'Piso 4' },
    { id: 'lab-d', nombre: 'Laboratorio D', capacidad: 30, ubicacion: 'Piso 5' }
  ],

  // Inicializar dashboard
  init() {
    // Validar que esté logueado
    if (!Auth.requireLogin()) return;

    this.currentUser = Auth.getCurrentUser();
    this.renderSidebar();
    this.renderHeader();
    this.loadLaboratorios();
    this.loadReservas();
    this.renderStats();
    this.setupEventListeners();
  },

  // Renderizar sidebar
  renderSidebar() {
    const userRole = this.currentUser.role;
    const roleLabel = {
      'admin': 'Administrador',
      'docente': 'Docente',
      'estudiante': 'Estudiante'
    }[userRole];

    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    let navItems = `
      <div class="nav-item active" onclick="Dashboard.switchTab('resumen')">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Resumen</span>
      </div>
      <div class="nav-item" onclick="Dashboard.switchTab('reservas')">
        <span class="nav-icon">📅</span>
        <span class="nav-label">Mis Reservas</span>
      </div>
      <div class="nav-item" onclick="Dashboard.switchTab('disponibilidad')">
        <span class="nav-icon">✅</span>
        <span class="nav-label">Disponibilidad</span>
      </div>
    `;

    // Opciones adicionales para docentes y admins
    if (userRole === 'docente' || userRole === 'admin') {
      navItems += `
        <div class="nav-item" onclick="Dashboard.switchTab('nueva-reserva')">
          <span class="nav-icon">➕</span>
          <span class="nav-label">Nueva Reserva</span>
        </div>
      `;
    }

    // Opciones de admin
    if (userRole === 'admin') {
      navItems += `
        <div style="border-top: 1px solid var(--border); margin-top: 10px; padding-top: 10px;">
          <div class="nav-item" onclick="Dashboard.switchTab('usuarios')">
            <span class="nav-icon">👥</span>
            <span class="nav-label">Usuarios</span>
          </div>
          <div class="nav-item" onclick="Dashboard.switchTab('equipos')">
            <span class="nav-icon">🖥️</span>
            <span class="nav-label">Equipos</span>
          </div>
          <div class="nav-item" onclick="Dashboard.switchTab('reportes')">
            <span class="nav-icon">📈</span>
            <span class="nav-label">Reportes BI</span>
          </div>
        </div>
      `;
    }

    sidebar.innerHTML = navItems;

    // Actualizar user-info en footer
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      userInfo.innerHTML = `
        <div class="user-name">👤 ${this.currentUser.nombre} ${this.currentUser.apellido}</div>
        <div class="user-role">${roleLabel}</div>
      `;
    }
  },

  // Renderizar header
  renderHeader() {
    const header = document.querySelector('.header-title');
    if (header) {
      const title = {
        'resumen': '📊 Resumen del Sistema',
        'reservas': '📅 Mis Reservas',
        'disponibilidad': '✅ Disponibilidad',
        'nueva-reserva': '➕ Nueva Reserva',
        'usuarios': '👥 Gestión de Usuarios',
        'equipos': '🖥️ Gestión de Equipos',
        'reportes': '📈 Reportes BI'
      };

      const currentTab = document.querySelector('.tab-content.active')?.id || 'tab-resumen';
      const tabName = currentTab.replace('tab-', '');
      header.textContent = title[tabName] || 'Dashboard';
    }
  },

  // Cambiar pestaña
  switchTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });

    // Mostrar pestaña seleccionada
    const tab = document.getElementById('tab-' + tabName);
    if (tab) {
      tab.classList.add('active');
      this.renderHeader();

      // Actualizar nav items
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      event.target.closest('.nav-item')?.classList.add('active');
    }
  },

  // Cargar laboratorios
  loadLaboratorios() {
    const labs = Storage.getLaboratorios();
    if (labs.length === 0) {
      Storage.saveLaboratorios(this.laboratorios);
    }
  },

  // Cargar reservas
  loadReservas() {
    const reservas = Storage.getReservas();
    if (reservas.length === 0) {
      // Crear reservas de ejemplo
      const ejemploReservas = [
        {
          usuarioEmail: 'juan.perez@institucion.edu',
          laboratorio: 'lab-a',
          fecha: this.getFechaFormato(0),
          horaInicio: '09:00',
          horaFin: '11:00',
          motivo: 'Clase de Bases de Datos',
          status: 'activa'
        },
        {
          usuarioEmail: 'juan.perez@institucion.edu',
          laboratorio: 'lab-b',
          fecha: this.getFechaFormato(1),
          horaInicio: '14:00',
          horaFin: '16:00',
          motivo: 'Laboratorio Programación',
          status: 'activa'
        }
      ];
      ejemploReservas.forEach(r => Storage.addReserva(r));
    }
  },

  // Obtener fecha formateada
  getFechaFormato(diasDespues = 0) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasDespues);
    return fecha.toISOString().split('T')[0];
  },

  // Renderizar estadísticas
  renderStats() {
    const usuario = this.currentUser.email;
    const reservas = Storage.getReservasByUser(usuario);
    const laboratorios = Storage.getLaboratorios();

    const stats = {
      totalReservas: reservas.length,
      reservasActivas: reservas.filter(r => r.status === 'activa').length,
      laboratorios: laboratorios.length,
      usuariosActivos: Storage.getUsers().filter(u => u.activo).length
    };

    // Actualizar stats en HTML
    document.getElementById('totalReservas').textContent = stats.totalReservas;
    document.getElementById('reservasActivas').textContent = stats.reservasActivas;
    document.getElementById('totalLabs').textContent = stats.laboratorios;
    document.getElementById('usuariosActivos').textContent = stats.usuariosActivos;

    this.renderReservasTable();
  },

  // Renderizar tabla de reservas
  renderReservasTable() {
    const usuario = this.currentUser.email;
    const reservas = Storage.getReservasByUser(usuario);
    const tbody = document.querySelector('#reservasTable tbody');

    if (!tbody) return;

    if (reservas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-light);">No tienes reservas</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reservas.map(reserva => `
      <tr>
        <td>${reserva.id}</td>
        <td>${this.getNombreLaboratorio(reserva.laboratorio)}</td>
        <td>${reserva.fecha}</td>
        <td>${reserva.horaInicio} - ${reserva.horaFin}</td>
        <td><span class="badge badge-success">${reserva.status}</span></td>
        <td>
          <button class="btn btn-danger btn-small" onclick="Dashboard.cancelarReserva('${reserva.id}')">Cancelar</button>
        </td>
      </tr>
    `).join('');
  },

  // Obtener nombre del laboratorio
  getNombreLaboratorio(labId) {
    const labs = Storage.getLaboratorios();
    const lab = labs.find(l => l.id === labId);
    return lab ? lab.nombre : 'Desconocido';
  },

  // Renderizar disponibilidad
  renderDisponibilidad() {
    const labs = Storage.getLaboratorios();
    const container = document.getElementById('disponibilidadContainer');

    if (!container) return;

    container.innerHTML = labs.map(lab => {
      const equiposDisp = Math.floor(Math.random() * (lab.capacidad - 5)) + 5;
      const porcentaje = Math.round((equiposDisp / lab.capacidad) * 100);

      return `
        <div class="card">
          <div class="card-header">${lab.nombre}</div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${equiposDisp}/${lab.capacidad}</div>
            <div style="font-size: 12px; color: var(--text-light);">Equipos disponibles</div>
          </div>
          <div style="height: 8px; background: var(--light); border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${porcentaje}%; background: var(--success); border-radius: 4px;"></div>
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: var(--text-light);">
            ${porcentaje}% disponible
          </div>
        </div>
      `;
    }).join('');
  },

  // Crear nueva reserva
  crearReserva(formData) {
    const error = this.validarReserva(formData);
    if (error) {
      this.showError(error);
      return false;
    }

    const reserva = Storage.addReserva({
      usuarioEmail: this.currentUser.email,
      laboratorio: formData.laboratorio,
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      motivo: formData.motivo
    });

    this.showSuccess('✅ Reserva creada exitosamente: ' + reserva.id);
    this.renderStats();
    return true;
  },

  // Validar reserva
  validarReserva(data) {
    if (!data.laboratorio) return 'Selecciona un laboratorio';
    if (!data.fecha) return 'Selecciona una fecha';
    if (!data.horaInicio) return 'Selecciona hora de inicio';
    if (!data.horaFin) return 'Selecciona hora de fin';
    if (data.horaInicio >= data.horaFin) return 'La hora de fin debe ser mayor que la de inicio';
    if (!data.motivo) return 'Ingresa el motivo de la reserva';
    return null;
  },

  // Cancelar reserva
  cancelarReserva(reservaId) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      Storage.deleteReserva(reservaId);
      this.showSuccess('✅ Reserva cancelada');
      this.renderStats();
    }
  },

  // Mostrar error
  showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error show';
    toast.textContent = '❌ ' + message;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  // Mostrar éxito
  showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success show';
    toast.textContent = message;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  // Setup event listeners
  setupEventListeners() {
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    const formReserva = document.getElementById('formNuevaReserva');
    if (formReserva) {
      formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = {
          laboratorio: document.getElementById('selectLab').value,
          fecha: document.getElementById('inputFecha').value,
          horaInicio: document.getElementById('inputHoraInicio').value,
          horaFin: document.getElementById('inputHoraFin').value,
          motivo: document.getElementById('inputMotivo').value
        };
        if (this.crearReserva(datos)) {
          formReserva.reset();
          this.switchTab('reservas');
        }
      });
    }

    // Renderizar disponibilidad al cambiar de tab
    const navDisponibilidad = document.querySelector('[onclick*="disponibilidad"]');
    if (navDisponibilidad) {
      navDisponibilidad.addEventListener('click', () => {
        setTimeout(() => this.renderDisponibilidad(), 100);
      });
    }
  },

  // Logout
  logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
      Auth.logout();
      window.location.href = 'index.html';
    }
  }
};

// Inicializar cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});
