import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ClientePerfil.css";

const API = "http://localhost:5000/api";

const TABS_CITAS = [
  { key: "pendiente",   label: "Pendientes" },
  { key: "programada",  label: "Programadas" },
  { key: "completada",  label: "Completadas" },
  { key: "cancelada",   label: "Canceladas" },
  { key: "rechazada",   label: "Rechazadas" },
];

function BadgeCita({ estado }) {
  const map = {
    pendiente:  { cls: "cp-badge-pendiente",  text: "⏳ Pendiente de aprobación" },
    programada: { cls: "cp-badge-programada", text: "✅ Programada" },
    completada: { cls: "cp-badge-completada", text: "✔ Completada" },
    cancelada:  { cls: "cp-badge-cancelada",  text: "✕ Cancelada por cliente" },
    rechazada:  { cls: "cp-badge-rechazada",  text: "✕ Rechazada por administrador" },
  };
  const b = map[estado] ?? { cls: "", text: estado };
  return <span className={`cp-badge ${b.cls}`}>{b.text}</span>;
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "";
  const [anio, mes, dia] = fechaStr.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return { dia: parseInt(dia), mes: meses[parseInt(mes) - 1] ?? mes };
}

export default function ClientePerfil() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mainTab, setMainTab]         = useState("perfil");
  const [citaTab, setCitaTab]         = useState("pendiente");

  // Datos reales
  const navigate = useNavigate(); 
  const [usuario, setUsuario]   = useState(null);
  const [citas, setCitas]       = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // Reseñas locales
  const [ratings, setRatings]         = useState({});
  const [comentarios, setComentarios] = useState({});
  const [reviewsEnviadas, setReviews] = useState({});
  const [enviandoReview, setEnviandoReview] = useState({});

  // Edición de perfil
  const [editando, setEditando]     = useState(false);
  const [formPerfil, setFormPerfil] = useState({});

  const location = useLocation();

  const [toast, setToast] = useState(null);

  // Función helper para mostrar y auto-ocultar el mensaje
  const mostrarToast = (mensaje, tipo = "exito") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  // Cargar usuario del localStorage
  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) {
      const parsed = JSON.parse(u);
      setUsuario(parsed);
      setFormPerfil({
        nombre:         parsed.nombre ?? "",
        apellido:       parsed.apellido ?? "",
        email:          parsed.email ?? "",
        fechNacimiento: parsed.fechNacimiento?.split("T")[0] ?? "",
      });
    }
  }, []);

  // Cargar citas del cliente
  useEffect(() => {
    if (!usuario?.id) return;
    const fetchCitas = async () => {
      setLoadingCitas(true);
      try {
        const res = await fetch(`${API}/citas/cliente/${usuario.id}`);
        const data = await res.json();
        setCitas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar citas:", err);
      } finally {
        setLoadingCitas(false);
      }
    };
    fetchCitas();
  }, [usuario]);

  // Filtrar citas por estado activo
  const citasFiltradas = citas.filter(c => c.estado === citaTab);

  // Contar citas por estado
  const contarCitas = (estado) => citas.filter(c => c.estado === estado).length;

  // Citas completadas totales
  const citasCompletadas = citas.filter(c => c.estado === "completada").length;

  const handleRate = (citaId, n) => setRatings(r => ({ ...r, [citaId]: n }));

  const handleEnviarReview = async (citaId) => {
    if (!ratings[citaId]) return mostrarToast("Selecciona una calificación antes de enviar.", "error");
    setEnviandoReview(e => ({ ...e, [citaId]: true }));
    try {
      const res = await fetch(`${API}/citas/${citaId}/resena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente:   usuario.id,
          review_stars: ratings[citaId],
          review_texto: comentarios[citaId] ?? "",
        }),
      });
      if (res.ok) {
        setReviews(r => ({ ...r, [citaId]: true }));
        // Actualizar la cita en el estado local
        setCitas(prev => prev.map(c =>
          c._id === citaId
            ? { ...c, review_done: true, review_stars: ratings[citaId], review_texto: comentarios[citaId] ?? "" }
            : c
        ));
      } else {
        const data = await res.json();
        mostrarToast(data.message ?? "Error al enviar reseña", "error");
      }
    } catch (err) {
      mostrarToast("Error de conexión", "error");
    } finally {
      setEnviandoReview(e => ({ ...e, [citaId]: false }));
    }
  };

  const [confirmandoCita, setConfirmandoCita] = useState(null);

  const handleCancelarCita = async (citaId) => {
    if (confirmandoCita !== citaId) {
      setConfirmandoCita(citaId);
      return;
    }
    setConfirmandoCita(null);
    try {
      const res = await fetch(`${API}/citas/cancelar/${citaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ es_admin: false }),
      });
      const data = await res.json();
      if (res.ok) {
        setCitas(prev => prev.map(c => c._id === citaId ? { ...c, estado: "cancelada" } : c));
        mostrarToast("Tu cita ha sido cancelada.");
      } else {
        mostrarToast(data.message ?? "No se pudo cancelar la cita", "error");
      }
    } catch (err) {
      mostrarToast("Error de conexión", "error");
    }
  };

  const iniciales = usuario
    ? `${usuario.nombre?.charAt(0) ?? ""}${usuario.apellido?.charAt(0) ?? ""}`.toUpperCase()
    : "?";

  const nombreCompleto = usuario
    ? `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim()
    : "Cliente";

  const miembroDesde = usuario?.createdAt
    ? new Date(usuario.createdAt).toLocaleDateString("es-MX", { month: "long", year: "numeric" })
    : "—";

  const handleGuardarPerfil = async () => {
    try {
      const res = await fetch(`${API}/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPerfil),
      });
      const data = await res.json();
      if (res.ok) {
        // Actualizar localStorage con los nuevos datos
        const usuarioActualizado = { ...usuario, ...formPerfil };
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
        setEditando(false);
        mostrarToast("Perfil actualizado correctamente");
      } else {
        mostrarToast(data.message ?? "Error al actualizar", "error");
      }
    } catch (err) {
      mostrarToast("Error de conexión", "error");
    }
  };

  

  return (
    
    <div className="cp-wrapper">
      {toast && (
      <div style={{
        position: "fixed", top: "20px", right: "20px", zIndex: 999,
        padding: "14px 20px", borderRadius: "12px",
        background: toast.tipo === "error" ? "#fdf0f0" : "#edf7ed",
        color: toast.tipo === "error" ? "#9a3a3a" : "#3a7a3a",
        border: `1px solid ${toast.tipo === "error" ? "#e0a0a0" : "#90c890"}`,
        fontWeight: 600, fontSize: "14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        {toast.tipo === "error" ? "⚠️" : "✅"} {toast.mensaje}
      </div>
    )}

      {/* ── Sidebar ── */}
      <aside className={`cp-sidebar${sidebarOpen ? " active" : ""}`}>
        <div className="cp-sidebar-header">
          <div className="cp-brand">
            <div className="cp-brand-name">Velvet Match</div>
            <div className="cp-brand-sub">Tu plataforma de belleza</div>
          </div>
          <button className="cp-close-sidebar" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="cp-nav">
          <div className="cp-nav-label">MENÚ</div>
          <Link className={`cp-nav-link${location.pathname === "/clienteDashboard" ? " active" : ""}`} to="/clienteDashboard" onClick={() => setSidebarOpen(false)}>
            <span className="cp-ic">🏠</span> Inicio
          </Link>
          <Link className={`cp-nav-link${location.pathname === "/clienteCalendario" ? " active" : ""}`} to="/clienteCalendario" onClick={() => setSidebarOpen(false)}>
            <span className="cp-ic">📅</span> Calendario
          </Link>
          <Link className={`cp-nav-link${location.pathname === "/clientePerfil" ? " active" : ""}`} to="/clientePerfil" onClick={() => setSidebarOpen(false)}>
            <span className="cp-ic">👤</span> Mi perfil
          </Link>
        </nav>
        <div className="cp-sidebar-footer">
          <div className="cp-user-dot">{iniciales}</div>
          <div className="cp-user-info">
            <div className="cp-name">{nombreCompleto}</div>
            <div className="cp-role">Cliente</div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="cp-overlay active" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="cp-main">
        <header className="cp-topbar">
          <button className="cp-menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="cp-topbar-title">Mi perfil</span>
         <button
            className="cc-logout-header"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <div className="cp-content">
          {/* Main tabs */}
          <div className="cp-main-tabs">
            <div className={`cp-main-tab${mainTab === "perfil" ? " active" : ""}`} onClick={() => setMainTab("perfil")}>Perfil</div>
            <div className={`cp-main-tab${mainTab === "citas"  ? " active" : ""}`} onClick={() => setMainTab("citas")}>Mis citas</div>
          </div>

          {/* ── PERFIL ── */}
          {mainTab === "perfil" && (
            <div className="cp-perfil-layout">
              <div className="cp-perfil-card">
                <div className="cp-perfil-header">
                  <div className="cp-perfil-avatar">{iniciales}</div>
                  <div className="cp-perfil-nombre">{nombreCompleto}</div>
                  <div className="cp-perfil-rol">Cliente</div>
                </div>
                <div className="cp-perfil-body">
                  <div className="cp-perfil-field"><label>Correo</label><p>{usuario?.email ?? "—"}</p></div>
                  <div className="cp-perfil-field"><label>Miembro desde</label><p>{miembroDesde}</p></div>
                  <div className="cp-perfil-field"><label>Citas completadas</label><p>{citasCompletadas} citas</p></div>
                </div>
              </div>

              <div className="cp-datos-card">
                <div className="cp-datos-title">Información personal</div>
                <div className="cp-datos-grid">
                  {[
                    { label: "Nombre(s)",          key: "nombre",         type: "text" },
                    { label: "Apellidos",           key: "apellido",       type: "text" },
                    { label: "Correo electrónico",  key: "email",          type: "email" },
                    { label: "Fecha de nacimiento", key: "fechNacimiento", type: "date" },
                  ].map(f => (
                    <div key={f.key} className="cp-datos-field">
                      <label>{f.label}</label>
                      {!editando && f.type === "date" ? (
                        <input
                          type="text"
                          value={
                            formPerfil[f.key]
                              ? new Date(formPerfil[f.key] + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
                              : "—"
                          }
                          disabled
                        />
                      ) : (
                        <input
                          type={f.type}
                          value={formPerfil[f.key] ?? ""}
                          disabled={!editando}
                          onChange={e => setFormPerfil(p => ({ ...p, [f.key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button className="cp-btn-save" onClick={editando ? handleGuardarPerfil : () => setEditando(true)}>
                  {editando ? "Guardar cambios" : "Editar perfil"}
                </button>
              </div>
            </div>
          )}

          {/* ── CITAS ── */}
          {mainTab === "citas" && (
            <>
              <div className="cp-citas-tabs">
                {TABS_CITAS.map(t => (
                  <button
                    key={t.key}
                    className={`cp-cita-tab-btn${citaTab === t.key ? " active" : ""}`}
                    onClick={() => setCitaTab(t.key)}
                  >
                    {t.label}
                    <span className="cp-count">{contarCitas(t.key)}</span>
                  </button>
                ))}
              </div>

              <div className="cp-cita-panel">
                {loadingCitas && <div className="cp-empty-state"><div className="cp-empty-text">Cargando citas...</div></div>}

                {!loadingCitas && citasFiltradas.length === 0 && (
                  <div className="cp-empty-state">
                    <div className="cp-empty-icon">📅</div>
                    <div className="cp-empty-text">No hay citas en esta categoría</div>
                  </div>
                )}

                {!loadingCitas && citasFiltradas.map(cita => {
                  const { dia, mes } = formatearFecha(cita.fecha);
                  const yaReseñada = cita.review_done || reviewsEnviadas[cita._id];

                  return (
                    <div key={cita._id} className={`cp-cita-card${citaTab === "completada" && !yaReseñada ? " cp-cita-card-column" : ""}`}>
                      <div className="cp-cita-header-row">
                        <div className="cp-cita-fecha-box">
                          <div className="cp-cita-dia">{dia}</div>
                          <div className="cp-cita-mes">{mes}</div>
                        </div>
                        <div className="cp-cita-info">
                          <div className="cp-cita-servicio">
                            {cita.id_servicio?.nombre ?? "Servicio"}
                          </div>
                          <div className="cp-cita-details">
                            <span>⏰ {cita.hora}</span>
                            {cita.id_servicio?.precio && <span>💰 ${cita.id_servicio.precio}</span>}
                          </div>
                          <div className="cp-cita-empleada">
                            {cita.id_empleado
                              ? `👤 ${cita.id_empleado.nombre} ${cita.id_empleado.apellido}`
                              : "Empleado aún por asignar"}
                          </div>
                          <BadgeCita estado={cita.estado} />
                          {cita.motivo_rechazo && (
                            <div className="cp-cita-motivo">Motivo: {cita.motivo_rechazo}</div>
                          )}
                        </div>

                        {citaTab === "programada" && (
                          <div className="cp-cita-actions">
                            {confirmandoCita === cita._id ? (
                              <>
                                <span style={{fontSize:"12px", color:"#9a3a3a"}}>¿Confirmar cancelación?</span>
                                <button className="cp-btn-cancelar" onClick={() => handleCancelarCita(cita._id)}>
                                  Sí, cancelar
                                </button>
                                <button className="cp-btn-cancelar" onClick={() => setConfirmandoCita(null)}
                                  style={{borderColor:"#EBD2BE", color:"#8a5070"}}>
                                  No
                                </button>
                              </>
                            ) : (
                              <button className="cp-btn-cancelar" onClick={() => handleCancelarCita(cita._id)}>
                                Cancelar cita
                              </button>
                            )}
                          </div>
                        )}

                        {citaTab === "completada" && yaReseñada && (
                          <div className="cp-review-done">
                            <div className="cp-review-stars">{"★".repeat(cita.review_stars ?? ratings[cita._id] ?? 5)}</div>
                            {cita.review_texto && <div className="cp-review-text">"{cita.review_texto}"</div>}
                          </div>
                        )}
                      </div>

                      {/* Rating para completadas sin reseña */}
                      {citaTab === "completada" && !yaReseñada && (
                        <div className="cp-rating-section">
                          <div className="cp-rating-label">¿Cómo fue tu experiencia? Deja una calificación:</div>
                          <div className="cp-stars">
                            {[1,2,3,4,5].map(n => (
                              <span
                                key={n}
                                className={`cp-star${(ratings[cita._id] ?? 0) >= n ? " filled" : ""}`}
                                onClick={() => handleRate(cita._id, n)}
                              >★</span>
                            ))}
                          </div>
                          <textarea
                            className="cp-rating-comment"
                            rows={2}
                            placeholder="Escribe un comentario (opcional)..."
                            value={comentarios[cita._id] ?? ""}
                            onChange={e => setComentarios(c => ({ ...c, [cita._id]: e.target.value }))}
                          />
                          <br />
                          <button
                            className="cp-btn-review"
                            onClick={() => handleEnviarReview(cita._id)}
                            disabled={enviandoReview[cita._id]}
                          >
                            {enviandoReview[cita._id] ? "Enviando..." : "Enviar reseña"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>

    
  );
}