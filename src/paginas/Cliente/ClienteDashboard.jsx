import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ClienteDashboard.css";

const API = "http://localhost:5000/api";

export default function ClienteDashboard() {
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [negocioSeleccionado, setNegocio]     = useState(null);
  const [servicioSeleccionado, setServicio]   = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);

  // Datos reales del backend
  const [negocios, setNegocios]     = useState([]);
  const [servicios, setServicios]   = useState([]);
  const [posts, setPosts]           = useState([]);

  // Loading states
  const [loadingNegocios, setLoadingNegocios]   = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [loadingPosts, setLoadingPosts]         = useState(false);

  // Usuario del localStorage
  const [usuario, setUsuario] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Cargar usuario del localStorage
  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) setUsuario(JSON.parse(u));
  }, []);

  // Cargar lista de negocios al montar
  useEffect(() => {
    const fetchNegocios = async () => {
      setLoadingNegocios(true);
      try {
        const res = await fetch(`${API}/negocios`);
        const data = await res.json();
        setNegocios(data);
      } catch (err) {
        console.error("Error al cargar negocios:", err);
      } finally {
        setLoadingNegocios(false);
      }
    };
    fetchNegocios();
  }, []);

  // Cargar servicios y posts cuando se selecciona un negocio
  useEffect(() => {
    if (!negocioSeleccionado) return;

    const fetchServicios = async () => {
      setLoadingServicios(true);
      try {
        const res = await fetch(`${API}/servicios/negocio/${negocioSeleccionado._id}`);
        const data = await res.json();
        setServicios(data);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
      } finally {
        setLoadingServicios(false);
      }
    };

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(`${API}/posts/negocio/${negocioSeleccionado._id}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error al cargar posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchServicios();
    fetchPosts();
  }, [negocioSeleccionado]);

  const handleSeleccionarNegocio = (neg) => {
    setNegocio(neg);
    setServicio(null);
    setServicios([]);
    setPosts([]);
    setMostrarSelector(false);
  };

  const handleAgendarCita = () => {
  if (negocioSeleccionado) {
    navigate(`/empresa/${negocioSeleccionado._id}`);
  }
  };

  // Iniciales del usuario para el avatar
  const iniciales = usuario
    ? `${usuario.nombre?.charAt(0) ?? ""}${usuario.apellido ? usuario.apellido.charAt(0) : ""}`.toUpperCase()
    : "?";

  const nombreCompleto = usuario
    ? `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim()
    : "Cliente";

  // Emoji según tipo de negocio
  const emojiTipo = (tipo) => {
    const map = {
      "Barbería": "✂️",
      "Estética": "💆",
      "Salón de belleza": "💇",
      "Salón de uñas": "💅",
    };
    return map[tipo] ?? "🏪";
  };

  // Formatear fecha de post
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diff = Math.floor((ahora - fecha) / 1000);
    if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
    return fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
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
          <div className="cd-user-dot">{iniciales}</div>
          <div className="cd-user-info">
            <div className="cd-name">{nombreCompleto}</div>
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
             <button
            className="...-logout-header"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
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
                {loadingNegocios ? (
                  <div className="cd-loading">Cargando negocios...</div>
                ) : negocios.length === 0 ? (
                  <div className="cd-loading">No hay negocios disponibles.</div>
                ) : (
                  <div className="cd-negocios-grid">
                    {negocios.map((neg) => (
                      <div key={neg._id} className="cd-negocio-opcion" onClick={() => handleSeleccionarNegocio(neg)}>
                        <span className="cd-neg-emoji">{emojiTipo(neg.tipo)}</span>
                        <div>
                          <div className="cd-neg-nombre">{neg.nombre}</div>
                          <div className="cd-neg-tipo">{neg.tipo}</div>
                          <div className="cd-neg-loc">📍 {neg.ubicacion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Sin negocio seleccionado ── */}
          {!negocioSeleccionado && (
            <div className="cd-empty">
              <div className="cd-empty-icon">✨</div>
              <h2>¡Bienvenid@, {usuario?.nombre ?? ""}!</h2>
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
                <div className="cd-negocio-logo">{emojiTipo(negocioSeleccionado.tipo)}</div>
                <div className="cd-hero-info">
                  <div className="cd-negocio-name">{negocioSeleccionado.nombre}</div>
                  <div className="cd-negocio-type">{negocioSeleccionado.tipo}</div>
                  <div className="cd-negocio-desc">{negocioSeleccionado.descripcion ?? negocioSeleccionado.eslogan ?? ""}</div>
                </div>
                <div className="cd-negocio-meta">
                  <div className="cd-meta-item">📍 {negocioSeleccionado.ubicacion}</div>
                  {negocioSeleccionado.hora_apertura && negocioSeleccionado.hora_cierre && (
                    <div className="cd-meta-item">⏰ {negocioSeleccionado.horario_dia} {negocioSeleccionado.hora_apertura} – {negocioSeleccionado.hora_cierre}</div>
                  )}
                  {negocioSeleccionado.celular && (
                    <div className="cd-meta-item">📞 {negocioSeleccionado.celular}</div>
                  )}
                </div>
              </div>

              {/* Servicio seleccionado — botón agendar */}
              {servicioSeleccionado && (
                <div className="cd-agendar-bar">
                  <span>
                    Servicio seleccionado: <strong>{servicioSeleccionado.nombre}</strong> — ${servicioSeleccionado.precio} · {servicioSeleccionado.duracion} min
                  </span>
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
                  {loadingServicios ? (
                    <div className="cd-loading">Cargando servicios...</div>
                  ) : servicios.length === 0 ? (
                    <div className="cd-loading">Este negocio aún no tiene servicios.</div>
                  ) : (
                    <div className="cd-servicios-grid">
                      {servicios.map((s) => (
                        <div
                          key={s._id}
                          className={`cd-servicio-card${servicioSeleccionado?._id === s._id ? " selected" : ""}`}
                          onClick={() => setServicio(servicioSeleccionado?._id === s._id ? null : s)}
                        >
                          <div className="cd-servicio-icon">✨</div>
                          <div className="cd-servicio-nombre">{s.nombre}</div>
                          <div className="cd-servicio-desc">{s.descripcion ?? ""}</div>
                          <div className="cd-servicio-footer">
                            <span className="cd-servicio-precio">${s.precio}</span>
                            <span className="cd-servicio-duracion">{s.duracion} min</span>
                          </div>
                          {servicioSeleccionado?._id === s._id && (
                            <div className="cd-selected-badge">✓ Seleccionado</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Posts */}
                <div className="cd-posts-column">
                  <div className="cd-section-title">Publicaciones</div>
                  {loadingPosts ? (
                    <div className="cd-loading">Cargando publicaciones...</div>
                  ) : posts.length === 0 ? (
                    <div className="cd-loading">Este negocio aún no tiene publicaciones.</div>
                  ) : (
                    <div className="cd-posts-list">
                      {posts.map((p) => (
                        <div key={p._id} className="cd-post-card">
                          <div className="cd-post-avatar">📢</div>
                          <div className="cd-post-content">
                            <div className="cd-post-author">{p.titulo_p}</div>
                            <div className="cd-post-text">{p.contenido}</div>
                            <div className="cd-post-date">{formatearFecha(p.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}