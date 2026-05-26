import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PantallaPrincipal.css";

const API = "http://localhost:5000/api";

const categorias = [
  { label: "Todos", emoji: "✨" },
  { label: "Barbería", emoji: "✂️" },
  { label: "Uñas", emoji: "💅" },
  { label: "Maquillaje", emoji: "💄" },
  { label: "Estética", emoji: "🌿" },
];

export default function PantallaPrincipal() {
  const navigate = useNavigate();

  // --- ESTADOS DE DATOS REALES ---
  const [negocios, setNegocios] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // --- ESTADOS DE FILTROS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Todos");

  useEffect(() => {
   const u = localStorage.getItem("usuario");
    if (u) {
      setUsuarioActivo(JSON.parse(u));
    }

    const fetchNegocios = async () => {
      try {
        const res = await fetch(`${API}/negocios`);
        if (res.ok) {
          const data = await res.json();
          setNegocios(data);
        }
      } catch (error) {
        console.error("Error al obtener negocios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNegocios();

    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));
    return () => anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuarioActivo(null);
    navigate("/");
  };

  const handleDashboardRedirect = () => {
  if (!usuarioActivo) return;

  const rol = usuarioActivo.roles || usuarioActivo.rol_usuario;

  if (rol === "admin" || rol === "superadmin") {

    if (usuarioActivo.id_negocio) {
      navigate(`/empresa/${usuarioActivo.id_negocio}`);
    } else {
      navigate("/dashboard");
    }

    return;
  }

  if (rol === "empleado") {
    navigate(`/empresa/${usuarioActivo.id_negocio}`);
    return;
  }

  navigate("/cliente-dashboard");
};

  const negociosFiltrados = negocios.filter((negocio) => {
    const cumpleBusqueda = negocio.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           negocio.ubicacion?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const cumpleCategoria = selectedCategoria === "Todos" || 
                            negocio.tipo?.toLowerCase() === selectedCategoria.toLowerCase();

    return cumpleBusqueda && cumpleCategoria;
  });

  const obtenerEmojiCategoria = (tipo) => {
    const cat = categorias.find(c => c.label.toLowerCase() === tipo?.toLowerCase());
    return cat ? cat.emoji : "✨";
  };

  const iniciales = usuarioActivo 
    ? `${usuarioActivo.nombre.charAt(0)}${usuarioActivo.apellido.charAt(0)}`.toUpperCase() 
    : "";



  return (
    <>
     <div className="background-animation" />

      {/* ── Header ── */}
      <header className="header">
        <div className="logo-container">
          <div className="logo"><span className="logo-text">VM</span></div>
          <span className="brand-name">Velvet Match</span>
        </div>
        <nav className="nav d-flex align-items-center">
          <a href="#negocios" className="nav-link">Explorar</a>
          <a href="#about" className="nav-link">Nosotros</a>
          
            {usuarioActivo ? (
            <div className="d-flex align-items-center ms-3 gap-3">
              
              <button
              onClick={handleDashboardRedirect}
              className="btn btn-sm text-white rounded-pill px-3 fw-bold"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-soft)',
                border: 'none'
              }}
            >
              ✨ Mi Dashboard
            </button>

              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '35px', height: '35px', fontSize: '14px' }}>
                  {iniciales}
                </div>
                <span className="text-dark fw-bold text-capitalize">{usuarioActivo.nombre}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-sm btn-outline-danger rounded-pill px-3">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-btn">Iniciar Sesión</Link>
          )}
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Sector Belleza · Sin código · En minutos</div>
          <h1 className="hero-title">
            Tu plataforma de belleza,{" "}
            <span className="gradient-text">para clientes y negocios</span>
          </h1>
          <p className="hero-description">
            Encuentra estilistas, barberías y salones cerca de ti o digitaliza
            tu negocio de belleza en minutos, sin conocimientos técnicos.
          </p>

          {/* Barra de búsqueda */}
          <div className="search-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
              type="text"
              className="search-input"
              placeholder="Busca barberías, salones, estéticas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
            <button className="search-button">Buscar</button>
          </div>

          {/* Dos CTAs */}
          <div className="hero-ctas">
            <a href="#negocios" className="cta-button">
              <span className="button-content">Explorar servicios</span>
              <div className="button-glow" />
            </a>
            <Link to="/agregar-empresa" className="cta-button cta-button--outline">
              <span className="button-content">Registra tu negocio</span>
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">✨</div>
            <h3>Sitio Web Listo</h3>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📅</div>
            <h3>Citas Automatizadas</h3>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">💎</div>
            <h3>Gestión de Equipo</h3>
          </div>
        </div>
      </section>

      {/* ── Explorar Negocios ── */}
      <section id="negocios" className="negocios-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Para Clientes</span>
            <h2 className="section-title">Encuentra tu servicio ideal</h2>
          </div>

          {/* Filtros por categoría */}
          <div className="categorias-filter">
            {categorias.map((cat) => (
             <button
              key={cat.label}
              className={`categoria-chip ${
                selectedCategoria === cat.label ? "active" : ""
              }`}
              onClick={() => setSelectedCategoria(cat.label)}
            >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de negocios */}
          <div className="negocios-grid">
           {negociosFiltrados.map((negocio) => (
              <div key={negocio.id} className="negocio-card">
                <div className="negocio-card__image">
                  <span className="negocio-card__emoji">
                    {obtenerEmojiCategoria(negocio.tipo)}
                  </span>
                 <span className="negocio-card__categoria">
                {negocio.tipo}
              </span>
                </div>
                <div className="negocio-card__body">
                  <h3 className="negocio-card__nombre">{negocio.nombre}</h3>
                  <div className="negocio-card__rating">
                    <span className="rating-star">★</span>
                    <span className="rating-score">{negocio.rating}</span>
                    <span className="rating-count">
                      ({negocio.reseñas} reseñas)
                    </span>
                  </div>
                  <p className="negocio-card__ubicacion">📍 {negocio.ubicacion}</p>
                  <button
                    className="negocio-card__btn"
                    onClick={() => navigate(`/empresa/${negocio._id}`)}
                  >
                    Ver negocio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Sobre Nosotros</span>
            <h2 className="section-title">¿Qué es Velvet Match?</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-intro">
                Crea tu sitio web profesional, gestiona citas, empleados y servicios.
                Todo en una plataforma centralizada sin complicaciones técnicas.
              </p>
              <p className="about-description">
                En Velvet Match, nacimos con la misión de hacer accesible la presencia
                digital para barberías, estéticas, salones de uñas y maquillaje.
                Permitiendo que emprendedores sin conocimientos técnicos puedan crear
                y gestionar su sitio web profesional en minutos, no en meses.
              </p>
            </div>
            <div className="about-grid">
              <div className="about-card">
                <div className="about-icon">🎯</div>
                <h3>Nuestra Misión</h3>
                <p>Crear experiencias digitales que conecten marcas con audiencias de manera auténtica y memorable</p>
              </div>
              <div className="about-card">
                <div className="about-icon">👥</div>
                <h3>Nuestro Equipo</h3>
                <p>Diseñadores, desarrolladores y estrategas unidos por la pasión de crear soluciones digitales excepcionales</p>
              </div>
              <div className="about-card">
                <div className="about-icon">💡</div>
                <h3>Nuestra Visión</h3>
                <p>Ser el aliado digital preferido para quienes buscan destacar en el mundo online con elegancia y autenticidad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Para Negocios ── */}
      <section className="values">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Para Negocios</span>
          </div>
          <h2 className="section-title centered">Todo lo que necesitas en un solo lugar</h2>
          <div className="values-grid">
            {[
              { num: "01", title: "Sitio Web Personalizado", desc: "Tu negocio obtiene un sitio web con tu nombre, colores, servicios y equipo. Listo en menos de 5 pasos, sin escribir código." },
              { num: "02", title: "Citas con Control Total", desc: "Calendario interactivo con reglas automáticas: 48h para agendar y 6h para cancelar, eliminando ausencias y conflictos de horario." },
              { num: "03", title: "Roles y Permisos", desc: "Sistema jerárquico con roles de Super Admin, Admin, Empleado y Cliente para que cada quien acceda solo a lo que le corresponde." },
              { num: "04", title: "Analytics en Tiempo Real", desc: "Visualiza el rendimiento de tu negocio: nuevos registros, volumen de citas, servicios más solicitados y más desde tu panel de control." },
            ].map((v) => (
              <div className="value-item" key={v.num}>
                <div className="value-number">{v.num}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para empezar?</h2>
          <p>Encuentra tu servicio ideal o lleva tu negocio al siguiente nivel</p>
          <div className="cta-buttons">
            <a href="#negocios" className="cta-button">
              <span className="button-content">Soy cliente</span>
              <div className="button-glow" />
            </a>
            <Link to="/agregar-empresa" className="cta-button cta-button--white">
              <span className="button-content">Tengo un negocio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-text">VM</span>
              </div>
              <p>Velvet Match © 2026</p>
              <p className="footer-tagline">Digitalizando el sector belleza, un negocio a la vez</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Compañía</h4>
                <a href="#about">Sobre nosotros</a>
                <a href="#negocios">Explorar</a>
              </div>
              <div className="footer-column">
                <h4>Contacto</h4>
                <a href="mailto:email@velvetmatch.com">email@velvetmatch.com</a>
                <a href="tel:+521234567890">+52 (123) 456-7890</a>
              </div>
              <div className="footer-column">
                <h4>Síguenos</h4>
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}