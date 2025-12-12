# GitHub Actions Workflows

Este directorio contiene los workflows de CI/CD para el proyecto.

## Workflows Disponibles

### 1. `deploy.yml` - Deployment Automático

Se ejecuta automáticamente cuando:
- Se hace push a la rama `main`
- Se dispara manualmente desde GitHub Actions UI

**Qué hace:**
1. Construye la imagen Docker multi-stage para linux/amd64
2. Hace push de la imagen al Azure Container Registry
3. Despliega la aplicación en Kubernetes usando kubectl

### 2. `pr-validation.yml` - Validación de Pull Requests

Se ejecuta automáticamente en PRs hacia `main`.

**Qué hace:**
1. **build-image**: Construye la imagen Docker (sin push) para verificar que buildea correctamente
2. **gitleaks**: Escanea el código en busca de secretos, API keys, passwords, etc.
3. **trivy-scan**: Escanea la imagen Docker construida en busca de vulnerabilidades (CRITICAL y HIGH)

## Secrets Necesarios en GitHub

Para que los workflows funcionen correctamente, necesitas configurar los siguientes secrets en GitHub:

### Secrets para `deploy.yml`:

1. **ACR_USERNAME**: Usuario para Azure Container Registry
   - Valor: `github-token`

2. **ACR_PASSWORD**: Password para Azure Container Registry
   - Valor: `gLcs7bjlXKZO01wzLDyXtDVw2XABp9xP4avWnVvjJZ+ACRC84IZ2`

3. **KUBERNETES_TOKEN**: Token para autenticarse con el cluster de Kubernetes
   - Valor: `eyJhbGciOiJSUzI1NiIsImtpZCI6IkVXVWVwY1IzdGplUnlScU4ydy1jRlpDVW5EWUdPNERTdHN1VUZORXFIMmMifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzY2MzUxMzU2LCJpYXQiOjE3NjU0ODczNTYsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJ1c2VyLWFjY2VzcyIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJ1Y3UtdXNlciIsInVpZCI6IjMzMGYzNTZiLWQ1ZjAtNGU3ZS04N2IzLTRjODc3ZDNhNGQyOCJ9fSwibmJmIjoxNzY1NDg3MzU2LCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6dXNlci1hY2Nlc3M6dWN1LXVzZXIifQ.dTOw8e09NNi8TmvA7OUJxgHPF8ZYPs5ercn4jFKMH3d-hN00JE_WiX2aOqUWuxo-XVF2MQf0uSd1cVQ3X2VsEkggWroMdoH4iKF7pAP_rpROaFhjtoqP1vrZ7jIAWDr_PXA4OwNocTjk1PzFUTuS9fRSWpnM0XJRTc-x9p3zy_gMj9pmtZonK1aEKouzrKa67X4prAgZFe44we9SHDNVRvVjCijzppcIKZ7Rd32MTvssjLK_a7ud5qm8bOtb7zI9cXDGFqifu8LEiaG8Lfc8GOaQ-BJI6LssnqC2rCGt6IJY8mht-b_nTZOLp9G17uGK9vvFuWa5g70uSD7K1E0v4Q`

### Secrets para `pr-validation.yml`:

No requiere secrets adicionales. Usa `GITHUB_TOKEN` automáticamente para gitleaks.

## Cómo Configurar los Secrets

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Agrega cada uno de los secrets mencionados arriba

## Verificación

Una vez configurados los secrets:

- **PRs**: Automáticamente ejecutarán las validaciones cuando se abra un PR hacia `main`
- **Merges a main**: Automáticamente desplegarán la aplicación a Kubernetes

