#  Velvet Match - Backend (Modelos y Base de Datos)

En esta rama (`backend-modelos`) se construyó la arquitectura principal de nuestra base de datos en MongoDB utilizando Mongoose. 

Se tradujo el diagrama relacional del proyecto a modelos funcionales y se conectaron las rutas iniciales para la autenticación de usuarios.

## Archivos Creados / Modificados

Se creó la carpeta `models` con todos los "moldes" necesarios para la lógica de negocio:

* **`Usuario.js`**: Modelo para clientes, administradores y empleados. Incluye encriptación automática de contraseñas con `bcryptjs`.
* **`Negocio.js`**: Estructura para registrar los locales (estéticas, barberías, etc.) con sus colores personalizados, horarios e ID del administrador responsable.
* **`Servicio.js`**: Catálogo de servicios enlazados por ID a cada negocio.
* **`Cita.js`**: Motor principal para gestionar las reservas. Incluye estados (pendiente, programada, completada, etc.), motivos de rechazo y el sistema de reseñas y calificaciones integrado.
* **`Post.js`**: Modelo para las publicaciones y novedades del negocio.
* **`FechaProhibida.js`**: Registro de bloqueos de días en el calendario por vacaciones o mantenimiento.

Además, se actualizó **`server.js`** con:
- Solución del error de Mongoose (eliminación de `next()`).
- Ruta completa de **Registro** (`POST /api/register`).
- Ruta completa de **Login** (`POST /api/login`) con generación de tokens JWT.
- Ruta de prueba para **Crear Negocio** (`POST /api/negocios`).

---

## Instrucciones de Configuración Local

Para correr esta rama en tu computadora, sigue estos pasos:

### 1. Descarga la rama
Abre tu terminal en la carpeta principal del proyecto y ejecuta:
```bash
git fetch
git checkout backend-modelos
git pull origin backend-modelos
```

### 2. Descarga la rama
Asegúrate de estar dentro de la carpeta backend y actualiza los paquetes:
```bash
cd backend
npm install
```

### 3. ¡IMPORTANTE: Variables de Entorno!
Por motivos de seguridad, las contraseñas y accesos a la base de datos no se suben a GitHub.

Píde por mensaje privado a un integrante del equipo el contenido del archivo .env.

Crea un archivo nuevo en la raíz de la carpeta backend y llámalo exactamente .env.

Pega el contenido que te enviaron y guarda el archivo.

### 4. Enciende el servidor
Ejecuta el siguiente comando. Si todo está correcto, verás el mensaje de "MongoDB connected":
```bash
node server.js
```

## Pruebas
Las pruebas de registro de clientes, login, y creación de negocio ya fueron validadas usando Postman y responden exitosamente con los Status 201 Created y 200 OK.
