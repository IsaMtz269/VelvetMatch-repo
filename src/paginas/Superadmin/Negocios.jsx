import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SharedLayout.css";
import "./Negocios.css";

const negociosData = [
  { id: 1, emoji: "💅", nombre: "Chapi's Nails",    owner: "Adriana López",  tipo: "Salón de uñas",   url: "/nails/chapis-nails",     citas: 142, activo: true  },
  { id: 2, emoji: "✂️", nombre: "Barbería Regia",   owner: "Carlos Garza",   tipo: "Barbería",         url: "/barber/barberia-regia",  citas: 89,  activo: true  },
  { id: 3, emoji: "💆", nombre: "Estética Lumière", owner: "María Fernanda", tipo: "Estética",         url: "/estetica/lumiere",       citas: 214, activo: true  },
  { id: 4, emoji: "💇", nombre: "Glam Studio",      owner: "Sofía Ramírez",  tipo: "Salón de belleza", url: "/salon/glam-studio",      citas: 37,  activo: false },
  { id: 5, emoji: "💄", nombre: "Beauty Corner",    owner: "Valentina Cruz", tipo: "Estética",         url: "/estetica/beauty-corner", citas: 176, activo: true  },
];

const TIPOS = ["Todos", "Barbería", "Estética", "Salón de uñas", "Salón de belleza"];

export default function Negocios() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const location = useLocation();
  const toggle = () => setIsSidebarActive(!isSidebarActive);

  const negociosFiltrados = negociosData.filter((n) => {
    const cumpleTipo = filtroTipo === "Todos" || n.tipo === filtroTipo;
    const cumpleBusqueda = n.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleTipo && cumpleBusqueda;
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
          <span className="sh-topbar-title">Negocios</span>
          <div className="sh-topbar-right">
            <Link to="/" className="sh-logout-btn">Cerrar sesión</Link>
          </div>
        </header>

        <div className="neg-content">
          {/* Filtros */}
          <div className="neg-filter-row">
            <span className="neg-filter-label">Tipo:</span>
            <div className="neg-filter-chips">
              {TIPOS.map((t) => (
                <button key={t} className={`neg-chip-btn ${filtroTipo === t ? "active" : ""}`} onClick={() => setFiltroTipo(t)}>{t}</button>
              ))}
            </div>
            <input className="neg-search-input" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>

          <div className="neg-card">
            <div className="neg-card-head">
              <span className="neg-card-title">Negocios registrados</span>
              <button className="neg-btn-sm">⬇ Exportar</button>
            </div>

            {/* Tabla desktop */}
            <div className="neg-table-wrapper">
              <table className="neg-table">
                <thead>
                  <tr>
                    <th>Negocio</th><th>Tipo</th><th>URL</th><th>Citas este mes</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {negociosFiltrados.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <div className="neg-biz-cell">
                          <div className="neg-biz-avatar">{n.emoji}</div>
                          <div><div className="neg-biz-name">{n.nombre}</div><div className="neg-biz-owner">{n.owner}</div></div>
                        </div>
                      </td>
                      <td><span className="neg-badge neg-badge-type">{n.tipo}</span></td>
                      <td className="neg-biz-url">{n.url}</td>
                      <td><strong>{n.citas}</strong></td>
                      <td><span className={`neg-badge ${n.activo ? "neg-badge-active" : "neg-badge-inactive"}`}>● {n.activo ? "Activo" : "Inactivo"}</span></td>
                    </tr>
                  ))}
                  {negociosFiltrados.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#8a5070" }}>No se encontraron negocios</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards móvil */}
            <div className="neg-mobile-cards">
              {negociosFiltrados.map((n) => (
                <div key={n.id} className="neg-mobile-card">
                  <div className="neg-mobile-card-header">
                    <div className="neg-biz-avatar">{n.emoji}</div>
                    <div><div className="neg-biz-name">{n.nombre}</div><div className="neg-biz-owner">{n.owner}</div></div>
                  </div>
                  <div className="neg-mobile-card-details">
                    <div className="neg-detail-row"><span className="neg-detail-label">Tipo:</span> <span className="neg-badge neg-badge-type">{n.tipo}</span></div>
                    <div className="neg-detail-row"><span className="neg-detail-label">URL:</span> <span className="neg-biz-url">{n.url}</span></div>
                    <div className="neg-detail-row"><span className="neg-detail-label">Citas:</span> <strong>{n.citas}</strong> este mes</div>
                    <div className="neg-detail-row"><span className="neg-detail-label">Estado:</span> <span className={`neg-badge ${n.activo ? "neg-badge-active" : "neg-badge-inactive"}`}>● {n.activo ? "Activo" : "Inactivo"}</span></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}><button className="neg-btn-sm">Ver</button></div>
                </div>
              ))}
            </div>

            <div className="neg-table-footer">
              <span>Mostrando {negociosFiltrados.length} de {negociosData.length} negocios</span>
              <div className="neg-pagination">
                <div className="neg-page-btn active">1</div>
                <div className="neg-page-btn">2</div>
                <div className="neg-page-btn">3</div>
                <div className="neg-page-btn">›</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}