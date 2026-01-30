const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
const APP_PASSWORD = process.env.APP_PASSWORD || 'reservas2024';
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-jwt-super-seguro-98765';

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
app.use(cookieParser());
app.use(express.static('public'));

// Middleware de autenticación con JWT
function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  
  console.log('🔐 Verificando token:', token ? 'Presente' : 'Ausente');
  
  if (!token) {
    console.log('❌ No hay token');
    return res.status(401).json({ error: 'No autorizado - Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
}

// Ruta de login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  console.log('🔑 Intento de login');
  
  if (password === APP_PASSWORD) {
    // Crear token JWT
    const token = jwt.sign(
      { authenticated: true, loginTime: Date.now() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Guardar token en cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    
    console.log('✅ Login exitoso, token creado');
    res.json({ success: true, message: 'Login exitoso' });
  } else {
    console.log('❌ Contraseña incorrecta');
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
  }
});

// Ruta de logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token');
  console.log('👋 Logout exitoso');
  res.json({ success: true });
});

// Verificar si está autenticado
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

// API: Obtener todas las reservas
app.get('/api/reservations', requireAuth, (req, res) => {
  try {
    console.log('📋 Obteniendo reservas');
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY date, time').all();
    console.log(`✅ ${reservations.length} reservas encontradas`);
    res.json(reservations);
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// API: Crear nueva reserva
app.post('/api/reservations', requireAuth, (req, res) => {
  try {
    const { nombre, apellido, rut, whatsapp, valor, date, time, duration } = req.body;
    
    console.log('📝 Datos recibidos:', req.body);
    
    if (!nombre || !date || !time) {
      console.error('❌ Faltan campos requeridos');
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const durationNum = parseFloat(duration) || 1;

    const stmt = db.prepare(`
      INSERT INTO reservations (nombre, apellido, rut, whatsapp, valor, date, time, duration, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      nombre || '', 
      apellido || '', 
      rut || '', 
      whatsapp || '', 
      valor || '', 
      date, 
      time, 
      durationNum, 
      new Date().toISOString()
    );

    const newReservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    console.log('✅ Reserva creada:', newReservation);
    res.json(newReservation);
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear reserva', details: error.message });
  }
});

// API: Actualizar reserva
app.put('/api/reservations/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, rut, whatsapp, valor, date, time, duration } = req.body;

    console.log(`📝 Actualizando reserva ${id}`);

    const stmt = db.prepare(`
      UPDATE reservations 
      SET nombre = ?, apellido = ?, rut = ?, whatsapp = ?, valor = ?, date = ?, time = ?, duration = ?
      WHERE id = ?
    `);

    stmt.run(nombre, apellido || '', rut || '', whatsapp || '', valor || '', date, time, duration, id);
    
    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    console.log('✅ Reserva actualizada');
    res.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
});

// API: Eliminar reserva
app.delete('/api/reservations/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando reserva ${id}`);
    const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
    stmt.run(id);
    console.log('✅ Reserva eliminada');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al eliminar:', error);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
});

// Servir la aplicación
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Servidor corriendo en puerto', PORT);
  console.log('🔐 Contraseña configurada:', APP_PASSWORD);
  console.log('📊 Base de datos: reservas.db');
  console.log('🔑 Autenticación: JWT Tokens');
  console.log('='.repeat(50));
});
