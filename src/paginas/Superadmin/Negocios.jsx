import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SharedLayout.css";
import "./Negocios.css";

const BASE = "http://localhost:5000/api";

// Emoji por tipo de negocio
const EMOJI_MAP = {
  "Barbería": "✂️",
  "Estética": "💆",
  "Salón de uñas": "💅",
  "Salón de belleza": "💇",
  "Maquillaje": "💄",
};

export default function Negocios() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const toggle = () => setIsSidebarActive(!isSidebarActive);
  const navigate = useNavigate();
  useEffect(() => {
    async function cargarNegocios() {
      try {
        const res = await fetch(`${BASE}/negocios`);
        if (!res.ok) throw new Error("Error al obtener negocios");
        const data = await res.json();
        setNegocios(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargarNegocios();
  }, []);

  // Tipos únicos para los chips de filtro
  const tipos = ["Todos", ...new Set(negocios.map((n) => n.tipo).filter(Boolean))];

  const negociosFiltrados = negocios.filter((n) => {
    const cumpleTipo = filtroTipo === "Todos" || n.tipo === filtroTipo;
    const cumpleBusqueda = n.nombre?.toLowerCase().includes(busqueda.toLowerCase());
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

        <div className="neg-content">
          {/* Filtros */}
          <div className="neg-filter-row">
            <span className="neg-filter-label">Tipo:</span>
            <div className="neg-filter-chips">
              {tipos.map((t) => (
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

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#8a5070" }}>Cargando negocios...</div>
            ) : error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#c04040" }}>Error: {error}</div>
            ) : (
              <>
                {/* Tabla desktop */}
                <div className="neg-table-wrapper">
                  <table className="neg-table">
                    <thead>
                      <tr>
                        <th>Negocio</th><th>Tipo</th><th>Ubicación</th><th>Celular</th><th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {negociosFiltrados.map((n) => (
                        <tr key={n._id}>
                          <td>
                            <div className="neg-biz-cell">
                              <div className="neg-biz-avatar">{EMOJI_MAP[n.tipo] || "🏪"}</div>
                              <div>
                                <div className="neg-biz-name">{n.nombre}</div>
                                <div className="neg-biz-owner">{n.eslogan || n.descripcion?.slice(0, 40) || "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="neg-badge neg-badge-type">{n.tipo || "—"}</span></td>
                          <td className="neg-biz-url">{n.ubicacion || "—"}</td>
                          <td>{n.celular || "—"}</td>
                          <td>
                            <span className={`neg-badge ${n.activo !== false ? "neg-badge-active" : "neg-badge-inactive"}`}>
                              ● {n.activo !== false ? "Activo" : "Inactivo"}
                            </span>
                          </td>
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
                    <div key={n._id} className="neg-mobile-card">
                      <div className="neg-mobile-card-header">
                        <div className="neg-biz-avatar">{EMOJI_MAP[n.tipo] || "🏪"}</div>
                        <div>
                          <div className="neg-biz-name">{n.nombre}</div>
                          <div className="neg-biz-owner">{n.eslogan || "—"}</div>
                        </div>
                      </div>
                      <div className="neg-mobile-card-details">
                        <div className="neg-detail-row"><span className="neg-detail-label">Tipo:</span> <span className="neg-badge neg-badge-type">{n.tipo}</span></div>
                        <div className="neg-detail-row"><span className="neg-detail-label">Ubicación:</span> <span>{n.ubicacion || "—"}</span></div>
                        <div className="neg-detail-row"><span className="neg-detail-label">Celular:</span> <span>{n.celular || "—"}</span></div>
                        <div className="neg-detail-row"><span className="neg-detail-label">Estado:</span>
                          <span className={`neg-badge ${n.activo !== false ? "neg-badge-active" : "neg-badge-inactive"}`}>
                            ● {n.activo !== false ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}><button className="neg-btn-sm">Ver</button></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="neg-table-footer">
              <span>Mostrando {negociosFiltrados.length} de {negocios.length} negocios</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}