import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./PantallaPrincipal.css";
import logo from "./logo.jpeg";

export default function PantallaPrincipal() {
  useEffect(() => {
    // Smooth scroll for anchor links
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

  return (
    <>
      <div className="background-animation" />

      {/* ── Header ── */}
      <header className="header">
        <div className="logo-container">
          <div className="logo">
            {<img src={logo} alt="Velvet Match" style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%"}} />}
          </div>
          <span className="brand-name">Velvet Match</span>
        </div>
        <nav className="nav">
          <a href="#about" className="nav-link">Nosotros</a>
          {/* Link de React Router — no recarga la página */}
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Sector Belleza · Sin código · En minutos</div>
          <h1 className="hero-title">
            Tu negocio de belleza,{" "}
            <span className="gradient-text">en línea en minutos</span>
          </h1>
          <p className="hero-description">
            Digitaliza tu barbería, estética, salón de uñas o maquillaje sin
            conocimientos técnicos. Crea tu sitio web, gestiona citas y
            administra tu equipo, todo desde un solo lugar.
          </p>
          <Link to="/agregar-empresa" className="cta-button">
            <span className="button-content">Crea tu web</span>
            <div className="button-glow" />
          </Link>
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
                Crea tu sitio web profesional, gestiona citas, empleados y
                servicios. Todo en una plataforma centralizada sin complicaciones
                técnicas.
              </p>
              <p className="about-description">
                En Velvet Match, nacimos con la misión de hacer accesible la
                presencia digital para barberías, estéticas, salones de uñas y
                maquillaje. Permitiendo que emprendedores sin conocimientos
                técnicos puedan crear y gestionar su sitio web profesional en
                minutos, no en meses.
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

      {/* ── Values ── */}
      <section className="values">
        <div className="container">
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

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para llevar tu negocio al siguiente nivel?</h2>
          <p>Crea el sitio web de tu negocio hoy — rápido, sencillo y sin conocimientos técnicos</p>
          <Link to="/agregar-empresa" className="cta-button">
            <span className="button-content">Crea tu web</span>
            <div className="button-glow" />
          </Link>
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
                <a href="#services">Servicios</a>
                <a href="#team">Equipo</a>
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