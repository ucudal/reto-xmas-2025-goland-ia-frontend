#!/bin/bash

# Script para probar el webhook de Discord
# Uso: ./scripts/test-discord-webhook.sh <WEBHOOK_URL>

WEBHOOK_URL=$1

if [ -z "$WEBHOOK_URL" ]; then
    echo "❌ Error: Debes proporcionar la URL del webhook"
    echo "Uso: ./scripts/test-discord-webhook.sh <WEBHOOK_URL>"
    echo ""
    echo "Ejemplo:"
    echo "  ./scripts/test-discord-webhook.sh https://discord.com/api/webhooks/123456789/abcdefg"
    exit 1
fi

echo "🧪 Probando webhook de Discord..."
echo "URL: $WEBHOOK_URL"
echo ""

# Obtener timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

# Mensaje de prueba simple
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"🧪 Test desde script - Webhook funcionando correctamente\",
    \"username\": \"GitHub Actions Test\",
    \"embeds\": [{
      \"title\": \"Test Webhook - Goland Frontend\",
      \"description\": \"Si ves este mensaje, el webhook está configurado correctamente ✅\",
      \"color\": 3447003,
      \"fields\": [
        {
          \"name\": \"Status\",
          \"value\": \"✅ Funcionando\",
          \"inline\": true
        },
        {
          \"name\": \"Timestamp\",
          \"value\": \"$TIMESTAMP\",
          \"inline\": true
        }
      ]
    }]
  }"

echo ""
echo ""
if [ $? -eq 0 ]; then
    echo "✅ ¡Curl ejecutado exitosamente!"
    echo "Revisa tu canal de Discord para ver si llegó el mensaje."
else
    echo "❌ Error al ejecutar curl. Verifica la URL del webhook."
fi

