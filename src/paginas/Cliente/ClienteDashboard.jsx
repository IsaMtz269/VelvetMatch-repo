import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ClienteDashboard.css";

const negociosData = [
  {
    id: 1,
    emoji: "💅",
    nombre: "Chapi's Nails",
    tipo: "Salón de uñas",
    ubicacion: "Monterrey, NL",
    horario: "Lun – Sáb, 10am – 7pm",
    rating: "4.8",
    desc: "Especialistas en uñas acrílicas, gel, semipermanente y nail art. Nos dedicamos a realzar tu belleza con calidad y dedicación en cada servicio.",
    servicios: [
      { id: 1, icon: "💅", nombre: "Uñas acrílicas",      desc: "Extensión y diseño en acrílico de larga duración.", precio: "$350", duracion: "90 min" },
      { id: 2, icon: "✨", nombre: "Gel semipermanente",   desc: "Color de larga duración con acabado brillante.",      precio: "$250", duracion: "60 min" },
      { id: 3, icon: "🎨", nombre: "Nail art",             desc: "Diseños personalizados y decoraciones exclusivas.",    precio: "$150", duracion: "45 min" },
      { id: 4, icon: "🌸", nombre: "Manicure clásico",     desc: "Limpieza, forma y esmalte tradicional.",              precio: "$120", duracion: "40 min" },
    ],
    posts: [
      { id: 1, avatar: "👩", autor: "Adriana López",  rol: "Administradora", texto: "¡Hola a todas! Esta semana tenemos promoción especial: 20% de descuento en uñas acrílicas con cualquier diseño. ¡Aprovéchenla! 💅✨", fecha: "Hace 2 días" },
      { id: 2, avatar: "💆", autor: "Paola Ríos",     rol: "Empleada",       texto: "Nuevos diseños de nail art disponibles esta temporada. ¡Pidan sus citas con anticipación, tengo agenda llena! 🎨",                   fecha: "Hace 4 días" },
      { id: 3, avatar: "👩", autor: "Adriana López",  rol: "Administradora", texto: "Recuerda que para cancelar tu cita debes hacerlo con al menos 6 horas de anticipación. ¡Gracias por tu comprensión!",               fecha: "Hace 1 semana" },
    ],
  },
  {
    id: 2,
    emoji: "✂️",
    nombre: "Barbería Regia",
    tipo: "Barbería",
    ubicacion: "San Pedro, NL",
    horario: "Lun – Sáb, 9am – 8pm",
    rating: "4.6",
    desc: "La mejor barbería de la ciudad. Cortes clásicos y modernos, afeitado con navaja y tratamientos para barba. Atención personalizada para caballeros.",
    servicios: [
      { id: 1, icon: "✂️", nombre: "Corte clásico",       desc: "Corte de cabello tradicional con acabado perfecto.",  precio: "$150", duracion: "30 min" },
      { id: 2, icon: "🪒", nombre: "Afeitado con navaja", desc: "Afeitado tradicional con espuma y navaja recta.",      precio: "$120", duracion: "25 min" },
      { id: 3, icon: "💈", nombre: "Corte + barba",       desc: "Corte de cabello y arreglo de barba completo.",        precio: "$220", duracion: "50 min" },
      { id: 4, icon: "🧴", nombre: "Tratamiento capilar", desc: "Hidratación y tratamiento para cuero cabelludo.",      precio: "$180", duracion: "40 min" },
    ],
    posts: [
      { id: 1, avatar: "👨", autor: "Carlos Garza",  rol: "Administrador", texto: "¡Nueva promoción! Corte + barba a $200 todos los martes. ¡No te la pierdas! ✂️💈",               fecha: "Hace 1 día" },
      { id: 2, avatar: "👨", autor: "Jorge Mendez",  rol: "Empleado",      texto: "Ya disponibles turnos para el fin de semana, agenda con anticipación para asegurar tu lugar.", fecha: "Hace 3 días" },
    ],
  },
  {
    id: 3,
    emoji: "💆",
    nombre: "Estética Lumière",
    tipo: "Estética",
    ubicacion: "Monterrey, NL",
    horario: "Mar – Dom, 10am – 6pm",
    rating: "4.7",
    desc: "Estética de lujo especializada en tratamientos faciales, colorimetría y estilismo. Transformamos tu look con técnicas de vanguardia.",
    servicios: [
      { id: 1, icon: "💇", nombre: "Corte y peinado",     desc: "Corte personalizado y peinado profesional.",           precio: "$280", duracion: "60 min" },
      { id: 2, icon: "🎨", nombre: "Colorimetría",        desc: "Tinte, mechas y técnicas de color avanzadas.",         precio: "$650", duracion: "120 min" },
      { id: 3, icon: "✨", nombre: "Tratamiento facial",  desc: "Limpieza profunda e hidratación intensiva.",            precio: "$400", duracion: "75 min" },
      { id: 4, icon: "💋", nombre: "Maquillaje social",   desc: "Maquillaje profesional para eventos especiales.",       precio: "$350", duracion: "60 min" },
    ],
    posts: [
      { id: 1, avatar: "👩", autor: "María Fernanda", rol: "Administradora", texto: "¡Nuevas técnicas de colorimetría disponibles! Pide tu consulta gratuita esta semana. 🎨✨",     fecha: "Hace 3 días" },
      { id: 2, avatar: "👩", autor: "María Fernanda", rol: "Administradora", texto: "Recordatorio: los tratamientos faciales requieren limpieza previa. ¡Llega sin maquillaje! 💆", fecha: "Hace 1 semana" },
    ],
  },
];

export default function ClienteDashboard() {
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [negocioSeleccionado, setNegocio]     = useState(null);
  const [servicioSeleccionado, setServicio]   = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  const handleSeleccionarNegocio = (neg) => {
    setNegocio(neg);
    setServicio(null);
    setMostrarSelector(false);
  };

  const handleAgendarCita = () => {
    if (servicioSeleccionado && negocioSeleccionado) {
      navigate("/ClienteCalendario", {
        state: { negocio: negocioSeleccionado, servicio: servicioSeleccionado },
      });
    }
  };

  return (
    <div className="cd-wrapper">
      {/* ── Sidebar ── */}
      <aside className={`cd-sidebar${sidebarOpen ? " active" : ""}`}>
        <div className="cd-sidebar-header">
          <div className="cd-brand">
            <div className="cd-brand-name">{negocioSeleccionado?.nombre ?? "Velvet Match"}</div>
            <div className="cd-brand-sub">{negocioSeleccionado?.tipo ?? "Tu plataforma de belleza"}</div>
          </div>
          <button className="cd-close-sidebar" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="cd-nav">
          <div className="cd-nav-label">MENÚ</div>
          <Link className={`cd-nav-link${location.pathname === "/clienteDashboard" ? " active" : ""}`} to="/clienteDashboard" onClick={() => setSidebarOpen(false)}>
            <span className="cd-ic">🏠</span> Inicio
          </Link>
          <Link className={`cd-nav-link${location.pathname === "/clienteCalendario" ? " active" : ""}`} to="/clienteCalendario" onClick={() => setSidebarOpen(false)}>
            <span className="cd-ic">📅</span> Calendario
          </Link>
          <Link className={`cd-nav-link${location.pathname === "/clientePerfil" ? " active" : ""}`} to="/clientePerfil" onClick={() => setSidebarOpen(false)}>
            <span className="cd-ic">👤</span> Mi perfil
          </Link>
        </nav>
        <div className="cd-sidebar-footer">
          <div className="cd-user-dot">L</div>
          <div className="cd-user-info">
            <div className="cd-name">Lucía Mendoza</div>
            <div className="cd-role">Cliente</div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="cd-overlay active" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="cd-main">
        <header className="cd-topbar">
          <button className="cd-menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="cd-topbar-title">{negocioSeleccionado?.nombre ?? "Inicio"}</span>
          <div className="cd-topbar-right">
            <button className="cd-btn-negocio" onClick={() => setMostrarSelector(true)}>
              {negocioSeleccionado ? "Cambiar negocio" : "Seleccionar negocio"}
            </button>
            <Link to="/" className="cd-logout-header">Cerrar sesión</Link>
          </div>
        </header>

        <div className="cd-content">
          {/* ── Modal selector de negocio ── */}
          {mostrarSelector && (
            <div className="cd-modal-overlay" onClick={() => setMostrarSelector(false)}>
              <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cd-modal-head">
                  <h2>Selecciona un negocio</h2>
                  <button onClick={() => setMostrarSelector(false)}>✕</button>
                </div>
                <div className="cd-negocios-grid">
                  {negociosData.map((neg) => (
                    <div key={neg.id} className="cd-negocio-opcion" onClick={() => handleSeleccionarNegocio(neg)}>
                      <span className="cd-neg-emoji">{neg.emoji}</span>
                      <div>
                        <div className="cd-neg-nombre">{neg.nombre}</div>
                        <div className="cd-neg-tipo">{neg.tipo}</div>
                        <div className="cd-neg-loc">📍 {neg.ubicacion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Sin negocio seleccionado ── */}
          {!negocioSeleccionado && (
            <div className="cd-empty">
              <div className="cd-empty-icon">✨</div>
              <h2>¡Bienvenida, Lucía!</h2>
              <p>Selecciona un negocio para ver sus servicios y publicaciones.</p>
              <button className="cd-btn-select-big" onClick={() => setMostrarSelector(true)}>
                Explorar negocios
              </button>
            </div>
          )}

          {/* ── Negocio seleccionado ── */}
          {negocioSeleccionado && (
            <>
              {/* Hero */}
              <div className="cd-negocio-hero">
                <div className="cd-negocio-logo">{negocioSeleccionado.emoji}</div>
                <div className="cd-hero-info">
                  <div className="cd-negocio-name">{negocioSeleccionado.nombre}</div>
                  <div className="cd-negocio-type">{negocioSeleccionado.tipo}</div>
                  <div className="cd-negocio-desc">{negocioSeleccionado.desc}</div>
                </div>
                <div className="cd-negocio-meta">
                  <div className="cd-meta-item">📍 {negocioSeleccionado.ubicacion}</div>
                  <div className="cd-meta-item">⏰ {negocioSeleccionado.horario}</div>
                  <div className="cd-meta-item">⭐ {negocioSeleccionado.rating} / 5.0</div>
                </div>
              </div>

              {/* Servicio seleccionado — botón agendar */}
              {servicioSeleccionado && (
                <div className="cd-agendar-bar">
                  <span>Servicio seleccionado: <strong>{servicioSeleccionado.nombre}</strong> — {servicioSeleccionado.precio} · {servicioSeleccionado.duracion}</span>
                  <button className="cd-btn-agendar" onClick={handleAgendarCita}>
                    📅 Agendar cita
                  </button>
                </div>
              )}

              {/* Dos columnas */}
              <div className="cd-two-columns">
                {/* Servicios */}
                <div className="cd-servicios-column">
                  <div className="cd-section-title">Nuestros servicios</div>
                  <div className="cd-servicios-grid">
                    {negocioSeleccionado.servicios.map((s) => (
                      <div
                        key={s.id}
                        className={`cd-servicio-card${servicioSeleccionado?.id === s.id ? " selected" : ""}`}
                        onClick={() => setServicio(servicioSeleccionado?.id === s.id ? null : s)}
                      >
                        <div className="cd-servicio-icon">{s.icon}</div>
                        <div className="cd-servicio-nombre">{s.nombre}</div>
                        <div className="cd-servicio-desc">{s.desc}</div>
                        <div className="cd-servicio-footer">
                          <span className="cd-servicio-precio">{s.precio}</span>
                          <span className="cd-servicio-duracion">{s.duracion}</span>
                        </div>
                        {servicioSeleccionado?.id === s.id && (
                          <div className="cd-selected-badge">✓ Seleccionado</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Posts */}
                <div className="cd-posts-column">
                  <div className="cd-section-title">Publicaciones</div>
                  <div className="cd-posts-list">
                    {negocioSeleccionado.posts.map((p) => (
                      <div key={p.id} className="cd-post-card">
                        <div className="cd-post-avatar">{p.avatar}</div>
                        <div className="cd-post-content">
                          <div className="cd-post-author">{p.autor}</div>
                          <div className="cd-post-role">{p.rol}</div>
                          <div className="cd-post-text">{p.texto}</div>
                          <div className="cd-post-date">{p.fecha}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}