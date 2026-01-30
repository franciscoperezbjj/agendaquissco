const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la contraseña (puedes cambiarla en Railway con variables de entorno)
const APP_PASSWORD = process.env.APP_PASSWORD || 'reservas2024';

// Inicializar base de datos SQLite
const db = new Database('reservas.db');

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT,
    rut TEXT,
    whatsapp TEXT,
    valor TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    duration REAL NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi-secreto-super-seguro-12345',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
  }
}));

// Middleware de autenticación
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
}

// Ruta de login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (password === APP_PASSWORD) {
    req.session.authenticated = true;
    res.json({ success: true, message: 'Login exitoso' });
  } else {
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
  }
});

// Ruta de logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Verificar si está autenticado
app.get('/api/check-auth', (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

// API: Obtener todas las reservas
app.get('/api/reservations', requireAuth, (req, res) => {
  try {
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY date, time').all();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// API: Crear nueva reserva
app.post('/api/reservations', requireAuth, (req, res) => {
  try {
    const { nombre, apellido, rut, whatsapp, valor, date, time, duration } = req.body;
    
    if (!nombre || !date || !time || !duration) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const stmt = db.prepare(`
      INSERT INTO reservations (nombre, apellido, rut, whatsapp, valor, date, time, duration, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      nombre, 
      apellido || '', 
      rut || '', 
      whatsapp || '', 
      valor || '', 
      date, 
      time, 
      duration, 
      new Date().toISOString()
    );

    const newReservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    res.json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// API: Actualizar reserva
app.put('/api/reservations/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, rut, whatsapp, valor, date, time, duration } = req.body;

    const stmt = db.prepare(`
      UPDATE reservations 
      SET nombre = ?, apellido = ?, rut = ?, whatsapp = ?, valor = ?, date = ?, time = ?, duration = ?
      WHERE id = ?
    `);

    stmt.run(nombre, apellido || '', rut || '', whatsapp || '', valor || '', date, time, duration, id);
    
    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
});

// API: Eliminar reserva
app.delete('/api/reservations/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
});

// Servir la aplicación
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔐 Contraseña configurada: ${APP_PASSWORD}`);
  console.log(`📊 Base de datos: reservas.db`);
});
