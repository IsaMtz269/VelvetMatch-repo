import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SharedLayout.css";
import "./Usuarios.css";

const usuariosData = [
  { id: 1,  inicial: "A", nombre: "Adriana López",    meta: "Admin · Chapi's Nails",     activo: true,
    info: { nombreCompleto: "Adriana López Martínez", email: "adriana@chapisnails.com", nacimiento: "14 de marzo, 1990", ingreso: "5 de enero, 2025", rol: "Administrador", estado: "Activo",
            negocio: "Chapi's Nails", tipo: "Salón de uñas", url: "/nails/chapis-nails", empleados: "4 empleados", citas: "142", cancelaciones: "12" } },
  { id: 2,  inicial: "C", nombre: "Carlos Garza",     meta: "Admin · Barbería Regia",    activo: true,
    info: { nombreCompleto: "Carlos Garza Treviño",   email: "carlos@barberiaregia.com", nacimiento: "22 de julio, 1985",   ingreso: "10 de febrero, 2025", rol: "Administrador", estado: "Activo",
            negocio: "Barbería Regia", tipo: "Barbería", url: "/barber/barberia-regia", empleados: "3 empleados", citas: "98", cancelaciones: "7" } },
  { id: 3,  inicial: "M", nombre: "María Fernanda",   meta: "Admin · Estética Lumière",  activo: true,
    info: { nombreCompleto: "María Fernanda Ortiz",   email: "maria@estetica-lumiere.com", nacimiento: "3 de noviembre, 1992", ingreso: "15 de marzo, 2025", rol: "Administrador", estado: "Activo",
            negocio: "Estética Lumière", tipo: "Estética", url: "/estetica/lumiere", empleados: "5 empleados", citas: "210", cancelaciones: "18" } },
  { id: 4,  inicial: "P", nombre: "Paola Ríos",       meta: "Empleado · Chapi's Nails",  activo: true,
    info: { nombreCompleto: "Paola Ríos Garza",       email: "paola@chapisnails.com",    nacimiento: "17 de abril, 1998",   ingreso: "20 de enero, 2025", rol: "Empleado", estado: "Activo",
            negocio: "Chapi's Nails", tipo: "Salón de uñas", url: "/nails/chapis-nails", empleados: "—", citas: "64", cancelaciones: "3" } },
  { id: 5,  inicial: "L", nombre: "Lucía Mendoza",    meta: "Cliente · —",               activo: false,
    info: { nombreCompleto: "Lucía Mendoza Vega",     email: "lucia.mendoza@gmail.com",  nacimiento: "9 de junio, 2000",    ingreso: "2 de abril, 2025", rol: "Cliente", estado: "Inactivo",
            negocio: "—", tipo: "—", url: "—", empleados: "—", citas: "5", cancelaciones: "2" } },
  { id: 6,  inicial: "R", nombre: "Roberto Salinas",  meta: "Cliente · —",               activo: true,
    info: { nombreCompleto: "Roberto Salinas Peña",   email: "r.salinas@hotmail.com",    nacimiento: "30 de enero, 1995",   ingreso: "8 de mayo, 2025", rol: "Cliente", estado: "Activo",
            negocio: "—", tipo: "—", url: "—", empleados: "—", citas: "11", cancelaciones: "1" } },
  { id: 7,  inicial: "S", nombre: "Sofía Ramírez",    meta: "Admin · Glam Studio",       activo: false,
    info: { nombreCompleto: "Sofía Ramírez Luna",     email: "sofia@glamstudio.com",     nacimiento: "25 de septiembre, 1991", ingreso: "1 de marzo, 2025", rol: "Administrador", estado: "Inactivo",
            negocio: "Glam Studio", tipo: "Maquillaje", url: "/makeup/glam-studio", empleados: "2 empleados", citas: "37", cancelaciones: "9" } },
  { id: 8,  inicial: "V", nombre: "Valentina Cruz",   meta: "Admin · Beauty Corner",     activo: true,
    info: { nombreCompleto: "Valentina Cruz Mora",    email: "vale@beautycorner.com",    nacimiento: "12 de diciembre, 1993", ingreso: "18 de febrero, 2025", rol: "Administrador", estado: "Activo",
            negocio: "Beauty Corner", tipo: "Estética", url: "/estetica/beauty-corner", empleados: "3 empleados", citas: "89", cancelaciones: "6" } },
  { id: 9,  inicial: "J", nombre: "Jorge Mendez",     meta: "Empleado · Barbería Regia", activo: true,
    info: { nombreCompleto: "Jorge Mendez Flores",    email: "jorge@barberiaregia.com",  nacimiento: "7 de agosto, 1997",   ingreso: "25 de enero, 2025", rol: "Empleado", estado: "Activo",
            negocio: "Barbería Regia", tipo: "Barbería", url: "/barber/barberia-regia", empleados: "—", citas: "53", cancelaciones: "4" } },
];

const TABS = ["Todos", "Admin", "Empleado", "Cliente"];

export default function Usuarios() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [tabActivo, setTabActivo]       = useState("Todos");
  const [busqueda, setBusqueda]         = useState("");
  const [seleccionado, setSeleccionado] = useState(usuariosData[0]);
  const location = useLocation();
  const toggle = () => setIsSidebarActive(!isSidebarActive);

  const usuariosFiltrados = usuariosData.filter((u) => {
    const coincideTab = tabActivo === "Todos" || u.info.rol.toLowerCase().includes(tabActivo.toLowerCase());
    const coincideBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.meta.toLowerCase().includes(busqueda.toLowerCase());
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
          <div className="sh-topbar-right">
            <Link to="/" className="sh-logout-btn">Cerrar sesión</Link>
          </div>
        </header>

        <div className="usu-content">
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
                {usuariosFiltrados.map((u) => (
                  <div key={u.id} className={`usu-list-item ${seleccionado?.id === u.id ? "selected" : ""}`} onClick={() => setSeleccionado(u)}>
                    <div className="usu-list-avatar">{u.inicial}</div>
                    <div className="usu-list-item-info">
                      <div className="usu-list-item-name">{u.nombre}</div>
                      <div className="usu-list-item-meta">{u.meta}</div>
                    </div>
                    <div className={`usu-status-dot ${u.activo ? "dot-active" : "dot-inactive"}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Detalle */}
            {seleccionado && (
              <div className="usu-detail-card">
                <div className="usu-detail-header">
                  <div className="usu-detail-avatar">{seleccionado.inicial}</div>
                  <div className="usu-detail-header-info">
                    <div className="usu-detail-name">{seleccionado.nombre}</div>
                    <div className="usu-detail-role-tag">🔑 {seleccionado.info.rol} · {seleccionado.info.negocio}</div>
                  </div>
                  <div className="usu-detail-actions">
                    <button className="usu-btn-outline-light">Editar</button>
                  </div>
                </div>
                <div className="usu-detail-body">
                  <div className="usu-detail-section-title">Información personal</div>
                  <div className="usu-detail-grid">
                    <div className="usu-field"><label>Nombre completo</label><p>{seleccionado.info.nombreCompleto}</p></div>
                    <div className="usu-field"><label>Email</label><p>{seleccionado.info.email}</p></div>
                    <div className="usu-field"><label>Fecha de nacimiento</label><p>{seleccionado.info.nacimiento}</p></div>
                    <div className="usu-field"><label>Fecha de ingreso</label><p>{seleccionado.info.ingreso}</p></div>
                    <div className="usu-field"><label>Rol</label><p><span className="usu-badge usu-badge-role">{seleccionado.info.rol}</span></p></div>
                    <div className="usu-field"><label>Estado</label><p>
                      <span className={`usu-badge ${seleccionado.info.estado === "Activo" ? "usu-badge-active" : "usu-badge-inactive"}`}>● {seleccionado.info.estado}</span>
                    </p></div>
                  </div>
                  <div className="usu-detail-section-title">Negocio</div>
                  <div className="usu-detail-grid">
                    <div className="usu-field"><label>Nombre del negocio</label><p>{seleccionado.info.negocio}</p></div>
                    <div className="usu-field"><label>Tipo</label><p>{seleccionado.info.tipo}</p></div>
                    <div className="usu-field"><label>URL</label><p className="usu-biz-url">{seleccionado.info.url}</p></div>
                    <div className="usu-field"><label>Empleados a cargo</label><p>{seleccionado.info.empleados}</p></div>
                    <div className="usu-field"><label>Citas este mes</label><p>{seleccionado.info.citas}</p></div>
                    <div className="usu-field"><label>Cancelaciones</label><p>{seleccionado.info.cancelaciones}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}