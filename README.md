# Velvet Match
### Plataforma SaaS para la Gestión Integral de Negocios de Belleza

*Velvet Match* es una plataforma web empresarial diseñada bajo el modelo *SaaS (Software as a Service)*. [cite_start]Su objetivo es digitalizar y optimizar negocios del sector belleza (salones de uñas, barberías, estéticas y centros de maquillaje), permitiendo a los propietarios administrar su negocio de manera intuitiva sin necesidad de conocimientos técnicos[cite: 5, 6].

---

## Características Principales
* [cite_start]*Onboarding Guiado (Wizard):* Creación de sitio web corporativo en 5 pasos con personalización de identidad visual (colores primarios y secundarios)[cite: 69, 84, 87].
* [cite_start]*Motor de Citas Inteligente:* Calendario interactivo en tiempo real con reglas de negocio estrictas (48h de anticipación para agendar y 6h para cancelar)[cite: 23, 24, 95, 97].
* [cite_start]*Arquitectura Multi-tenant:* Cada negocio cuenta con una URL única y personalizada (ej. /estetica/glamour-haven)[cite: 8, 88].
* [cite_start]*Gestión Operativa:* Dashboards administrativos para el control de personal, servicios, precios y visualización de analíticas en tiempo real[cite: 25, 42, 44].
* [cite_start]*Portafolio Digital:* Sistema de "Posts" para que empleados y dueños suban fotos de sus trabajos recientes y reciban reseñas de clientes[cite: 51, 107].

---

## Stack Tecnológico
[cite_start]El proyecto utiliza una arquitectura de *Monorepo* para sincronizar eficientemente el Frontend y el Backend[cite: 59].

* [cite_start]*Frontend:* React.js con Tailwind CSS (Enfoque Mobile First)[cite: 69, 71].
* [cite_start]*Backend:* FastAPI (Python) para un alto rendimiento y manejo asíncrono[cite: 75].
* [cite_start]*Base de Datos:* MongoDB (NoSQL) para un manejo flexible de esquemas multitenant[cite: 78, 79].
* [cite_start]*Control de Versiones:* Git & GitHub[cite: 62, 63].

---

## Roles de Usuario
[cite_start]El sistema implementa un control de acceso jerárquico[cite: 35]:
1.  [cite_start]*Super Administrador:* Monitoreo global y analíticas de toda la plataforma[cite: 36, 41].
2.  [cite_start]*Administrador (Propietario):* Dueño del entorno digital, gestiona servicios, empleados y agenda[cite: 42, 47].
3.  [cite_start]*Empleado:* Acceso a su agenda diaria y publicación de trabajos al portafolio[cite: 49, 50, 51].
4.  [cite_start]*Cliente:* Usuario final que agenda citas, realiza pagos de anticipo (15%) y califica servicios[cite: 53, 54, 99].

---

## Fases de Desarrollo (Hitos)
1.  [cite_start]*Fase 1:* Arquitectura base y flujo de creación de sitio web (Wizard)[cite: 111].
2.  [cite_start]*Fase 2:* Autenticación y Dashboards base para Administrador y Empleado[cite: 112].
3.  [cite_start]*Fase 3:* Lógica del motor de citas, reglas de tiempo y asignación de empleados[cite: 113].
4.  [cite_start]*Fase 4:* Módulo de Analytics y Panel de Super Admin[cite: 117].

