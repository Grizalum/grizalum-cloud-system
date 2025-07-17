# 📦 Guía de Instalación - GRIZALUM

> Guía completa para instalar y configurar el Sistema Financiero Empresarial GRIZALUM

---

## 🚀 Métodos de Instalación

### 1. 🌐 Instalación Vía GitHub Pages (Recomendado)

**La forma más rápida de empezar:**

```bash
# 1. Visita directamente la aplicación en línea
https://tu-usuario.github.io/grizalum-sistema-financiero/src/

# 2. ¡Listo! Ya puedes usar GRIZALUM
```

**Ventajas:**
- ✅ Sin instalación local requerida
- ✅ Siempre actualizado
- ✅ Funciona en cualquier dispositivo
- ✅ Acceso desde cualquier lugar

---

### 2. 💻 Instalación Local para Desarrollo

#### Requisitos Previos
```bash
# Verificar versiones
node --version    # >= 14.0.0
npm --version     # >= 6.0.0
git --version     # >= 2.0.0
```

#### Instalación Paso a Paso

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/grizalum-sistema-financiero.git

# 2. Navegar al directorio
cd grizalum-sistema-financiero

# 3. Instalar dependencias (opcional)
npm install

# 4. Iniciar servidor de desarrollo
npm start

# 5. Abrir navegador
# La aplicación estará disponible en: http://localhost:8000/src/
```

#### Servidores Alternativos

**Usando Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Usando PHP:**
```bash
php -S localhost:8000
```

**Usando Node.js (serve):**
```bash
npx serve . -p 8000
```

---

### 3. 📱 Instalación como PWA

#### En Dispositivos Móviles

**Android (Chrome):**
1. Abrir GRIZALUM en Chrome
2. Tocar el ícono de "Agregar a pantalla de inicio"
3. Confirmar instalación
4. La app aparecerá como aplicación nativa

**iOS (Safari):**
1. Abrir GRIZALUM en Safari
2. Tocar el botón "Compartir" 
3. Seleccionar "Agregar a pantalla de inicio"
4. Confirmar instalación

#### En Desktop

**Chrome/Edge:**
1. Abrir GRIZALUM
2. Click en el ícono de instalación en la barra de direcciones
3. Click "Instalar"
4. La app se ejecutará como aplicación de escritorio

---

## 🔧 Configuración Inicial

### 1. Configuración Básica

#### Personalizar Empresa
Editar `config/settings.js`:
```javascript
const COMPANY_CONFIG = {
    name: "Tu Empresa SAC",
    ruc: "20123456789",
    address: "Av. Principal 123, Lima",
    currency: "PEN", // Soles peruanos
    timezone: "America/Lima"
};
```

#### Configurar Colores
Editar `assets/css/styles.css`:
```css
:root {
    --peru-gold: #tu-color-primario;
    --primary: #tu-color-secundario;
    /* Personalizar otros colores */
}
```

### 2. Configuración de Base de Datos (Opcional)

Para uso con backend, editar `config/database.js`:
```javascript
const DATABASE_CONFIG = {
    host: "localhost",
    port: 5432,
    database: "grizalum_db",
    username: "tu_usuario",
    password: "tu_password"
};
```

---

## 🌐 Configuración de GitHub Pages

### Activar GitHub Pages

1. **Ir a tu repositorio en GitHub**
2. **Settings → Pages**
3. **Source:** Deploy from a branch
4. **Branch:** main
5. **Folder:** / (root)
6. **Save**

### Configurar Dominio Personalizado (Opcional)

1. **Crear archivo `CNAME` en la raíz:**
```
tudominio.com
```

2. **Configurar DNS:**
```
Tipo: CNAME
Nombre: www
Valor: tu-usuario.github.io
```

---

## 🔐 Configuración de Seguridad

### Variables de Entorno

Crear archivo `.env` (solo para desarrollo):
```env
# API Keys
SUNAT_API_KEY=tu_api_key_sunat
BANCO_API_KEY=tu_api_key_banco

# Base de datos
DB_HOST=localhost
DB_NAME=grizalum
DB_USER=usuario
DB_PASS=password

# Configuración
ENVIRONMENT=development
DEBUG=true
```

### Headers de Seguridad

Para producción, configurar en tu servidor:
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📊 Configuración de Monitoreo

### Google Analytics (Opcional)

Agregar en `src/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry para Error Tracking

```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "TU_SENTRY_DSN"
  });
</script>
```

---

## 🧪 Testing y Validación

### Verificar Instalación

```bash
# 1. Verificar que todos los archivos existen
ls -la src/
ls -la assets/css/
ls -la assets/js/

# 2. Verificar sintaxis JavaScript
node -c assets/js/main.js
node -c assets/js/charts.js
node -c assets/js/ai.js

# 3. Validar HTML
# Usar https://validator.w3.org/

# 4. Verificar responsive
# Usar DevTools del navegador
```

### Tests Manuales

1. **✅ Dashboard carga correctamente**
2. **✅ Gráficos se renderizan**
3. **✅ Formularios funcionan**
4. **✅ Navegación responsive**
5. **✅ Exportación de PDF**

---

## 🚨 Solución de Problemas

### Problemas Comunes

#### 1. Gráficos no se muestran
```javascript
// Verificar que Chart.js está cargado
if (typeof Chart === 'undefined') {
    console.error('Chart.js no está cargado');
}
```

**Solución:**
- Verificar conexión a internet
- Revisar consola del navegador
- Confirmar que el CDN de Chart.js funciona

#### 2. Iconos aparecen como cuadrados
```html
<!-- Verificar carga de FontAwesome -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
```

**Solución:**
- Usar JS version en lugar de CSS
- Verificar que no hay bloqueadores de contenido

#### 3. Aplicación no funciona en GitHub Pages
```
Error: 404 en archivos CSS/JS
```

**Solución:**
- Verificar rutas relativas
- Confirmar estructura de carpetas
- Revisar mayúsculas/minúsculas en nombres

#### 4. Problemas de rendimiento
```javascript
// Optimizar imágenes
// Minificar CSS/JS
// Usar lazy loading
```

### Logs y Debugging

```javascript
// Activar modo debug
localStorage.setItem('grizalum_debug', 'true');

// Ver logs detallados en consola
console.log('🔍 GRIZALUM Debug Mode Enabled');
```

---

## 📱 Instalación en Diferentes Plataformas

### Windows

```powershell
# 1. Instalar Node.js desde nodejs.org
# 2. Instalar Git desde git-scm.com
# 3. Abrir PowerShell y ejecutar:

git clone https://github.com/tu-usuario/grizalum-sistema-financiero.git
cd grizalum-sistema-financiero
npm install
npm start
```

### macOS

```bash
# 1. Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar dependencias
brew install node git

# 3. Clonar y ejecutar
git clone https://github.com/tu-usuario/grizalum-sistema-financiero.git
cd grizalum-sistema-financiero
npm install
npm start
```

### Linux (Ubuntu/Debian)

```bash
# 1. Actualizar sistema
sudo apt update

# 2
