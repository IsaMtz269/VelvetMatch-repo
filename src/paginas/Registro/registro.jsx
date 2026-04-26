import { useState } from "react";
import { Link } from "react-router-dom";
import "./registro.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="background-animation" />

      {/* Floating elements */}
      <div className="floating-elements">
        <div className="floating-element floating-element-1">
          <i className="fas fa-cut"></i>
        </div>
        <div className="floating-element floating-element-2">
          <i className="fas fa-spa"></i>
        </div>
        <div className="floating-element floating-element-3">
          <i className="fas fa-paint-brush"></i>
        </div>
        <div className="floating-element floating-element-4">
          <i className="fas fa-hand-sparkles"></i>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">VM</span>
          </div>
          <span className="brand-name">Velvet Match</span>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
        </nav>
      </header>

      {/* Register Card */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>

          <div className="login-header">
            <h1 className="login-title">Crear cuenta</h1>
            <p className="login-subtitle">Únete a Velvet Match</p>
          </div>

          <div className="login-form">
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-user"></i>
                Nombre
              </label>
              <input type="text" className="form-input" placeholder="Tu nombre" />
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-user"></i>
                Apellido
              </label>
              <input type="text" className="form-input" placeholder="Tu apellido" />
            </div>

            {/* Correo */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-envelope"></i>
                Correo Electrónico
              </label>
              <input type="email" className="form-input" placeholder="tucorreo@ejemplo.com" />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-calendar"></i>
                Fecha de Nacimiento
              </label>
              <input type="date" className="form-input" />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i>
                Contraseña
              </label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i>
                Confirmar Contraseña
              </label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button className="login-button">
              <span className="button-text">Crear Cuenta</span>
              <div className="button-glow"></div>
            </button>

            <div className="register-link">
              <p>¿Ya tienes una cuenta? <Link to="/login" className="register-link-text">Inicia sesión aquí</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}