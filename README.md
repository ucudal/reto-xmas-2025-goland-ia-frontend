# GOLAND FRONTEND - RETO DICIEMBRE 2025

Este proyecto contiene dos componentes principales:

## Componentes

### 1. WebClone
Componente que clona/replica la página web del cliente. Este componente está completo y funcional, sirviendo como base visual del proyecto.

> **Nota:** Tener en cuenta que es un componente que puede estar feo, ya que fue replicado utilizando IA puramente. Ya que no es algo importante.. es únicamente para no tener un index vacío en blanco.

**Ubicación:** `src/components/WebClone/`

### 2. Chatbot
Componente del chatbot en el que se está trabajando actualmente. Este es el componente principal de desarrollo.

**Ubicación:** `src/components/Chatbot/`

## Nomenclatura de Ramas

### Estructura
```
prefijo/CODIGO DE LA TASK
```

### Tipos de ramas

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `feature/` | Nueva funcionalidad | `feature/SP2-011` |
| `fix/` | Corrección de bugs | `fix/SP2-012` |
| `refactor/` | Refactorización de código | `refactor/SP2-013` |

### Rama principal
- `main` → Producción

### Flujo de trabajo

1. Crear una nueva rama desde `main`
2. Trabajar en la rama haciendo commits
3. Subir la rama al repositorio remoto
4. Crear un Pull Request para mergear a `main`

> ⚠️ **Importante:** Nunca hacer commits directamente en `main`. Siempre trabajar en una rama separada.

## Instalación y Configuración

Si clonas este proyecto desde Git, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd web-clone
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

**⚠️ IMPORTANTE:** Debes crear un archivo `.env` antes de ejecutar el proyecto.

Copia `.env.example` a `.env`:
```bash
# En Windows (PowerShell)
Copy-Item .env.example .env

# En Windows (CMD)
copy .env.example .env

# En Linux/Mac
cp .env.example .env
```

**Variables disponibles en `.env`:**
```env
# URL del servidor AG-UI (mock o producción)
# Por defecto: servidor mock local
# Cuando el backend esté listo, cambiar a: https://tu-backend-url.com
VITE_AG_UI_SERVER_URL=http://localhost:3001

# Configuración legacy (opcional)
VITE_USE_MOCK_SERVER=true
VITE_MOCK_SERVER_URL=http://localhost:3001
```

**Nota:** 
- El archivo `.env` NO se sube al repositorio (está en `.gitignore`)
- Cada desarrollador debe crear su propio `.env` basado en `.env.example`
- Por defecto, el proyecto usa el protocolo AG-UI con streaming caracter por caracter

### 4. Instalar dependencias del servidor mock
```bash
cd server
npm install
cd ..
```

### 5. Ejecutar el proyecto

**Opción A: Solo el frontend (búsqueda local en qa.json)**
```bash
npm run dev
```

**Opción B: Frontend + Servidor mock**
En terminales separadas:
```bash
# Terminal 1: Servidor mock
npm run server:dev

# Terminal 2: Frontend
npm run dev
```

El proyecto estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).
El servidor mock estará en `http://localhost:3001`.

### 6. Otros comandos disponibles

- **Build para producción:**
  ```bash
  npm run build
  ```

- **Previsualizar build de producción:**
  ```bash
  npm run preview
  ```

- **Ejecutar solo el servidor mock:**
  ```bash
  npm run server
  ```

- **Ejecutar servidor mock en modo desarrollo:**
  ```bash
  npm run server:dev
  ```

## Tecnologías Utilizadas

- **React 19** - Framework de UI
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework de estilos
- **React Router DOM** - Enrutamiento
- **AOS** - Animaciones al hacer scroll
- **Lucide React** - Iconos

## Estructura del Proyecto

```
src/
├── components/
│   ├── Chatbot/          # Componente del chatbot (en desarrollo)
│   │   ├── Chatbot.jsx
│   │   ├── ChatbotButton.jsx
│   │   ├── ChatbotModal.jsx
│   │   ├── ChatInput.jsx
│   │   └── ChatMessage.jsx
│   └── WebClone/         # Componente que clona la web
│       ├── Header.jsx
│       ├── HeroSection.jsx
│       ├── FeaturesBar.jsx
│       ├── BenefitsSection.jsx
│       ├── ProductLine.jsx
│       ├── PromoSection.jsx
│       ├── NewsSection.jsx
│       ├── SustainabilitySection.jsx
│       ├── Footer.jsx
│       ├── WebClone.css
│       └── index.jsx
├── hooks/
│   └── useAGUI.js        # Hook para integración con protocolo AG-UI
├── services/
│   └── ChatServices.js    # Servicio legacy para comunicación con el chatbot
├── data/
│   └── qa.json           # Base de datos de preguntas y respuestas
├── App.jsx
└── main.jsx

server/
├── index.js              # Servidor Express mock AG-UI
├── package.json
└── README.md             # Documentación del servidor mock
```

## 📚 Documentación

### Para Desarrolladores Frontend
- **[Guía de Setup](docs/SETUP.md)** - Configuración inicial del proyecto

### Para Backend
- **[Especificación Técnica](docs/BACKEND_SPECIFICATION.md)** - Contrato completo de comunicación
- **[Cambios en Frontend](docs/FRONTEND_CHANGES.md)** - Qué cambiar cuando el endpoint esté listo

## Servidor Mock AG-UI

El proyecto incluye un servidor Express mockeado que **implementa el protocolo AG-UI completo** con Server-Sent Events (SSE). Este servidor permite:

- ✅ **Streaming caracter por caracter** - Las respuestas se muestran progresivamente
- ✅ **Estados en tiempo real** - Indicadores de "pensando", "respondiendo", etc.
- ✅ **Protocolo estándar AG-UI** - Compatible con el protocolo oficial
- ✅ **Desarrollo sin dependencias externas** - Trabaja completamente offline
- ✅ **Testing de integración** - Prueba el chatbot antes de tener el endpoint real
- ✅ **Búsqueda inteligente** - Usa la base de datos de QA para respuestas

### Características del Protocolo AG-UI

El servidor implementa los siguientes eventos del protocolo AG-UI:
- `agent:start` - El agente comenzó a procesar
- `agent:thinking` - El agente está pensando/procesando
- `agent:message_start` - Comenzó a generar la respuesta
- `agent:message` - Chunk de texto (caracter por caracter)
- `agent:done` - El agente terminó de responder
- `agent:error` - Error en el procesamiento

### Hook useAGUI

El proyecto incluye un hook personalizado `useAGUI` (`src/hooks/useAGUI.js`) que maneja automáticamente:
- Conexión SSE con el servidor
- Parsing de eventos AG-UI
- Acumulación de texto caracter por caracter
- Estados de conexión, pensando y streaming
- Manejo de errores

**Ejemplo de uso:**
```javascript
import { useAGUI } from '../hooks/useAGUI';

const { isThinking, isStreaming, currentMessage, sendMessage } = useAGUI();

// Enviar mensaje
await sendMessage("¿Qué son los Hemp Hearts?", messageHistory);
```

Para más información sobre el servidor mock, consulta [server/README.md](server/README.md).

