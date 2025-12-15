# Especificación Técnica - Integración Frontend con Backend AG-UI

## 📋 Resumen

El frontend está implementado usando el **protocolo AG-UI** con **Server-Sent Events (SSE)** para comunicación en tiempo real. El frontend ya está completamente funcional con un servidor mock y está listo para conectarse al endpoint real del backend.

---

## 🔌 Contrato de Comunicación

### Endpoint Principal: `POST /api/ag-ui/run`

#### Request Body

```json
{
  "message": "string",           // Requerido: Mensaje del usuario
  "session_id": "uuid"           // Opcional: UUID de la sesión (no se envía en el primer mensaje)
}
```

**Ejemplo - Primer mensaje (sin session_id):**
```json
{
  "message": "¿Qué son los Hemp Hearts?"
}
```

**Ejemplo - Mensajes siguientes (con session_id):**
```json
{
  "message": "¿Cuáles son sus beneficios?",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response: Server-Sent Events (SSE)

El backend debe responder con un stream SSE que emita los siguientes eventos:

##### 1. Evento: `agent:start`
Se emite cuando el agente comienza a procesar la solicitud.

```json
event: agent:start
data: {
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-XXT..."
}
```

**Importante:** 
- Si es el primer mensaje (sin `session_id` en el request), el backend debe **generar un nuevo UUID** y devolverlo.
- Si el request incluye `session_id`, el backend debe **usar ese mismo session_id** y devolverlo.

##### 2. Evento: `agent:thinking`
Se emite cuando el agente está procesando/pensando.

```json
event: agent:thinking
data: {
  "message": "Procesando tu pregunta...",
  "timestamp": "2025-01-XXT..."
}
```

##### 3. Evento: `agent:message_start`
Se emite cuando el agente comienza a generar la respuesta.

```json
event: agent:message_start
data: {
  "timestamp": "2025-01-XXT..."
}
```

##### 4. Evento: `agent:message` (Streaming)
Se emite múltiples veces para enviar la respuesta caracter por caracter (o en chunks).

**Para cada caracter/chunk:**
```json
event: agent:message
data: {
  "type": "text",
  "content": "S",              // Un caracter o chunk pequeño
  "isComplete": false
}
```

**Al finalizar (mensaje completo):**
```json
event: agent:message
data: {
  "type": "text",
  "content": "Respuesta completa del agente",
  "isComplete": true
}
```

##### 5. Evento: `agent:done`
Se emite cuando el agente termina de responder.

```json
event: agent:done
data: {
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-XXT..."
}
```

##### 6. Evento: `agent:error` (Opcional)
Se emite si hay un error durante el procesamiento.

```json
event: agent:error
data: {
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-XXT..."
}
```

---

## 📡 Headers HTTP Requeridos

El backend debe configurar los siguientes headers para SSE:

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: *  (o el dominio específico del frontend)
Access-Control-Allow-Headers: Content-Type
```

---

## 🔄 Flujo Completo de una Conversación

### Primera Interacción

1. **Frontend → Backend:**
   ```json
   POST /api/ag-ui/run
   {
     "message": "Hola"
   }
   ```

2. **Backend → Frontend (SSE Stream):**
   ```
   event: agent:start
   data: {"session_id": "nuevo-uuid-generado", "timestamp": "..."}
   
   event: agent:thinking
   data: {"message": "Procesando...", "timestamp": "..."}
   
   event: agent:message_start
   data: {"timestamp": "..."}
   
   event: agent:message
   data: {"type": "text", "content": "H", "isComplete": false}
   
   event: agent:message
   data: {"type": "text", "content": "o", "isComplete": false}
   
   ... (más caracteres)
   
   event: agent:message
   data: {"type": "text", "content": "¡Hola! ¿En qué puedo ayudarte?", "isComplete": true}
   
   event: agent:done
   data: {"session_id": "nuevo-uuid-generado", "timestamp": "..."}
   ```

3. **Frontend guarda `session_id`** en localStorage para usar en siguientes mensajes.

### Siguientes Interacciones

1. **Frontend → Backend:**
   ```json
   POST /api/ag-ui/run
   {
     "message": "¿Qué productos tienen?",
     "session_id": "nuevo-uuid-generado"
   }
   ```

2. **Backend → Frontend:** Mismo flujo SSE, pero usando el `session_id` existente.

---

## 💬 Endpoint de Feedback (Opcional)

### `POST /api/ag-ui/feedback`

Permite al usuario dar feedback sobre las respuestas (like/dislike).

#### Request Body

```json
{
  "message_id": "string",        // ID del mensaje (generado por frontend)
  "feedback_type": "positive" | "negative",
  "session_id": "uuid"           // Opcional
}
```

#### Response

```json
{
  "success": true,
  "message_id": "string",
  "feedback_type": "positive",
  "session_id": "uuid",
  "timestamp": "2025-01-XXT..."
}
```

---

## 🔧 Cambios Necesarios en el Frontend

Cuando el endpoint del backend esté listo, **solo necesitas cambiar una variable de entorno**:

### Archivo: `.env`

```env
# Cambiar de:
VITE_AG_UI_SERVER_URL=http://localhost:3001

# A:
VITE_AG_UI_SERVER_URL=https://tu-backend-url.com
```

**Eso es todo.** El código del frontend ya está preparado y funcionará automáticamente.

---

## ✅ Checklist para el Backend

- [ ] Implementar endpoint `POST /api/ag-ui/run` que acepte `{ message: string, session_id?: UUID }`
- [ ] Generar `session_id` UUID si no se proporciona (primer mensaje)
- [ ] Devolver `session_id` en eventos `agent:start` y `agent:done`
- [ ] Implementar streaming SSE con los eventos especificados
- [ ] Enviar respuesta caracter por caracter (o en chunks pequeños) en eventos `agent:message`
- [ ] Configurar headers HTTP correctos para SSE
- [ ] Manejar errores y emitir evento `agent:error` cuando sea necesario
- [ ] (Opcional) Implementar endpoint `POST /api/ag-ui/feedback` para recibir feedback

---

## 📝 Notas Importantes

1. **Session ID:**
   - El frontend guarda el `session_id` en localStorage
   - El backend debe mantener el contexto de la conversación usando el `session_id`
   - Si el backend no puede restaurar una sesión, puede generar un nuevo `session_id` (el frontend se adaptará)

2. **Streaming:**
   - El frontend espera recibir la respuesta caracter por caracter para mostrar un efecto de "typing"
   - Si el backend prefiere enviar chunks más grandes, puede hacerlo, pero el efecto visual será menos fluido

3. **Persistencia:**
   - El frontend ya persiste los mensajes en localStorage
   - El backend NO necesita implementar endpoints para recuperar historial (a menos que se requiera sincronización entre dispositivos)

4. **CORS:**
   - Asegúrate de configurar CORS correctamente para permitir requests desde el dominio del frontend

---

## 🧪 Testing

El frontend incluye un servidor mock que puedes usar como referencia:

- **Ubicación:** `server/index.js`
- **Puerto:** `3001` (por defecto)
- **Endpoints:** Implementa exactamente el protocolo descrito arriba

Puedes ejecutarlo localmente para ver cómo funciona:
```bash
cd server
npm install
npm start
```

---

## 📞 Soporte

Si tienes dudas sobre la implementación, puedes:
1. Revisar el código del servidor mock en `server/index.js`
2. Revisar el hook `useAGUI` en `src/hooks/useAGUI.js`
3. Consultar la documentación del protocolo AG-UI oficial

---

**Última actualización:** Enero 2025

