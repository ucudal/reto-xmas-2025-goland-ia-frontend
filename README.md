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

### 3. Ejecutar el proyecto en modo desarrollo
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

### 4. Otros comandos disponibles

- **Build para producción:**
  ```bash
  npm run build
  ```

- **Previsualizar build de producción:**
  ```bash
  npm run preview
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
│   │   └── ChatbotButton.jsx
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
├── App.jsx
└── main.jsx
```

