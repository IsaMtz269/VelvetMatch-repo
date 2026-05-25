import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SharedLayout.css";
import "./Analytics.css";

const BASE = "http://localhost:5000/api";

export default function Analytics() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const toggle = () => setIsSidebarActive(!isSidebarActive);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [analyticsRes, negociosRes] = await Promise.all([
          fetch(`${BASE}/analytics/global`),
          fetch(`${BASE}/negocios`),
        ]);
        if (!analyticsRes.ok) throw new Error("Error al obtener analytics");
        if (!negociosRes.ok) throw new Error("Error al obtener negocios");

        const analyticsData = await analyticsRes.json();
        const negociosData = await negociosRes.json();

        setAnalytics(analyticsData);
        setNegocios(Array.isArray(negociosData) ? negociosData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

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
          <span className="sh-topbar-title">Analytics</span>
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

        <div className="ana-content">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8a5070" }}>Cargando analytics...</div>
          ) : error ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#c04040" }}>Error: {error}</div>
          ) : (
            <>
              {/* KPIs */}
              <div className="ana-kpi-grid">
                <div className="ana-kpi-card">
                  <div className="ana-kpi-label">Total Negocios</div>
                  <div className="ana-kpi-value">{analytics?.totalEmpresas ?? "—"}</div>
                  <div className="ana-kpi-trend">Negocios en plataforma</div>
                </div>
                <div className="ana-kpi-card">
                  <div className="ana-kpi-label">Total Usuarios</div>
                  <div className="ana-kpi-value">{analytics?.totalUsuarios ?? "—"}</div>
                  <div className="ana-kpi-trend">Usuarios registrados</div>
                </div>
                <div className="ana-kpi-card">
                  <div className="ana-kpi-label">Total Citas</div>
                  <div className="ana-kpi-value">{analytics?.totalOperaciones ?? "—"}</div>
                  <div className="ana-kpi-trend">Operaciones registradas</div>
                </div>
              </div>

              {/* Tabla de negocios */}
              <div className="ana-table-card">
                <div className="ana-card-head">
                  <h2 className="ana-card-title">Negocios registrados</h2>
                </div>
                <div className="ana-table-responsive">
                  <table className="ana-custom-table">
                    <thead>
                      <tr>
                        <th>Negocio</th><th>Tipo</th><th>Ubicación</th><th>Celular</th><th>Instagram</th>
                      </tr>
                    </thead>
                    <tbody>
                      {negocios.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#8a5070" }}>Sin negocios registrados</td></tr>
                      ) : negocios.map((n) => (
                        <tr key={n._id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 20 }}>🏪</span>
                              <div>
                                <div style={{ fontWeight: 600 }}>{n.nombre}</div>
                                <div style={{ fontSize: 11, color: "#888" }}>{n.eslogan || n.descripcion?.slice(0, 35) || "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td>{n.tipo || "—"}</td>
                          <td>{n.ubicacion || "—"}</td>
                          <td>{n.celular || "—"}</td>
                          <td style={{ color: "#7F055F", fontFamily: "monospace" }}>{n.instagram || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ana-table-footer">
                  <span>Mostrando {negocios.length} negocios activos</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}