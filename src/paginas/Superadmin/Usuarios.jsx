import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SharedLayout.css";
import "./Usuarios.css";

const BASE = "http://localhost:5000/api";


const TABS = ["Todos", "Admin", "Empleado", "Cliente"];

export default function Usuarios() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [tabActivo, setTabActivo]       = useState("Todos");
  const [busqueda, setBusqueda]         = useState("");
  const [usuarios, setUsuarios]         = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const location = useLocation();
  const toggle = () => setIsSidebarActive(!isSidebarActive);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const res = await fetch(`${BASE}/usuarios`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];
        setUsuarios(lista);
        if (lista.length > 0) setSeleccionado(lista[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargarUsuarios();
  }, []);

  // Helpers para normalizar datos de MongoDB
  const getNombre = (u) => u.nombre || u.name || "Sin nombre";
  const getEmail = (u) => u.email || u.correo || "—";
  const getRol = (u) => {
    const r = u.roles || u.rol || u.role || u.tipo || "";
    if (!r) return "—";
    // Capitalizar primera letra
    return r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
  };
  const getInicial = (u) => getNombre(u).charAt(0).toUpperCase();
  const getNegocio = (u) => u.trabaja_en?.nombre || u.negocio || "—";
  const getTipoNegocio = (u) => u.trabaja_en?.tipo || "—";
  const getActivo = (u) => u.activo !== false && u.estado !== "inactivo";

  const usuariosFiltrados = usuarios.filter((u) => {
    const rol = (u.roles || u.rol || u.role || "").toLowerCase();
    const coincideTab =
      tabActivo === "Todos" ||
      (tabActivo === "Admin"    && (rol === "admin" || rol === "administrador" || rol === "superadmin")) ||
      (tabActivo === "Empleado" && rol === "empleado") ||
      (tabActivo === "Cliente"  && rol === "cliente");
    const nombre = getNombre(u).toLowerCase();
    const email  = getEmail(u).toLowerCase();
    const coincideBusqueda = nombre.includes(busqueda.toLowerCase()) || email.includes(busqueda.toLowerCase());
    return coincideTab && coincideBusqueda;
  });

  return (
    <div className="sh-root">
      <div className={`sh-overlay ${isSidebarActive ? "active" : ""}`} onClick={toggle} />

      <aside className={`sh-sidebar ${isSidebarActive ? "active" : ""}`}>
        <div className="sh-sidebar-header">
          <div>
            <div className="sh-brand-name">Velvet Match</div>
            <div className="sh-brand-sub">Super Admin</div>
          </div>
          <button className="sh-close-btn" onClick={toggle}>✕</button>
        </div>
        <nav className="sh-nav">
          <div className="sh-nav-label">Principal</div>
          <Link to="/dashboard" className={`sh-nav-item ${location.pathname === "/dashboard" ? "active" : ""}`} onClick={toggle}><span className="ic">🏠</span> Dashboard</Link>
          <div className="sh-nav-label" style={{ marginTop: 6 }}>Gestión</div>
          <Link to="/negocios"  className={`sh-nav-item ${location.pathname === "/negocios"  ? "active" : ""}`} onClick={toggle}><span className="ic">🏪</span> Negocios</Link>
          <Link to="/usuarios"  className={`sh-nav-item ${location.pathname === "/usuarios"  ? "active" : ""}`} onClick={toggle}><span className="ic">👥</span> Usuarios</Link>
          <div className="sh-nav-label" style={{ marginTop: 6 }}>Reportes</div>
          <Link to="/analytics" className={`sh-nav-item ${location.pathname === "/analytics" ? "active" : ""}`} onClick={toggle}><span className="ic">📈</span> Analytics</Link>
        </nav>
        <div className="sh-sidebar-footer">
          <div className="sh-footer-avatar">A</div>
          <div>
            <div className="sh-footer-name">Adriana Salazar</div>
            <div className="sh-footer-role">Super Admin</div>
          </div>
        </div>
      </aside>

      <main className="sh-main">
        <header className="sh-topbar">
          <button className="sh-menu-toggle" onClick={toggle}>☰</button>
          <span className="sh-topbar-title">Usuarios</span>
          <button
            className="sh-logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <div className="usu-content">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8a5070" }}>Cargando usuarios...</div>
          ) : error ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#c04040" }}>
              Error: {error}<br />
              <small>¿Ya agregaste el endpoint <code>GET /api/usuarios</code> al backend?</small>
            </div>
          ) : (
            <div className="usu-layout">
              {/* Lista */}
              <div className="usu-list-card">
                <div className="usu-list-head">
                  <span className="usu-list-head-title">Todos los usuarios</span>
                  <span className="usu-count-badge">{usuariosFiltrados.length}</span>
                </div>
                <div className="usu-list-search">
                  <input placeholder="Buscar usuario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
                <div className="usu-role-tabs">
                  {TABS.map((tab) => (
                    <button key={tab} className={`usu-role-tab ${tabActivo === tab ? "active" : ""}`} onClick={() => setTabActivo(tab)}>{tab}</button>
                  ))}
                </div>
                <div className="usu-list-scroll">
                  {usuariosFiltrados.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#8a5070", fontSize: 13 }}>Sin resultados</div>
                  ) : usuariosFiltrados.map((u) => (
                    <div key={u._id} className={`usu-list-item ${seleccionado?._id === u._id ? "selected" : ""}`} onClick={() => setSeleccionado(u)}>
                      <div className="usu-list-avatar">{getInicial(u)}</div>
                      <div className="usu-list-item-info">
                        <div className="usu-list-item-name">{getNombre(u)}</div>
                        <div className="usu-list-item-meta">{getRol(u)} · {getNegocio(u)}</div>
                      </div>
                      <div className={`usu-status-dot ${getActivo(u) ? "dot-active" : "dot-inactive"}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle */}
              {seleccionado && (
                <div className="usu-detail-card">
                  <div className="usu-detail-header">
                    <div className="usu-detail-avatar">{getInicial(seleccionado)}</div>
                    <div className="usu-detail-header-info">
                      <div className="usu-detail-name">{getNombre(seleccionado)}</div>
                      <div className="usu-detail-role-tag">🔑 {getRol(seleccionado)} · {getNegocio(seleccionado)}</div>
                    </div>
                    <div className="usu-detail-actions">
                      <button className="usu-btn-outline-light">Editar</button>
                    </div>
                  </div>
                  <div className="usu-detail-body">
                    <div className="usu-detail-section-title">Información personal</div>
                    <div className="usu-detail-grid">
                      <div className="usu-field"><label>Nombre completo</label><p>{getNombre(seleccionado)}</p></div>
                      <div className="usu-field"><label>Email</label><p>{getEmail(seleccionado)}</p></div>
                      <div className="usu-field"><label>Apellido</label><p>{seleccionado.apellido || "—"}</p></div>
                      <div className="usu-field"><label>Fecha de nacimiento</label><p>{seleccionado.fechNacimiento ? new Date(seleccionado.fechNacimiento).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p></div>
                      <div className="usu-field"><label>Fecha de ingreso</label><p>{seleccionado.createdAt ? new Date(seleccionado.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p></div>
                      <div className="usu-field"><label>Rol</label><p><span className="usu-badge usu-badge-role">{getRol(seleccionado)}</span></p></div>
                      <div className="usu-field"><label>Estado</label><p>
                        <span className={`usu-badge ${getActivo(seleccionado) ? "usu-badge-active" : "usu-badge-inactive"}`}>
                          ● {getActivo(seleccionado) ? "Activo" : "Inactivo"}
                        </span>
                      </p></div>
                    </div>
                    <div className="usu-detail-section-title">Negocio</div>
                    <div className="usu-detail-grid">
                      <div className="usu-field"><label>Nombre del negocio</label><p>{getNegocio(seleccionado)}</p></div>
                      <div className="usu-field"><label>Tipo</label><p>{getTipoNegocio(seleccionado)}</p></div>
                      <div className="usu-field"><label>ID de negocio</label><p style={{ fontSize: 12, fontFamily: "monospace", color: "#7F055F" }}>{seleccionado.trabaja_en?._id || seleccionado.trabaja_en || "—"}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}