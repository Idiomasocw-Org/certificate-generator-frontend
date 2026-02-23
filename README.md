# 🎓 Generador de Certificados — Frontend

Interfaz web para la plataforma de emisión de certificados académicos de **Idiomas OCW (One Culture World)**.  
Permite a los docentes registrarse, iniciar sesión, generar certificados PDF personalizados y consultar su historial.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecución](#-ejecución)
- [Guía de Uso](#-guía-de-uso)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Páginas de la Aplicación](#-páginas-de-la-aplicación)
- [Despliegue en Producción](#-despliegue-en-producción)

---

## 🛠 Requisitos Previos

| Herramienta | Versión mínima |
|-------------|---------------|
| **Node.js** | v18 o superior |
| **npm** | v9 o superior |
| **Backend** | El servidor backend debe estar corriendo |

---

## 📦 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Idiomasocw-Org/certificate-generator-frontend.git

# 2. Entrar al directorio
cd certificate-generator-frontend

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
```

---

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del servidor backend | `http://localhost:3000` |

> ⚠️ **IMPORTANTE**: En producción, esta URL debe apuntar al dominio real del backend desplegado.

---

## ▶️ Ejecución

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Crear versión de producción
npm run build

# Previsualizar versión de producción
npm run preview
```

La aplicación se abrirá en `http://localhost:5173`.

> **Nota**: Asegúrate de que el backend esté corriendo en `http://localhost:3000` antes de usar la aplicación.

---

## 📖 Guía de Uso

### 1. Registro de Docente

1. Abre la aplicación en tu navegador: `http://localhost:5173`
2. En la pantalla de inicio de sesión, haz clic en **"¿No tienes cuenta? Regístrate aquí"**
3. El formulario cambiará a modo registro
4. Introduce tu **email** y una **contraseña** que cumpla con:
   - Mínimo **8 caracteres**
   - Al menos **1 letra mayúscula** (ej: A, B, C...)
   - Al menos **1 número** (ej: 1, 2, 3...)
5. Haz clic en **"CREAR MI CUENTA"**
6. Recibirás un mensaje de confirmación
7. Ahora puedes iniciar sesión con tus credenciales

### 2. Inicio de Sesión

1. Introduce tu **email** y **contraseña**
2. Haz clic en **"ENTRAR AHORA"**
3. Serás redirigido al **Dashboard** (panel principal)

### 3. Generar un Certificado

Una vez dentro del Dashboard:

1. En el formulario **"Emitir Certificado"** (lado izquierdo):
   - **Nombre del Estudiante**: Escribe el nombre completo del alumno
   - **Nivel CEFR**: Selecciona el nivel del curso (A1, A2, B1, B2, C1)
   - **Fecha de Emisión**: Selecciona la fecha (por defecto es hoy)
2. Haz clic en **"🏆 GENERAR CERTIFICADO"**
3. El certificado PDF se **descargará automáticamente** a tu carpeta de descargas
4. El certificado aparecerá en el **Historial de Certificados** (lado derecho)

### 4. Ver Historial de Certificados

- El historial se muestra automáticamente en la tabla del lado derecho del Dashboard
- Muestra los últimos 10 certificados generados
- Cada registro incluye: nombre del estudiante, nivel, fecha y hora de generación

### 5. Recuperar Contraseña Olvidada

1. En la pantalla de inicio de sesión, haz clic en **"¿Olvidaste tu contraseña?"**
2. Se abrirá un modal para introducir tu email
3. Introduce tu **email registrado** y haz clic en **"ENVIAR INSTRUCCIONES"**
4. Recibirás un correo con un enlace para restablecer tu contraseña
5. Haz clic en el enlace del correo
6. Serás redirigido a una página donde podrás crear una nueva contraseña
7. Introduce tu nueva contraseña (con los mismos requisitos del registro)
8. Haz clic en **"RESTABLECER CONTRASEÑA"**
9. Serás redirigido al inicio de sesión con tu nueva contraseña

### 6. Cerrar Sesión

- En el Dashboard, haz clic en el botón rojo **"Salir"** en la esquina superior derecha
- Serás redirigido a la pantalla de inicio de sesión

---

## 🏗 Arquitectura del Proyecto

```
certificate-generator-frontend/
├── src/
│   ├── main.tsx                # Punto de entrada de React
│   ├── App.tsx                 # Rutas y navegación principal
│   ├── index.css               # Estilos globales (Tailwind CSS)
│   ├── context/
│   │   ├── AuthContext.tsx      # Contexto de autenticación (sesión, cookies)
│   │   └── ToastContext.tsx     # Contexto de notificaciones emergentes
│   ├── components/
│   │   └── CertificateHistory.tsx  # Componente de tabla de historial
│   └── pages/
│       ├── Landing.tsx         # Página de bienvenida (no implementada aún)
│       ├── Login.tsx           # Página de inicio de sesión y registro
│       ├── Dashboard.tsx       # Panel principal (generar certificados)
│       └── ResetPassword.tsx   # Página de restablecimiento de contraseña
├── .env.example                # Ejemplo de variables de entorno
├── index.html                  # Archivo HTML principal
├── vite.config.ts              # Configuración de Vite
├── tailwind.config.js          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias y scripts
```

### Tecnologías principales:
- **React 18** — Librería de interfaz de usuario
- **TypeScript** — Tipado estático
- **Vite** — Empaquetador y servidor de desarrollo
- **Tailwind CSS** — Framework de estilos
- **React Router** — Navegación entre páginas
- **Lucide React** — Iconos
- **js-cookie** — Gestión de cookies del navegador

---

## 🖥 Páginas de la Aplicación

### Login (`/login`)
- Formulario de inicio de sesión y registro
- Opción para recuperar contraseña olvidada
- Diseño azul oscuro con acentos en celeste (#00bcd4)

### Dashboard (`/dashboard`)
- **Ruta protegida** — Solo accesible si has iniciado sesión
- Formulario para generar certificados (izquierda)
- Tabla de historial de certificados (derecha)
- Botón de cerrar sesión

### Reset Password (`/reset-password`)
- Página accesible desde el enlace enviado por correo
- Formulario para crear nueva contraseña
- Redirección automática al login tras éxito

---

## 🔒 Autenticación

La autenticación funciona de la siguiente manera:

1. Al iniciar sesión, el backend establece **cookies HTTP-only** seguras
2. El frontend almacena una cookie visible (`auth_token_exists`) para saber si hay sesión
3. En cada petición, las cookies se envían automáticamente (`credentials: 'include'`)
4. Si el token expira, el sistema intenta **refrescarlo automáticamente**
5. Si el refresco falla, el usuario es redirigido al login

---

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Vercel detecta automáticamente que es un proyecto Vite
3. Configura la variable de entorno:
   - `VITE_API_URL` = URL del backend desplegado (ej: `https://mi-backend.render.com`)
4. Despliega

### Opción 2: Netlify

1. Conecta tu repositorio en [netlify.com](https://netlify.com)
2. Configura:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Agrega la variable de entorno `VITE_API_URL`
4. Despliega

### Configuración de redirecciones (SPA)

Para que React Router funcione correctamente en producción, crea un archivo `_redirects` en la carpeta `public/`:

```
/*    /index.html   200
```

O para Vercel, un archivo `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🎨 Diseño Visual

| Elemento | Color |
|----------|-------|
| **Fondo principal** | Azul oscuro `#002e5b` |
| **Acento principal** | Celeste `#00bcd4` |
| **Acento hover** | Celeste oscuro `#00acc1` |
| **Texto primario** | Blanco |
| **Fondo Dashboard** | Gris claro `#f3f4f6` |
| **Tarjetas** | Blanco con bordes suaves |

---

## 📄 Licencia

ISC — Idiomas OCW © 2026
