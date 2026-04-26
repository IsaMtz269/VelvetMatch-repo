import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SharedLayout.css";
import "./Dashboard.css";

const stats = [
  { label: "Total negocios",       value: "38",    sub: "▲ 4 nuevos este mes" },
  { label: "Usuarios registrados", value: "214",   sub: "▲ 21 nuevos este mes" },
  { label: "Citas este mes",       value: "1,082", sub: "▲ 8% vs mes anterior" },
];

const quickCards = [
  { icon: "🏪", name: "Negocios",  desc: "Visualiza y filtra los negocios registrados en la plataforma.", chip: "38 activos",   path: "/negocios" },
  { icon: "👥", name: "Usuarios",  desc: "Lista completa de usuarios con roles y detalles personales.",  chip: "214 usuarios", path: "/usuarios" },
  { icon: "📊", name: "Analytics", desc: "Estadísticas y reportes por negocio, exportables a Excel.",    chip: "Exportable",   path: "/analytics" },
];

export default function Dashboard() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const location = useLocation();
  const toggle = () => setIsSidebarActive(!isSidebarActive);

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
          <span className="sh-topbar-title">Dashboard</span>
          <div className="sh-topbar-right">
            <Link to="/" className="sh-logout-btn">Cerrar sesión</Link>
          </div>
        </header>

        <div className="db-page-content">
          <p className="db-page-intro">Bienvenido. Aquí tienes un resumen general de la plataforma.</p>

          <div className="db-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="db-stat-card">
                <div className="db-stat-label">{s.label}</div>
                <div className="db-stat-value">{s.value}</div>
                <div className="db-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="db-section-title">Acceso rápido</div>
          <div className="db-quick-grid">
            {quickCards.map((c) => (
              <Link key={c.path} className="db-quick-card" to={c.path}>
                <div className="db-quick-icon">{c.icon}</div>
                <div className="db-quick-name">{c.name}</div>
                <div className="db-quick-desc">{c.desc}</div>
                <span className="db-quick-chip">{c.chip}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}