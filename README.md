# Walletfy API – Backend Básico (Eventos)

API REST simple para Walletfy que gestiona la entidad evento (ingresos/egresos). Incluye CRUD, validación con express-validator, logging propio y endpoints de salud. Diseñada para integrarse con el frontend Walletfy de React.

## 📋 Descripción

Un evento representa un movimiento financiero:
```json
{
  "id": 1,
  "nombre": "Sueldo diciembre",
  "descripcion": "Pago mensual",
  "cantidad": 1500,
  "fecha": "2024-12-05",
  "tipo": "ingreso",
  "adjunto": ""
}
```
- **tipo**: "ingreso" o "egreso"
- **fecha**: ISO YYYY-MM-DD


## 🚀 Características

- CRUD completo de eventos
- Validación de datos con express-validator
- Filtro por tipo y mes (?tipo=ingreso|egreso&mes=YYYY-MM)
- Logger propio (método, URL, hora, querystring)
- Endpoint de salud /health
- Respuestas JSON consistentes con code, message, data
- Hot reload con nodemon

## 🛠️ Tecnologías

- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js**: Framework web para Node.js
- **express-validator**: Librería para validación de datos
- **nodemon**: Herramienta para desarrollo que reinicia automáticamente el servidor

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/DaniloTorres2001/Backend-Project-Walletfy.git
cd Backend-Project-Walletfy
```

2. Instala las dependencias:
```bash
npm install
```

3. (Opcional) nodemon para autoreload en dev:
```bash
npm i -D nodemon
```
4. Scripts en package.json:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```
4. Ejecuta:
```bash
# desarrollo
npm run dev

# producción / simple
npm start
```

El servidor estará ejecutándose en `http://localhost:3030`

## 🔗 Endpoints

### Salud del servicio
```http
GET /health
```
**Respuesta exitosa:**
```json
{ "status": "ok", "uptime": 12.34, "timestamp": "2025-01-01T00:00:00.000Z" }
```

### Obtener todos los eventos
```http
GET /api/events/all
```

**Respuesta exitosa:**
```json
{
  "code": "OK",
  "message": "All events",
  "data": { "events": [ /* ... */ ] }
}
```

### Listar eventos (con filtros opcionales)
```http
GET /api/events?tipo=ingreso&mes=2024-12
```
- **tipo**: "ingreso" o "egreso"
- **fecha**: ISO YYYY-MM-DD

**Respuesta exitosa:**
```json
{
  "code": "OK",
  "message": "Events retrieved successfully!",
  "data": { "events": [ /* filtrados */ ] }
}
```

### Obtener eventos por ID
```http
GET /api/events/query?id=1
```

**Parámetros de consulta:**
- `id` (requerido): ID del evento

**Respuesta exitosa:**
```json
{
  "code": "OK",
  "message": "Events are available!",
  "data": { "event": { /* evento */ } }
}
```
**404 Not Found si no existe.**

### Crear un nuevo evento
```http
POST /api/events
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Supermercado",
  "descripcion": "Compras del mes",
  "cantidad": 120.5,
  "fecha": "2025-01-10",
  "tipo": "egreso",
  "adjunto": ""
}
```

**Respuesta exitosa:**
```json
{
  "code": "OK",
  "message": "Event created successfully!",
  "data": { "event": { /* nuevo evento */ } }
}
```
**404 Not Found si no existe.**

### Actualizar un evento
```http
PUT /api/events/:id
Content-Type: application/json
```

**Parámetros de ruta:**
- `id`: ID del evento a actualizar

**Body:**
```json
{
  "nombre": "Supermercado (ajuste)",
  "cantidad": 130.25
}
```
**No borra campos no enviados**

**Respuesta exitosa:**
```json
{
  "code": "OK",
  "message": "Event updated successfully!",
  "data": { "event": { /* evento actualizado */ } }
}
```
**404 Not Found si no existe**
**400 Bad Request si la validación falla**

### Eliminar un usuario
```http
DELETE /api/events/:id
```

**Parámetros de ruta:**
- `id`: ID del evento a eliminar

**Respuesta exitosa:**
```json
{
  "code": "OK",
  "message": "Event deleted successfully!",
  "data": { "event": { /* evento eliminado */ } }
}
```
**404 Not Found si no existe**

## 📝 Códigos de respuesta

- `200 OK` – Lecturas/actualizaciones/eliminaciones exitosas
- `201 Created `– Creación exitosa
- `400 Bad Request` – Datos inválidos
- `404 Not Found` – Recurso no existe
- `500 Internal Server Error` – Error inesperado

## 🧪 Pruebas

Puedes probar los endpoints usando herramientas como:
- **Postman**
- **Thunder Client** (extensión de VS Code)
- **curl**

### Ejemplo con curl:

```bash
# Salud
curl http://localhost:3030/health

# Listar (todos)
curl http://localhost:3030/api/events/all

# Listar filtrando por mes y tipo
curl "http://localhost:3030/api/events?tipo=egreso&mes=2024-12"

# Obtener por id (query)
curl "http://localhost:3030/api/events/query?id=1"

# Crear
curl -X POST http://localhost:3030/api/events \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Supermercado","descripcion":"Compras del mes","cantidad":120.5,"fecha":"2025-01-10","tipo":"egreso","adjunto":""}'

# Actualizar (merge)
curl -X PUT http://localhost:3030/api/events/3 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Supermercado (ajuste)","cantidad":130.25}'

# Eliminar
curl -X DELETE http://localhost:3030/api/events/3
```
## 🔍 Logger propio

Cada request imprime en consola:
```bash
[2025-09-19T02:38:18.631Z] GET /api/events?tipo=ingreso&mes=2024-12 query={"tipo":"ingreso","mes":"2024-12"}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Danilo Torres** - [dantvera@espol.edu.ec](mailto:dantvera@espol.edu.ec)

---

*Parte del proyecto Walletfy – API básica de eventos para integrar con el frontend.*

