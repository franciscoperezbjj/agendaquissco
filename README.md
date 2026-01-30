# 📅 Sistema de Reservas

Sistema profesional de gestión de reservas con calendario, autenticación y base de datos en la nube.

## ✨ Características

- 🔐 **Autenticación con contraseña** - Protege tu información
- 📊 **Calendario visual** - Visualiza todas tus reservas
- 💾 **Base de datos SQLite** - Datos persistentes y sincronizados
- 📱 **Diseño responsivo** - Funciona en móvil, tablet y escritorio
- 📥 **Exportación a CSV** - Descarga todos tus registros
- ✏️ **Edición completa** - Modifica y elimina reservas fácilmente

## 🚀 Despliegue en Railway

### Paso 1: Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate con tu cuenta de GitHub (es gratis)

### Paso 2: Subir el proyecto

**Opción A: Desde GitHub (Recomendado)**

1. Crea un repositorio en GitHub
2. Sube todos los archivos del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Sistema de reservas"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

3. En Railway:
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Selecciona tu repositorio
   - Railway detectará automáticamente que es Node.js

**Opción B: Deploy directo**

1. En Railway, click en "New Project"
2. Selecciona "Empty Project"
3. Click en "Deploy from GitHub"
4. Sube los archivos

### Paso 3: Configurar variables de entorno

En Railway, ve a tu proyecto y agrega estas variables:

```
APP_PASSWORD=tu-contraseña-segura-aqui
SESSION_SECRET=otra-clave-secreta-aleatoria
NODE_ENV=production
```

**⚠️ IMPORTANTE**: Cambia `APP_PASSWORD` por tu contraseña real. Esta será la contraseña para acceder al sistema.

### Paso 4: Configurar dominio

Railway te dará una URL automática como:
```
https://tu-proyecto.up.railway.app
```

¡Listo! Tu sistema estará disponible en esa URL.

## 💻 Desarrollo Local

Para probar en tu computadora:

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start
```

Abre: `http://localhost:3000`

**Contraseña por defecto**: `reservas2024`

## 📖 Cómo usar

1. **Acceder**: Ingresa con tu contraseña
2. **Crear reserva**: 
   - Pega el texto con formato:
     ```
     Nombre: Juan
     Apellido: Pérez
     Rut: 12345678-9
     Whatsapp: +56912345678
     Valor: 50000
     ```
   - Selecciona fecha, hora y duración
   - Click en "Guardar Reserva"

3. **Ver reservas**: Aparecen en el calendario
4. **Editar/Eliminar**: Click en cualquier reserva
5. **Exportar**: Click en "Exportar CSV"

## 🔒 Seguridad

- Autenticación con sesiones
- Contraseña configurable
- Base de datos SQLite segura
- Solo usuarios autenticados pueden acceder

## 🛠️ Estructura del proyecto

```
.
├── server.js           # Backend Node.js + Express
├── package.json        # Dependencias
├── public/
│   └── index.html     # Frontend completo
├── reservas.db        # Base de datos (se crea automáticamente)
└── README.md          # Este archivo
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `APP_PASSWORD` | Contraseña de acceso | `reservas2024` |
| `SESSION_SECRET` | Clave para sesiones | Auto-generada |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |

## 📝 Notas

- La base de datos SQLite se crea automáticamente al iniciar
- Los datos persisten entre reinicios
- Railway incluye hosting gratuito con límites razonables
- Puedes cambiar la contraseña en cualquier momento en Railway

## 🆘 Soporte

Si tienes problemas:

1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs en Railway (tab "Deployments")
3. Asegúrate de que `package.json` y `server.js` estén en la raíz

## 📄 Licencia

Uso libre para proyectos personales y comerciales.

---

¡Disfruta tu sistema de reservas! 🎉
