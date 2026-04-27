# Velvet Match - Backend (Consultas y Actualizaciones)

Esta rama (`backend-consultas`) contiene la implementación de todas las rutas de lectura (GET) y modificación (PUT/PATCH) necesarias para alimentar los Dashboards y la vista pública de los negocios.

## APIs Implementadas

### Módulo de Negocios
* `GET /api/negocios` - Obtiene la lista completa de negocios para la pestaña "Explorar".
* `GET /api/negocios/:id` - Carga el perfil público, banner y colores de un local específico.
* `PUT /api/negocios/:id` - Permite al dueño editar su información, redes y configuración.

### Módulo de Catálogos (Por Negocio)
* `GET /api/servicios/negocio/:id_negocio` - Lista los servicios disponibles para agendar.
* `GET /api/empleados/negocio/:id_negocio` - Lista el personal activo (filtra estrictamente por rol 'empleado').
* `GET /api/posts/negocio/:id_negocio` - Obtiene las publicaciones recientes ordenadas por fecha.
* `GET /api/fechas-prohibidas/negocio/:id_negocio` - Obtiene los días bloqueados para deshabilitarlos en el calendario.

### Módulo Operativo (Citas)
* `GET /api/citas/negocio/:id_negocio` - Historial y solicitudes pendientes para el panel del Administrador (incluye `populate` de cliente y servicio).
* `GET /api/citas/empleado/:id_empleado` - Agenda filtrada exclusiva para un empleado.
* `GET /api/citas/cliente/:id_cliente` - Historial de reservaciones para el perfil del cliente.
* `PATCH /api/citas/aprobar/:id_cita` - Cambia el estado a 'programada' y asigna un profesional.
* `PATCH /api/citas/cancelar/:id_cita` - Cancela o rechaza citas. (Incluye validación estricta de 6 horas para clientes).

### Módulo de Analytics y Reseñas
* `GET /api/analytics/negocio/:id_negocio` - Calcula ingresos totales y volumen de citas completadas.
* `GET /api/analytics/global` - Estadísticas generales de la plataforma (Super Admin).
* `GET /api/resenas/negocio/:id_negocio` - Carga los testimonios filtrando datos sensibles.

---
**Nota para el equipo:** Asegurarse de tener el `MONGO_URI` encendido y la variable `JWT_SECRET` configurada en el archivo `.env` local para probar el login y los tokens.
