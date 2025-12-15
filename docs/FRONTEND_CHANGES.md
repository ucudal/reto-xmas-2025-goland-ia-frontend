# Cambios Necesarios en el Frontend cuando el Backend esté Listo

## 🎯 Cambio Mínimo Requerido

Cuando el backend esté listo, **solo necesitas cambiar la URL del servidor** en las variables de entorno.

### Paso 1: Actualizar `.env`

Edita el archivo `.env` (o créalo si no existe):

```env
# Cambiar esta línea:
VITE_AG_UI_SERVER_URL=https://tu-backend-url.com/api

# Ejemplo:
VITE_AG_UI_SERVER_URL=https://api.goland-group.com/api
```

### Paso 2: Reiniciar el servidor de desarrollo

```bash
npm run dev
```

**¡Eso es todo!** El frontend se conectará automáticamente al backend real.

---

## 🔍 Verificación

Para verificar que todo funciona:

1. Abre el chat
2. Envía un mensaje
3. Verifica en la consola del navegador que las peticiones van al backend correcto
4. Verifica que recibes el `session_id` en la respuesta
5. Verifica que los mensajes se muestran correctamente

---

## 🐛 Troubleshooting

### Si no se conecta al backend:

1. **Verifica la URL:**
   - Asegúrate de que la URL en `.env` sea correcta
   - No incluyas `/api/ag-ui/run` en la URL base, solo el dominio

2. **Verifica CORS:**
   - El backend debe permitir requests desde tu dominio
   - Revisa la consola del navegador para errores de CORS

3. **Verifica el formato de respuesta:**
   - El backend debe responder con SSE (Server-Sent Events)
   - Revisa la pestaña Network en DevTools para ver la respuesta

### Si no recibes `session_id`:

- Verifica que el backend esté devolviendo `session_id` en el evento `agent:start`
- Revisa la consola para ver los eventos SSE recibidos

### Si los mensajes no se muestran:

- Verifica que el backend esté enviando eventos `agent:message` con el formato correcto
- Revisa la consola para errores de parsing

---

## 📝 Archivos que NO necesitas modificar

El siguiente código ya está implementado y funcionando:

- ✅ `src/hooks/useAGUI.js` - Hook para comunicación con AG-UI
- ✅ `src/components/Chatbot/ChatbotModal.jsx` - Componente del chat
- ✅ Manejo de `session_id` y persistencia
- ✅ Streaming de mensajes caracter por caracter
- ✅ Manejo de errores
- ✅ Feedback (like/dislike)

**No necesitas modificar ningún archivo de código**, solo la variable de entorno.

---

## 🔄 Si el Backend tiene Diferencias

Si el backend implementa el protocolo de manera ligeramente diferente, puedes ajustar:

### Cambiar el endpoint base

Si el endpoint no es `/api/ag-ui/run`, edita `src/hooks/useAGUI.js`:

```javascript
// Línea ~87
const response = await fetch(`${AG_UI_SERVER_URL}/tu-endpoint-aqui`, {
```

### Cambiar el formato de eventos

Si los nombres de eventos son diferentes, edita `src/hooks/useAGUI.js` en la función `handleAGUIEvent`:

```javascript
// Línea ~165
const handleAGUIEvent = useCallback((eventType, data) => {
  switch (eventType) {
    case 'tu-evento-aqui': // Cambiar nombre del evento
      // ...
  }
}, []);
```

---

## 📚 Documentación Adicional

- Ver `docs/BACKEND_SPECIFICATION.md` para la especificación completa del protocolo
- Ver `server/index.js` para un ejemplo de implementación del servidor
- Ver `server/README.md` para documentación del servidor mock

