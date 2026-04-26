import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SharedLayout.css";
import "./Analytics.css";

const analyticsData = [
  { id: 1, emoji: "💅", nombre: "Chapi's Nails",    owner: "Adriana López",  tipo: "Salón de uñas", citas: 142, cancelaciones: 8,  ventas: 18500, empleados: 3 },
  { id: 2, emoji: "✂️", nombre: "Barbería Regia",   owner: "Carlos Garza",   tipo: "Barbería",       citas: 89,  cancelaciones: 12, ventas: 12400, empleados: 2 },
  { id: 3, emoji: "💆", nombre: "Estética Lumière", owner: "María Fernanda", tipo: "Estética",       citas: 214, cancelaciones: 5,  ventas: 42300, empleados: 6 },
  { id: 4, emoji: "💄", nombre: "Beauty Corner",    owner: "Valentina Cruz", tipo: "Estética",       citas: 176, cancelaciones: 14, ventas: 22800, empleados: 5 },
];

export default function Analytics() {
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
          <span className="sh-topbar-title">Analytics</span>
          <div className="sh-topbar-right">
            <Link to="/" className="sh-logout-btn">Cerrar sesión</Link>
          </div>
        </header>

        <div className="ana-content">
          {/* KPIs */}
          <div className="ana-kpi-grid">
            <div className="ana-kpi-card">
              <div className="ana-kpi-label">Ingresos Totales</div>
              <div className="ana-kpi-value">$96,000</div>
              <div className="ana-kpi-trend">↑ 12% vs mes anterior</div>
            </div>
            <div className="ana-kpi-card">
              <div className="ana-kpi-label">Citas del Mes</div>
              <div className="ana-kpi-value">621</div>
              <div className="ana-kpi-trend">↑ 8% vs mes anterior</div>
            </div>
            <div className="ana-kpi-card">
              <div className="ana-kpi-label">Nuevos Negocios</div>
              <div className="ana-kpi-value">14</div>
              <div className="ana-kpi-trend">+3 esta semana</div>
            </div>
          </div>

          {/* Tabla */}
          <div className="ana-table-card">
            <div className="ana-card-head">
              <h2 className="ana-card-title">Rendimiento por Negocio</h2>
            </div>
            <div className="ana-table-responsive">
              <table className="ana-custom-table">
                <thead>
                  <tr>
                    <th>Negocio</th><th>Dueño</th><th>Citas</th><th>Canc.</th><th>Ventas</th><th>Emp.</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 20 }}>{n.emoji}</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>{n.nombre}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{n.tipo}</div>
                          </div>
                        </div>
                      </td>
                      <td>{n.owner}</td>
                      <td>{n.citas}</td>
                      <td style={{ color: "#ff4d4d" }}>{n.cancelaciones}</td>
                      <td><strong>${n.ventas.toLocaleString()}</strong></td>
                      <td>{n.empleados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ana-table-footer">
              <span>Mostrando {analyticsData.length} negocios activos este mes</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}