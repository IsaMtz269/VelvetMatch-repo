import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ClienteCalendario.css";

// Datos de negocios con sus servicios y horarios
const negociosData = [
  {
    id: 1, emoji: "💅", nombre: "Chapi's Nails", tipo: "Salón de uñas",
    horarioTexto: "Lun – Sáb, 10am – 7pm",
    servicios: [
      { id: 1, nombre: "Uñas acrílicas",    duracion: "90 min", precio: "$350" },
      { id: 2, nombre: "Gel semipermanente", duracion: "60 min", precio: "$250" },
      { id: 3, nombre: "Nail art",           duracion: "45 min", precio: "$150" },
      { id: 4, nombre: "Manicure clásico",   duracion: "40 min", precio: "$120" },
    ],
    horariosOcupados: ["10:00", "10:30", "13:00"],
  },
  {
    id: 2, emoji: "✂️", nombre: "Barbería Regia", tipo: "Barbería",
    horarioTexto: "Lun – Sáb, 9am – 8pm",
    servicios: [
      { id: 1, nombre: "Corte clásico",       duracion: "30 min", precio: "$150" },
      { id: 2, nombre: "Afeitado con navaja", duracion: "25 min", precio: "$120" },
      { id: 3, nombre: "Corte + barba",       duracion: "50 min", precio: "$220" },
      { id: 4, nombre: "Tratamiento capilar", duracion: "40 min", precio: "$180" },
    ],
    horariosOcupados: ["09:00", "11:00", "14:00"],
  },
  {
    id: 3, emoji: "💆", nombre: "Estética Lumière", tipo: "Estética",
    horarioTexto: "Mar – Dom, 10am – 6pm",
    servicios: [
      { id: 1, nombre: "Corte y peinado",    duracion: "60 min",  precio: "$280" },
      { id: 2, nombre: "Colorimetría",       duracion: "120 min", precio: "$650" },
      { id: 3, nombre: "Tratamiento facial", duracion: "75 min",  precio: "$400" },
      { id: 4, nombre: "Maquillaje social",  duracion: "60 min",  precio: "$350" },
    ],
    horariosOcupados: ["10:00", "12:00", "16:00"],
  },
];

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_SEMANA = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

const HORARIOS = ["10:00","10:30","11:00","11:30","12:00","12:30","13:00","14:00","14:30","15:00","15:30","16:00"];

function getCalendario(year, month) {
  const primer = new Date(year, month, 1).getDay();
  const total  = new Date(year, month + 1, 0).getDate();
  return { primer, total };
}

export default function ClienteCalendario() {
  const location = useLocation();
  const navigate = useNavigate();

  // Si viene del dashboard con negocio/servicio preseleccionado
  const preNegocio  = location.state?.negocio  ?? null;
  const preServicio = location.state?.servicio ?? null;

  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [negocioSel, setNegocioSel]       = useState(
    preNegocio ? negociosData.find(n => n.id === preNegocio.id) ?? negociosData[0] : negociosData[0]
  );
  const [servicioSel, setServicioSel]     = useState(
    preServicio ? negocioSel.servicios.find(s => s.nombre === preServicio.nombre) ?? null : null
  );
  const [diaSeleccionado, setDia]         = useState(26);
  const [horarioSel, setHorario]          = useState("12:00");
  const [metodoPago, setMetodoPago]       = useState("tarjeta");
  const [mesActual, setMes]               = useState(1); // febrero
  const [anioActual, setAnio]             = useState(2026);
  const [confirmado, setConfirmado]       = useState(false);

  const { primer, total } = getCalendario(anioActual, mesActual);
  const hoy = 22; // simulado

  const prevMes = () => {
    if (mesActual === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  };

  const nextMes = () => {
    if (mesActual === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  };

  const esBloqueado = (d) => d <= hoy + 1; // simula regla 48h

  const anticipo = servicioSel
    ? Math.round(parseInt(servicioSel.precio.replace("$","")) * 0.3)
    : 0;

  const resto = servicioSel
    ? parseInt(servicioSel.precio.replace("$","")) - anticipo
    : 0;

  const handleAgendar = () => {
    if (!servicioSel || !diaSeleccionado || !horarioSel) return;
    setConfirmado(true);
  };

  return (
    <div className="cc-wrapper">
      {/* ── Sidebar ── */}
      <aside className={`cc-sidebar${sidebarOpen ? " active" : ""}`}>
        <div className="cc-sidebar-header">
          <div className="cc-brand">
            <div className="cc-brand-name">{negocioSel.nombre}</div>
            <div className="cc-brand-sub">{negocioSel.tipo}</div>
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
          <div className="cc-user-dot">L</div>
          <div className="cc-user-info">
            <div className="cc-name">Lucía Mendoza</div>
            <div className="cc-role">Cliente</div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="cc-overlay active" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="cc-main">
        <header className="cc-topbar">
          <button className="cc-menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="cc-topbar-title">Agendar cita</span>
          <div className="cc-topbar-right">
            <Link to="/" className="cc-logout-header">Cerrar sesión</Link>
          </div>
        </header>

        <div className="cc-content">
          {/* Confirmación */}
          {confirmado && (
            <div className="cc-confirmacion">
              <div className="cc-conf-icon">✅</div>
              <h2>¡Cita solicitada!</h2>
              <p>Tu cita para <strong>{servicioSel?.nombre}</strong> el <strong>{diaSeleccionado} de {MESES[mesActual]}</strong> a las <strong>{horarioSel}</strong> está en estado <strong>Pendiente</strong> hasta que el administrador la apruebe.</p>
              <div className="cc-conf-buttons">
                <button className="cc-btn-conf" onClick={() => { setConfirmado(false); setServicioSel(null); setDia(26); }}>Agendar otra cita</button>
                <Link to="/clientePerfil" className="cc-btn-conf cc-btn-conf--outline">Ver mis citas</Link>
              </div>
            </div>
          )}

          {!confirmado && (
            <>
              {/* Selector de negocio */}
              <div className="cc-negocio-selector">
                <span className="cc-sel-label">Negocio:</span>
                <div className="cc-neg-chips">
                  {negociosData.map(n => (
                    <button
                      key={n.id}
                      className={`cc-neg-chip${negocioSel.id === n.id ? " active" : ""}`}
                      onClick={() => { setNegocioSel(n); setServicioSel(null); }}
                    >
                      {n.emoji} {n.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aviso */}
              <div className="cc-aviso">
                ℹ️ &nbsp;Puedes agendar citas con mínimo <strong>48 horas</strong> de anticipación. Cancela con al menos <strong>6 horas</strong> de anticipación. · {negocioSel.horarioTexto}
              </div>

              <div className="cc-cal-layout">
                {/* Calendario */}
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
                        const bloqueado = esBloqueado(d);
                        const esHoy = d === hoy;
                        const seleccionado = d === diaSeleccionado;
                        let cls = "cc-cal-day";
                        if (bloqueado) cls += " cc-blocked";
                        else cls += " cc-available";
                        if (esHoy) cls += " cc-today";
                        if (seleccionado && !bloqueado) cls += " cc-selected";
                        return (
                          <div key={d} className={cls} onClick={() => !bloqueado && setDia(d)}>
                            {d}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="cc-cal-legend">
                    <div className="cc-legend-item"><div className="cc-legend-box" style={{background:"#FFE8D4",border:"1px solid #EBD2BE"}} /> Disponible</div>
                    <div className="cc-legend-item"><div className="cc-legend-box" style={{background:"#f5e8e8"}} /> No disponible</div>
                    <div className="cc-legend-item"><div className="cc-legend-box" style={{background:"#45062E"}} /> Seleccionado</div>
                  </div>
                </div>

                {/* Panel derecho */}
                <div className="cc-side-panel">
                  {/* Hora */}
                  <div className="cc-panel-card">
                    <div className="cc-panel-head">
                      <div className="cc-panel-title">Selecciona un horario</div>
                      <div className="cc-panel-sub">{diaSeleccionado ? `${diaSeleccionado} de ${MESES[mesActual]}` : "Selecciona un día"}</div>
                    </div>
                    <div className="cc-panel-body">
                      <div className="cc-time-grid">
                        {HORARIOS.map(h => {
                          const ocupado = negocioSel.horariosOcupados.includes(h);
                          return (
                            <div
                              key={h}
                              className={`cc-time-slot${ocupado ? " cc-ocupado" : ""}${horarioSel === h && !ocupado ? " cc-selected" : ""}`}
                              onClick={() => !ocupado && setHorario(h)}
                            >
                              {h}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Servicios del negocio */}
                  <div className="cc-panel-card">
                    <div className="cc-panel-head">
                      <div className="cc-panel-title">Elige un servicio</div>
                      <div className="cc-panel-sub">{negocioSel.nombre}</div>
                    </div>
                    <div className="cc-panel-body">
                      <div className="cc-servicio-list">
                        {negocioSel.servicios.map(s => (
                          <label
                            key={s.id}
                            className={`cc-servicio-option${servicioSel?.id === s.id ? " cc-selected" : ""}`}
                            onClick={() => setServicioSel(s)}
                          >
                            <input type="radio" name="servicio" readOnly checked={servicioSel?.id === s.id} />
                            <div>
                              <div className="cc-so-name">{s.nombre}</div>
                              <div className="cc-so-info">⏱ {s.duracion}</div>
                            </div>
                            <span className="cc-so-precio">{s.precio}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="cc-panel-card">
                    <div className="cc-panel-head">
                      <div className="cc-panel-title">Resumen</div>
                    </div>
                    <div className="cc-panel-body">
                      <div className="cc-resumen">
                        <div className="cc-resumen-row"><span>Negocio</span><span>{negocioSel.nombre}</span></div>
                        <div className="cc-resumen-row"><span>Fecha</span><span>{diaSeleccionado ? `${diaSeleccionado} ${MESES[mesActual]} ${anioActual}` : "—"}</span></div>
                        <div className="cc-resumen-row"><span>Hora</span><span>{horarioSel ?? "—"}</span></div>
                        <div className="cc-resumen-row"><span>Servicio</span><span>{servicioSel?.nombre ?? "—"}</span></div>
                        <div className="cc-resumen-row"><span>Duración</span><span>{servicioSel?.duracion ?? "—"}</span></div>
                        <div className="cc-resumen-row cc-total"><span>Total estimado</span><span>{servicioSel?.precio ?? "—"}</span></div>
                      </div>

                      {servicioSel && (
                        <div className="cc-anticipo-box">
                          <div className="cc-anticipo-header">
                            <span className="cc-anticipo-label">Anticipo requerido (30%)</span>
                            <span className="cc-anticipo-monto">${anticipo} MXN</span>
                          </div>
                          <div className="cc-anticipo-barra-wrap">
                            <div className="cc-anticipo-barra" />
                          </div>
                          <div className="cc-anticipo-detalle">
                            <span>Se paga al confirmar</span>
                            <span>Resta en sucursal: <strong>${resto} MXN</strong></span>
                          </div>
                        </div>
                      )}

                      <div className="cc-pago-label">Método de pago del anticipo</div>
                      <div className="cc-pago-opciones">
                        {[{key:"tarjeta",icon:"💳",label:"Tarjeta"},{key:"transferencia",icon:"🏦",label:"Transferencia"},{key:"efectivo",icon:"💸",label:"Efectivo*"}].map(p => (
                          <div
                            key={p.key}
                            className={`cc-pago-opcion${metodoPago === p.key ? " active" : ""}`}
                            onClick={() => setMetodoPago(p.key)}
                          >
                            <span className="cc-pago-icon">{p.icon}</span>
                            <span className="cc-pago-nombre">{p.label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="cc-pago-nota">*Efectivo solo disponible presencialmente antes de la cita.</p>

                      <button
                        className="cc-btn-agendar"
                        disabled={!servicioSel || !diaSeleccionado || !horarioSel}
                        onClick={handleAgendar}
                      >
                        Solicitar cita y pagar anticipo
                      </button>
                      <p className="cc-nota-48">Tu cita quedará en estado <strong>Pendiente</strong> hasta que el administrador la apruebe.</p>
                    </div>
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