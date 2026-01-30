# 📅 Sistema de Reservas

Sistema profesional de gestión de reservas con calendario y autenticación.

## 🚀 Subir a Railway en 3 pasos

### 1. Sube a GitHub

```bash
git init
git add .
git commit -m "Sistema de reservas"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

### 2. Conecta con Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige tu repositorio

### 3. Configura la contraseña

En Railway → Variables → Agregar:

```
APP_PASSWORD=TuContraseñaAqui
```

**¡Listo!** Railway te dará una URL como: `https://tu-app.up.railway.app`

## 🔐 Contraseña

Por defecto es: `reservas2024`

**IMPORTANTE:** Cámbiala en Railway con la variable `APP_PASSWORD`

## 💻 Usar la aplicación

1. **Login** con tu contraseña
2. **Pegar datos** con formato:
   ```
   Nombre: Juan
   Apellido: Pérez
   Rut: 12345678-9
   Whatsapp: +56912345678
   Valor: 50000
   ```
3. Selecciona **fecha, hora y duración**
4. Click en **"Guardar Reserva"**

## 📊 Exportar

Click en **"Exportar CSV"** para descargar todas las reservas.

---

✅ Funciona en móvil, tablet y escritorio  
✅ Datos guardados en la nube  
✅ Acceso desde cualquier dispositivo
