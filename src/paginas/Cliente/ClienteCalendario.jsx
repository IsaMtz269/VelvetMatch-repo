import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ClienteCalendario.css";

const API = "http://localhost:5000/api";
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MESES_CORTO = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DIAS_SEMANA = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

function getCalendario(year, month) {
  const primer = new Date(year, month, 1).getDay();
  const total  = new Date(year, month + 1, 0).getDate();
  return { primer, total };
}

const ESTADO_COLORS = {
  pendiente:  { bg: "#FFF3CD", color: "#856404", label: "⏳ Pendiente" },
  programada: { bg: "#D1FAE5", color: "#065F46", label: "✅ Programada" },
  completada: { bg: "#DBEAFE", color: "#1E40AF", label: "✔ Completada" },
  cancelada:  { bg: "#FEE2E2", color: "#991B1B", label: "✕ Cancelada" },
  rechazada:  { bg: "#FEE2E2", color: "#991B1B", label: "✕ Rechazada" },
};

export default function ClienteCalendario() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario]         = useState(null);
  const [citas, setCitas]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [diaSeleccionado, setDia]     = useState(null);

  const hoy = new Date();
  const [mesActual, setMes]   = useState(hoy.getMonth());
  const [anioActual, setAnio] = useState(hoy.getFullYear());

  const { primer, total } = getCalendario(anioActual, mesActual);

  // Cargar usuario
  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) setUsuario(JSON.parse(u));
  }, []);

  // Cargar citas del cliente
  useEffect(() => {
    if (!usuario?.id) return;
    setLoading(true);
    fetch(`${API}/citas/cliente/${usuario.id}`)
      .then(r => r.json())
      .then(data => setCitas(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error citas:", err))
      .finally(() => setLoading(false));
  }, [usuario]);

  const prevMes = () => {
    if (mesActual === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  };
  const nextMes = () => {
    if (mesActual === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  };

  // Obtener citas de un día específico
  const citasDelDia = (dia) => {
  const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
  return citas.filter(c => {
    const fechaCita = c.fecha?.split("T")[0]; // ← esto recorta la hora
    return fechaCita === fechaStr;
  });
};

  // Citas del día seleccionado
  const citasDiaSeleccionado = diaSeleccionado ? citasDelDia(diaSeleccionado) : [];

  // Citas del mes actual (para el resumen lateral)
  const citasDelMes = citas.filter(c => {
  const fechaCita = c.fecha?.split("T")[0]; // ← agrega esto
  const [anio, mes] = fechaCita?.split("-") ?? [];
  return parseInt(anio) === anioActual && parseInt(mes) === mesActual + 1;
})

  const iniciales = usuario
    ? `${usuario.nombre?.charAt(0) ?? ""}${usuario.apellido?.charAt(0) ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="cc-wrapper">
      {/* ── Sidebar ── */}
      <aside className={`cc-sidebar${sidebarOpen ? " active" : ""}`}>
        <div className="cc-sidebar-header">
          <div className="cc-brand">
            <div className="cc-brand-name">Velvet Match</div>
            <div className="cc-brand-sub">Tu plataforma de belleza</div>
          </div>
          <button className="cc-close-sidebar" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="cc-nav">
          <div className="cc-nav-label">MENÚ</div>
          <Link className={`cc-nav-link${location.pathname === "/clienteDashboard" ? " active" : ""}`} to="/clienteDashboard" onClick={() => setSidebarOpen(false)}>
            <span className="cc-ic">🏠</span> Inicio
          </Link>
          <Link className={`cc-nav-link${location.pathname === "/clienteCalendario" ? " active" : ""}`} to="/clienteCalendario" onClick={() => setSidebarOpen(false)}>
            <span className="cc-ic">📅</span> Calendario
          </Link>
          <Link className={`cc-nav-link${location.pathname === "/clientePerfil" ? " active" : ""}`} to="/clientePerfil" onClick={() => setSidebarOpen(false)}>
            <span className="cc-ic">👤</span> Mi perfil
          </Link>
        </nav>
        <div className="cc-sidebar-footer">
          <div className="cc-user-dot">{iniciales}</div>
          <div className="cc-user-info">
            <div className="cc-name">{usuario ? `${usuario.nombre} ${usuario.apellido}` : "Cliente"}</div>
            <div className="cc-role">Cliente</div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="cc-overlay active" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="cc-main">
        <header className="cc-topbar">
          <button className="cc-menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="cc-topbar-title">Mi calendario</span>
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

        <div className="cc-content">
          {loading ? (
            <div className="cc-loading-state">Cargando tus citas...</div>
          ) : (
            <div className="cc-cal-layout">

              {/* ── Calendario ── */}
              <div className="cc-cal-card">
                <div className="cc-cal-head">
                  <span className="cc-cal-month">{MESES[mesActual]} {anioActual}</span>
                  <div className="cc-cal-nav">
                    <button className="cc-cal-nav-btn" onClick={prevMes}>‹</button>
                    <button className="cc-cal-nav-btn" onClick={nextMes}>›</button>
                  </div>
                </div>

                <div className="cc-cal-grid">
                  <div className="cc-cal-weekdays">
                    {DIAS_SEMANA.map(d => <div key={d} className="cc-cal-weekday">{d}</div>)}
                  </div>
                  <div className="cc-cal-days">
                    {Array.from({ length: primer }).map((_, i) => (
                      <div key={`e-${i}`} className="cc-cal-day cc-empty" />
                    ))}
                    {Array.from({ length: total }).map((_, i) => {
                      const d = i + 1;
                      const esHoy = d === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear();
                      const seleccionado = d === diaSeleccionado;
                      const tieneCitas = citasDelDia(d).length > 0;
                      let cls = "cc-cal-day cc-available";
                      if (esHoy) cls += " cc-today";
                      if (seleccionado) cls += " cc-selected";
                      return (
                        <div key={d} className={cls} onClick={() => setDia(d === diaSeleccionado ? null : d)}>
                          {d}
                          {tieneCitas && <span className="cc-dia-dot" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Leyenda */}
                <div className="cc-cal-legend">
                  <div className="cc-legend-item">
                    <div className="cc-legend-box" style={{background:"#45062E"}} /> Seleccionado
                  </div>
                  <div className="cc-legend-item">
                    <div className="cc-legend-dot" /> Con cita
                  </div>
                </div>

                {/* Citas del día seleccionado */}
                {diaSeleccionado && (
                  <div className="cc-dia-citas">
                    <div className="cc-dia-citas-title">
                      {diaSeleccionado} de {MESES[mesActual]}
                    </div>
                    {citasDiaSeleccionado.length === 0 ? (
                      <div className="cc-dia-vacio">Sin citas este día</div>
                    ) : (
                      citasDiaSeleccionado.map(cita => {
                        const est = ESTADO_COLORS[cita.estado] ?? ESTADO_COLORS.pendiente;
                        return (
                          <div key={cita._id} className="cc-dia-cita-item" style={{borderLeft: `3px solid ${est.color}`}}>
                            <div className="cc-dia-cita-hora">{cita.hora}</div>
                            <div className="cc-dia-cita-info">
                              <div className="cc-dia-cita-servicio">{cita.id_servicio?.nombre ?? "Servicio"}</div>
                              <div className="cc-dia-cita-negocio">{cita.id_negocio?.nombre ?? ""}</div>
                            </div>
                            <span className="cc-dia-cita-badge" style={{background: est.bg, color: est.color}}>
                              {est.label}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* ── Panel: citas del mes ── */}
              <div className="cc-side-panel">
                <div className="cc-panel-card">
                  <div className="cc-panel-head">
                    <div className="cc-panel-title">Citas en {MESES[mesActual]}</div>
                    <div className="cc-panel-sub">{citasDelMes.length} cita{citasDelMes.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="cc-panel-body">
                    {citasDelMes.length === 0 ? (
                      <div className="cc-empty-mes">
                        <div style={{fontSize:"32px"}}>📅</div>
                        <div style={{color:"#999", fontSize:"14px", marginTop:"8px"}}>No tienes citas este mes</div>
                        <button
                          className="cc-btn-explorar"
                          onClick={() => navigate("/clienteDashboard")}
                        >
                          Explorar negocios
                        </button>
                      </div>
                    ) : (
                      <div className="cc-mes-lista">
                        {citasDelMes.map(cita => {
                          const [, , dia] = cita.fecha?.split("-") ?? [];
                          const est = ESTADO_COLORS[cita.estado] ?? ESTADO_COLORS.pendiente;
                          return (
                            <div
                              key={cita._id}
                              className="cc-mes-cita-item"
                              onClick={() => {
                                setDia(parseInt(dia));
                                const [anio, mes] = cita.fecha.split("-");
                                setAnio(parseInt(anio));
                                setMes(parseInt(mes) - 1);
                              }}
                            >
                              <div className="cc-mes-fecha-box">
                                <div className="cc-mes-dia">{parseInt(dia)}</div>
                                <div className="cc-mes-mes">{MESES_CORTO[mesActual]}</div>
                              </div>
                              <div className="cc-mes-info">
                                <div className="cc-mes-servicio">{cita.id_servicio?.nombre ?? "Servicio"}</div>
                                <div className="cc-mes-hora">⏰ {cita.hora}</div>
                                <div className="cc-mes-negocio">{cita.id_negocio?.nombre ?? ""}</div>
                              </div>
                              <span className="cc-mes-badge" style={{background: est.bg, color: est.color}}>
                                {est.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen rápido */}
                <div className="cc-panel-card">
                  <div className="cc-panel-head">
                    <div className="cc-panel-title">Resumen</div>
                  </div>
                  <div className="cc-panel-body">
                    <div className="cc-resumen">
                      {Object.entries(ESTADO_COLORS).map(([estado, cfg]) => (
                        <div key={estado} className="cc-resumen-row">
                          <span style={{color: cfg.color}}>{cfg.label}</span>
                          <span><strong>{citas.filter(c => c.estado === estado).length}</strong></span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="cc-btn-explorar"
                      style={{marginTop:"12px"}}
                      onClick={() => navigate("/clientePerfil", { state: { tab: "citas" } })}
                    >
                      Ver historial completo
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}