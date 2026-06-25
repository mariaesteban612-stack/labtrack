# LabTrack 🖥️

**Sistema Institucional de Gestión de Salas de Cómputo**

LabTrack es una plataforma web completa diseñada para gestionar eficientemente las salas de cómputo de instituciones educativas. Incluye autenticación segura, control de acceso por roles, reservas de equipos y un dashboard completo con KPIs y análisis de inteligencia de negocios.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnología](#-tecnología)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Usuarios de Demostración](#-usuarios-de-demostración)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Documentación Técnica](#-documentación-técnica)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## ✨ Características

### 🔐 Autenticación Institucional
- ✅ Login con correo institucional (@institucion.edu)
- ✅ Contraseñas iniciales generadas automáticamente
- ✅ Cambio de contraseña obligatorio en primer login
- ✅ Validación de sesiones activas
- ✅ Logout seguro con limpieza de sesión

### 👥 Control de Acceso por Roles
- **Administrador**: Control total del sistema
- **Docente**: Puede crear y gestionar reservas
- **Estudiante**: Acceso limitado a consultas

### 📅 Sistema de Reservas
- ✅ Crear nuevas reservas de laboratorios
- ✅ Ver disponibilidad en tiempo real
- ✅ Cancelar reservas propias
- ✅ Historial de reservas
- ✅ Validación de conflictos de horarios

### 📊 Dashboard Completo
- ✅ KPIs en tiempo real
- ✅ Gráficos interactivos con Chart.js
- ✅ Reportes de inteligencia de negocios
- ✅ Estadísticas por laboratorio
- ✅ Disponibilidad de equipos

### 🔧 Administración (Solo Admin)
- ✅ Gestión de usuarios
- ✅ Control de equipos y laboratorios
- ✅ Generación de reportes
- ✅ Auditoría de accesos

---

## 🛠️ Tecnología

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno y responsivo
- **JavaScript Vanilla** - Sin dependencias externas
- **Chart.js** - Gráficos interactivos

### Persistencia
- **localStorage** - Almacenamiento local en navegador
- **JSON** - Estructura de datos

### Preparado para
- Firebase Realtime Database
- Node.js + Express
- Bases de datos relacionales (MySQL, PostgreSQL)

---

## 📦 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (opcional para la versión local)
- No requiere instalación de software adicional

---

## 🚀 Instalación

### Opción 1: Clonar el repositorio

```bash
git clone https://github.com/mariaesteban612-stack/labtrack.git
cd labtrack
```

### Opción 2: Descargar ZIP

1. Click en "Code" → "Download ZIP"
2. Descomprime el archivo
3. Abre `index.html` en tu navegador

### Opción 3: Servidor Local (Recomendado)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Luego accede a `http://localhost:8000`

---

## 📖 Uso

### Primer Acceso

1. **Abre** `index.html` o accede a la URL del servidor
2. **Ingresa** con uno de los usuarios de demostración
3. **Cambia** tu contraseña en el primer login
4. **Accede** al dashboard según tu rol

### Flujo de Usuario

```
┌─────────────┐
│  Login Page │ → Validación de credenciales
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│ Cambiar Password │ (Solo primer login)
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│   Dashboard      │ → Diferenciado por rol
└──────────────────┘
   ├─ Resumen
   ├─ Mis Reservas
   ├─ Disponibilidad
   ├─ Nueva Reserva (Docente/Admin)
   └─ Administración (Solo Admin)
```

---

## 📁 Estructura del Proyecto

```
labtrack/
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal
├── styles.css              # Estilos globales
├── auth.js                 # Módulo de autenticación
├── users.js                # Gestión de usuarios
├── storage.js              # Persistencia (localStorage)
├── login.js                # Lógica del login
├── dashboard.js            # Lógica del dashboard
└── README.md               # Esta documentación
```

### Descripción de Módulos

#### **storage.js**
Wrapper centralizado de localStorage para operaciones de datos.

```javascript
Storage.getUsers()           // Obtener todos los usuarios
Storage.saveUsers(users)     // Guardar usuarios
Storage.getSession()         // Obtener sesión actual
Storage.saveSession(data)    // Guardar sesión
Storage.getReservas()        // Obtener reservas
Storage.addReserva(data)     // Crear nueva reserva
```

#### **users.js**
Gestión de usuarios, generación automática de credenciales.

```javascript
Users.initializeUsers()      // Inicializar BD usuarios
Users.getAllUsers()          // Obtener todos
Users.findUserByEmail(email) // Buscar por email
Users.changePassword(...)    // Cambiar contraseña
Users.getUsersByRole(role)   // Filtrar por rol
```

#### **auth.js**
Sistema de autenticación y validación de permisos.

```javascript
Auth.login(email, password)  // Login
Auth.logout()                // Logout
Auth.getCurrentUser()        // Usuario actual
Auth.isLoggedIn()            // Verificar sesión
Auth.isAdmin()               // Verificar si es admin
Auth.hasPermission(role)     // Verificar permisos
```

#### **dashboard.js**
Lógica principal del dashboard y gestión de datos.

```javascript
Dashboard.init()             // Inicializar
Dashboard.switchTab(name)    // Cambiar pestaña
Dashboard.crearReserva(data) // Crear reserva
Dashboard.cancelarReserva(id)// Cancelar reserva
```

---

## 👥 Usuarios de Demostración

### Administrador
```
Email:    carlos.garcia@institucion.edu
Password: 00000_gc
Rol:      Administrador (acceso total)
```

### Docente
```
Email:    juan.perez@institucion.edu
Password: 00000_pj
Rol:      Docente (reservas y reportes)
```

### Estudiante
```
Email:    roberto.fernandez@institucion.edu
Password: 00000_fr
Rol:      Estudiante (consulta de disponibilidad)
```

### Otros Usuarios Disponibles

**Administradores:**
- maria.lopez@institucion.edu (00000_lm)

**Docentes:**
- ana.martinez@institucion.edu (00000_ma)
- luis.rodriguez@institucion.edu (00000_rl)
- patricia.gonzalez@institucion.edu (00000_gp)

**Estudiantes:**
- sofia.ramirez@institucion.edu (00000_rs)
- diego.torres@institucion.edu (00000_td)
- laura.vargas@institucion.edu (00000_vl)
- miguel.sanchez@institucion.edu (00000_sm)
- elena.moreno@institucion.edu (00000_me)
- carlos.jimenez@institucion.edu (00000_jc)
- isabella.castro@institucion.edu (00000_ci)
- fernando.ruiz@institucion.edu (00000_rf)
- valentina.flores@institucion.edu (00000_fv)

---

## 🎯 Funcionalidades Principales

### Para Estudiantes
- ✅ Consultar disponibilidad de laboratorios
- ✅ Ver sus reservas
- ✅ Cambiar contraseña

### Para Docentes
- ✅ Crear nuevas reservas
- ✅ Cancelar reservas propias
- ✅ Consultar disponibilidad
- ✅ Ver historial de reservas
- ✅ Acceder al dashboard

### Para Administradores
- ✅ Todas las funciones de docentes
- ✅ Gestionar usuarios
- ✅ Controlar equipos y laboratorios
- ✅ Generar reportes
- ✅ Acceder a datos de auditoría
- ✅ Ver gráficas de KPIs

---

## 📚 Documentación Técnica

### Formato de Datos

#### Usuario
```json
{
  "id": "USR-1234567890",
  "nombre": "Carlos",
  "apellido": "García",
  "email": "carlos.garcia@institucion.edu",
  "password": "00000_gc",
  "role": "admin",
  "activo": true,
  "primerLogin": false,
  "passwordChanged": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLogin": "2024-01-20T14:45:00Z"
}
```

#### Reserva
```json
{
  "id": "RES-1234567890",
  "usuarioEmail": "juan.perez@institucion.edu",
  "laboratorio": "lab-a",
  "fecha": "2024-01-25",
  "horaInicio": "09:00",
  "horaFin": "11:00",
  "motivo": "Clase de Bases de Datos",
  "status": "activa",
  "createdAt": "2024-01-20T15:00:00Z"
}
```

#### Laboratorio
```json
{
  "id": "lab-a",
  "nombre": "Laboratorio A",
  "capacidad": 30,
  "ubicacion": "Piso 2"
}
```

### Validaciones

#### Email Institucional
- Debe terminar en `@institucion.edu`
- Formato: `nombre.apellido@institucion.edu`
- No se permiten correos externos

#### Contraseña
- Mínimo 6 caracteres
- Inicial: `00000_[Primera letra Apellido][Primera letra Nombre]`
- Ejemplo: Juan Pérez → `00000_pj`

#### Reserva
- La hora de fin debe ser mayor que la de inicio
- No pueden solaparse reservas en el mismo laboratorio
- La fecha debe ser futura o actual
- Motivo es obligatorio

---

## 🔐 Seguridad

### Implementado
- ✅ Validación de correo institucional
- ✅ Sesiones con expiración (24 horas)
- ✅ Logout seguro
- ✅ Control de acceso por roles
- ✅ No exposición de contraseñas en HTML

### Recomendaciones para Producción
- 🔒 Hash de contraseñas con bcrypt
- 🔒 HTTPS obligatorio
- 🔒 Rate limiting en login
- 🔒 Auditoría de accesos
- 🔒 Encriptación de datos sensibles
- 🔒 CSRF tokens en formularios
- 🔒 Autenticación de dos factores (2FA)

---

## 🚧 Roadmap

### Fase 2 (Próximo)
- [ ] Integración con Firebase
- [ ] API REST con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación OAuth2
- [ ] Notificaciones por email
- [ ] SMS de confirmación
- [ ] QR para check-in automático

### Fase 3
- [ ] App móvil (React Native)
- [ ] Integraciones con Google Calendar
- [ ] Reporte automático de incidencias
- [ ] Sistema de multas por no presentación
- [ ] Chat en tiempo real
- [ ] Videoconferencia integrada

---

## 🐛 Solución de Problemas

### Las sesiones no persisten
**Solución:** Verifica que localStorage esté habilitado en tu navegador.
```javascript
if (typeof(Storage) === "undefined") {
    console.error("localStorage no disponible");
}
```

### Los usuarios no aparecen
**Solución:** Limpia localStorage y recarga la página.
```javascript
Storage.clearAll();
location.reload();
```

### Error: "Usuario no encontrado"
**Solución:** Verifica que el correo tenga el formato correcto: `nombre.apellido@institucion.edu`

### Las reservas no se guardan
**Solución:** Verifica que haya espacio disponible en localStorage (típicamente 5-10MB).

---

## 📞 Soporte

Para reportar bugs o solicitar features:
1. Abre un issue en GitHub
2. Describe el problema con detalles
3. Incluye pasos para reproducir
4. Añade capturas de pantalla si es necesario

---

## 📄 Licencia

MIT License - Libre para usar en proyectos educativos e institucionales.

```
Copyright (c) 2024 LabTrack

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y archivos de documentación asociados (el "Software"), para usar
el Software sin restricción...
```

---

## 👨‍💻 Autores

- **María Estebán** - Desarrollo Principal
- Contribuidores bienvenidos 🤝

---

## 🙏 Agradecimientos

- Chart.js por las gráficas interactivas
- La comunidad de desarrolladores
- Instituciones educativas que usan LabTrack

---

## 📊 Estadísticas del Proyecto

- **Líneas de código:** 2000+
- **Archivos:** 8
- **Usuarios soportados:** Ilimitados
- **Laboratorios:** 4 (escalable)
- **Tiempo de carga:** < 1 segundo

---

**LabTrack** - *Gestión inteligente de salas de cómputo* 🚀

*Última actualización: Junio 2024*
