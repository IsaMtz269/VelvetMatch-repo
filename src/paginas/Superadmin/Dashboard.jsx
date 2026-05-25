import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SharedLayout.css";
import "./Dashboard.css";

const BASE = "http://localhost:5000/api";

const quickCards = [
  { icon: "🏪", name: "Negocios",  desc: "Visualiza y filtra los negocios registrados en la plataforma.", path: "/negocios" },
  { icon: "👥", name: "Usuarios",  desc: "Lista completa de usuarios con roles y detalles personales.",  path: "/usuarios" },
  { icon: "📊", name: "Analytics", desc: "Estadísticas y reportes por negocio, exportables a Excel.",    path: "/analytics" },
];

export default function Dashboard() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const toggle = () => setIsSidebarActive(!isSidebarActive);

  useEffect(() => {
    async function cargarStats() {
      try {
        const [negRes, analyticsRes] = await Promise.all([
          fetch(`${BASE}/negocios`),
          fetch(`${BASE}/analytics/global`),
        ]);
        const negocios = await negRes.json();
        const analytics = await analyticsRes.json();

        setStats({
          totalNegocios: Array.isArray(negocios) ? negocios.length : analytics.totalEmpresas,
          totalUsuarios: analytics.totalUsuarios,
          totalCitas: analytics.totalOperaciones,
        });
      } catch (err) {
        console.error("Error cargando stats:", err);
      } finally {
        setLoading(false);
      }
    }
    cargarStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total negocios",       value: stats.totalNegocios, sub: "Negocios en la plataforma" },
        { label: "Usuarios registrados", value: stats.totalUsuarios, sub: "Usuarios totales" },
        { label: "Citas registradas",    value: stats.totalCitas,    sub: "Operaciones totales" },
      ]
    : [];

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
            <button
              className="sh-logout-btn"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="db-page-content">
          <p className="db-page-intro">Bienvenido. Aquí tienes un resumen general de la plataforma.</p>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8a5070" }}>Cargando estadísticas...</div>
          ) : (
            <div className="db-stats-grid">
              {statCards.map((s) => (
                <div key={s.label} className="db-stat-card">
                  <div className="db-stat-label">{s.label}</div>
                  <div className="db-stat-value">{s.value ?? "—"}</div>
                  <div className="db-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          )}

          <div className="db-section-title">Acceso rápido</div>
          <div className="db-quick-grid">
            {quickCards.map((c) => (
              <Link key={c.path} className="db-quick-card" to={c.path}>
                <div className="db-quick-icon">{c.icon}</div>
                <div className="db-quick-name">{c.name}</div>
                <div className="db-quick-desc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}