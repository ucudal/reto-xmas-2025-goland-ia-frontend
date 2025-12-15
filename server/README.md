# Servidor AG-UI Mock

Servidor Express mockeado que implementa el **protocolo AG-UI** con Server-Sent Events (SSE) para desarrollo y testing.

Este servidor implementa el protocolo AG-UI completo, permitiendo:
- Streaming de respuestas caracter por caracter
- Eventos en tiempo real (agent:thinking, agent:message, agent:done, etc.)
- Estados de conexión y procesamiento
- Compatibilidad con el protocolo estándar AG-UI

## Instalación

```bash
cd server
npm install
```

## Ejecución

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3001` por defecto.

## Endpoints Disponibles

### `POST /api/ag-ui/run` ⭐ **Protocolo AG-UI**
Endpoint principal que implementa el protocolo AG-UI con Server-Sent Events (SSE).

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "¿Qué son los Hemp Hearts?"
    }
  ],
  "conversation_id": "opcional"
}
```

**Response:** Stream SSE con eventos:
```
event: agent:start
data: {"conversation_id": "conv-123", "timestamp": "..."}

event: agent:thinking
data: {"message": "Procesando tu pregunta...", "timestamp": "..."}

event: agent:message_start
data: {"timestamp": "..."}

event: agent:message
data: {"type": "text", "content": "S", "isComplete": false}

event: agent:message
data: {"type": "text", "content": "o", "isComplete": false}

... (caracter por caracter)

event: agent:message
data: {"type": "text", "content": "respuesta completa", "isComplete": true}

event: agent:done
data: {"conversation_id": "conv-123", "timestamp": "..."}
```

### `POST /api/chat` (Legacy)
Endpoint legacy para compatibilidad con implementaciones anteriores.

### `GET /api/health`
Verifica el estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "message": "AG-UI Mock Server está funcionando",
  "timestamp": "2025-01-XX..."
}
```

### `GET /api/qa`
Obtiene todas las preguntas disponibles.

**Response:**
```json
{
  "total": 20,
  "questions": ["¿Qué son los Hemp Hearts?", ...]
}
```

### `GET /api/qa/search?q=<query>`
Busca preguntas y respuestas que contengan el término de búsqueda.

**Ejemplo:**
```
GET /api/qa/search?q=hemp
```

## Configuración

Puedes cambiar el puerto usando la variable de entorno:
```bash
PORT=3002 npm start
```

## Variables de Entorno del Frontend

Para que el frontend use este servidor, configura en `.env`:

```env
VITE_USE_MOCK_SERVER=true
VITE_MOCK_SERVER_URL=http://localhost:3001
```

Si `VITE_USE_MOCK_SERVER=false`, el frontend usará búsqueda local en `qa.json`.

