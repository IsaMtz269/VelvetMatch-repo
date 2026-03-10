# Velvet Match
### Plataforma SaaS para la Gestión Integral de Negocios de Belleza

*Velvet Match* es una plataforma web empresarial diseñada bajo el modelo *SaaS (Software as a Service)*. [cite_start]Su objetivo es digitalizar y optimizar negocios del sector belleza (salones de uñas, barberías, estéticas y centros de maquillaje), permitiendo a los propietarios administrar su negocio de manera intuitiva sin necesidad de conocimientos técnicos[cite: 5, 6].

---

## Características Principales
* *Onboarding Guiado (Wizard):* Creación de sitio web corporativo en 5 pasos con personalización de identidad visual (colores primarios y secundarios).
* *Motor de Citas Inteligente:* Calendario interactivo en tiempo real con reglas de negocio estrictas (48h de anticipación para agendar y 6h para cancelar).
* *Arquitectura Multi-tenant:* Cada negocio cuenta con una URL única y personalizada (ej. /estetica/glamour-haven).
* *Gestión Operativa:* Dashboards administrativos para el control de personal, servicios, precios y visualización de analíticas en tiempo real.
* *Portafolio Digital:* Sistema de "Posts" para que empleados y dueños suban fotos de sus trabajos recientes y reciban reseñas de clientes.

---

## Stack Tecnológico
El proyecto utiliza una arquitectura de *Monorepo* para sincronizar eficientemente el Frontend y el Backend.

* *Frontend:* React.js con Tailwind CSS (Enfoque Mobile First).
* *Backend:* FastAPI (Python) para un alto rendimiento y manejo asíncrono.
* *Base de Datos:* MongoDB (NoSQL) para un manejo flexible de esquemas multitenant.
* *Control de Versiones:* Git & GitHub.

---

## Roles de Usuario
El sistema implementa un control de acceso jerárquico[cite: 35]:
1.  *Super Administrador:* Monitoreo global y analíticas de toda la plataforma.
2.  *Administrador (Propietario):* Dueño del entorno digital, gestiona servicios, empleados y agenda.
3.  *Empleado:* Acceso a su agenda diaria y publicación de trabajos al portafolio.
4.  *Cliente:* Usuario final que agenda citas, realiza pagos de anticipo (15%) y califica servicios.

---

## Fases de Desarrollo (Hitos)
1. *Fase 1:* Arquitectura base y flujo de creación de sitio web (Wizard).
2. *Fase 2:* Autenticación y Dashboards base para Administrador y Empleado.
3. *Fase 3:* Lógica del motor de citas, reglas de tiempo y asignación de empleados.
4. *Fase 4:* Módulo de Analytics y Panel de Super Admin.

---
## Integrantes: Isabella Martinez Cornejo 2062746 y Adriana Salazar Gomez 2062772

