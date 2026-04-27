import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ClientePerfil.css";

const citasData = {
  pendientes: [
    { id: 1, dia: 26, mes: "Feb", servicio: "Uñas acrílicas", hora: "12:00 pm", duracion: "90 min", precio: "$350", empleada: "Empleada aún por asignar" },
    { id: 2, dia: 28, mes: "Feb", servicio: "Nail art",        hora: "3:00 pm",  duracion: "45 min", precio: "$150", empleada: "Empleada aún por asignar" },
  ],
  programadas: [
    { id: 3, dia: 5, mes: "Mar", servicio: "Gel semipermanente", hora: "11:00 am", duracion: "60 min", precio: "$250", empleada: "👩 Paola Ríos" },
  ],
  completadas: [
    { id: 4, dia: 15, mes: "Feb", servicio: "Manicure clásico", hora: "10:00 am", duracion: "40 min", precio: "$120", empleada: "👩 Paola Ríos", reviewDone: false },
    { id: 5, dia: 8,  mes: "Feb", servicio: "Uñas acrílicas",   hora: "12:00 pm", duracion: "90 min", precio: "$350", empleada: "👩 Paola Ríos", reviewDone: true, reviewStars: 5, reviewTexto: '"Excelente servicio, quedé muy satisfecha con el resultado. Muy recomendada."' },
    { id: 6, dia: 20, mes: "Ene", servicio: "Nail art",          hora: "2:30 pm",  duracion: "45 min", precio: "$150", empleada: "👩 Paola Ríos", reviewDone: true },
  ],
  canceladas: [
    { id: 7, dia: 10, mes: "Ene", servicio: "Gel semipermanente", hora: "11:00 am", duracion: "60 min", precio: "$250", empleada: "—" },
  ],
  rechazadas: [
    { id: 8, dia: 3, mes: "Ene", servicio: "Manicure clásico", hora: "3:00 pm", duracion: "40 min", precio: "$120", empleada: "—", motivo: "Sin disponibilidad en ese horario." },
  ],
};

const TABS_CITAS = [
  { key: "pendientes",  label: "Pendientes" },
  { key: "programadas", label: "Programadas" },
  { key: "completadas", label: "Completadas" },
  { key: "canceladas",  label: "Canceladas" },
  { key: "rechazadas",  label: "Rechazadas" },
];

function BadgeCita({ tipo }) {
  const map = {
    pendientes:  { cls: "cp-badge-pendiente",  text: "⏳ Pendiente de aprobación" },
    programadas: { cls: "cp-badge-programada", text: "✅ Programada" },
    completadas: { cls: "cp-badge-completada", text: "✔ Completada" },
    canceladas:  { cls: "cp-badge-cancelada",  text: "✕ Cancelada por cliente" },
    rechazadas:  { cls: "cp-badge-rechazada",  text: "✕ Rechazada por administrador" },
  };
  const b = map[tipo];
  return <span className={`cp-badge ${b.cls}`}>{b.text}</span>;
}

export default function ClientePerfil() {
  const [sidebarOpen, setSidebarOpen]  = useState(false);
  const [mainTab, setMainTab]          = useState("perfil");
  const [citaTab, setCitaTab]          = useState("pendientes");
  const [ratings, setRatings]          = useState({});
  const [comentarios, setComentarios]  = useState({});
  const [reviewsEnviadas, setReviews]  = useState({});
  const [editando, setEditando]        = useState(false);
  const location = useLocation();

  const handleRate = (citaId, n) => setRatings(r => ({ ...r, [citaId]: n }));
  const handleEnviarReview = (citaId) => setReviews(r => ({ ...r, [citaId]: true }));

  return (
    <div className="cp-wrapper">
      {/* ── Sidebar ── */}
      <aside className={`cp-sidebar${sidebarOpen ? " active" : ""}`}>
        <div className="cp-sidebar-header">
          <div className="cp-brand">
            <div className="cp-brand-name">Chapi's Nails</div>
            <div className="cp-brand-sub">Salón de uñas</div>
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
          <div className="cp-user-dot">L</div>
          <div className="cp-user-info">
            <div className="cp-name">Lucía Mendoza</div>
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
          <div className="cp-topbar-right">
            <Link to="/" className="cp-logout-header">Cerrar sesión</Link>
          </div>
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
                  <div className="cp-perfil-avatar">L</div>
                  <div className="cp-perfil-nombre">Lucía Mendoza</div>
                  <div className="cp-perfil-rol">Cliente</div>
                </div>
                <div className="cp-perfil-body">
                  <div className="cp-perfil-field"><label>Usuario</label><p>@lucia.mendoza</p></div>
                  <div className="cp-perfil-field"><label>Correo</label><p>lucia@email.com</p></div>
                  <div className="cp-perfil-field"><label>Miembro desde</label><p>Enero 2025</p></div>
                  <div className="cp-perfil-field"><label>Citas completadas</label><p>8 citas</p></div>
                </div>
              </div>

              <div className="cp-datos-card">
                <div className="cp-datos-title">Información personal</div>
                <div className="cp-datos-grid">
                  {[
                    { label: "Nombre(s)",           type: "text",     value: "Lucía" },
                    { label: "Apellidos",            type: "text",     value: "Mendoza García" },
                    { label: "Correo electrónico",   type: "email",    value: "lucia@email.com" },
                    { label: "Fecha de nacimiento",  type: "date",     value: "1998-06-14" },
                    { label: "Teléfono",             type: "tel",      value: "81 1234 5678" },
                    { label: "Contraseña",           type: "password", value: "••••••••" },
                  ].map(f => (
                    <div key={f.label} className="cp-datos-field">
                      <label>{f.label}</label>
                      <input type={f.type} defaultValue={f.value} disabled={!editando} />
                    </div>
                  ))}
                </div>
                <button className="cp-btn-save" onClick={() => setEditando(e => !e)}>
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
                    <span className="cp-count">{citasData[t.key].length}</span>
                  </button>
                ))}
              </div>

              <div className="cp-cita-panel">
                {citasData[citaTab].length === 0 && (
                  <div className="cp-empty-state">
                    <div className="cp-empty-icon">📅</div>
                    <div className="cp-empty-text">No hay citas en esta categoría</div>
                  </div>
                )}

                {citasData[citaTab].map(cita => (
                  <div key={cita.id} className={`cp-cita-card${citaTab === "completadas" && !cita.reviewDone ? " cp-cita-card-column" : ""}`}>
                    <div className="cp-cita-header-row">
                      <div className="cp-cita-fecha-box">
                        <div className="cp-cita-dia">{cita.dia}</div>
                        <div className="cp-cita-mes">{cita.mes}</div>
                      </div>
                      <div className="cp-cita-info">
                        <div className="cp-cita-servicio">{cita.servicio}</div>
                        <div className="cp-cita-details">
                          <span>⏰ {cita.hora}</span>
                          <span>⏱ {cita.duracion}</span>
                          <span>💰 {cita.precio}</span>
                        </div>
                        <div className="cp-cita-empleada">{cita.empleada}</div>
                        <BadgeCita tipo={citaTab} />
                        {cita.motivo && <div className="cp-cita-motivo">Motivo: {cita.motivo}</div>}
                      </div>
                      {citaTab === "programadas" && (
                        <div className="cp-cita-actions">
                          <button className="cp-btn-cancelar">Cancelar cita</button>
                        </div>
                      )}
                      {citaTab === "completadas" && cita.reviewDone && cita.reviewTexto && (
                        <div className="cp-review-done">
                          <div className="cp-review-stars">{"★".repeat(cita.reviewStars ?? 5)}</div>
                          <div className="cp-review-text">{cita.reviewTexto}</div>
                        </div>
                      )}
                    </div>

                    {/* Rating para completadas sin review */}
                    {citaTab === "completadas" && !cita.reviewDone && !reviewsEnviadas[cita.id] && (
                      <div className="cp-rating-section">
                        <div className="cp-rating-label">¿Cómo fue tu experiencia? Deja una calificación:</div>
                        <div className="cp-stars">
                          {[1,2,3,4,5].map(n => (
                            <span
                              key={n}
                              className={`cp-star${(ratings[cita.id] ?? 0) >= n ? " filled" : ""}`}
                              onClick={() => handleRate(cita.id, n)}
                            >★</span>
                          ))}
                        </div>
                        <textarea
                          className="cp-rating-comment"
                          rows={2}
                          placeholder="Escribe un comentario (opcional)..."
                          value={comentarios[cita.id] ?? ""}
                          onChange={e => setComentarios(c => ({ ...c, [cita.id]: e.target.value }))}
                        />
                        <br />
                        <button className="cp-btn-review" onClick={() => handleEnviarReview(cita.id)}>
                          Enviar reseña
                        </button>
                      </div>
                    )}

                    {citaTab === "completadas" && reviewsEnviadas[cita.id] && (
                      <div className="cp-review-done">
                        <div className="cp-review-stars">{"★".repeat(ratings[cita.id] ?? 5)}</div>
                        <div className="cp-review-text">"{comentarios[cita.id] || "Muy buen servicio."}"</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}