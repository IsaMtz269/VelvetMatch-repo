import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        </nav>
      </header>

      {/* Login Card */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>

          <div className="login-header">
            <h1 className="login-title">Bienvenido de vuelta</h1>
            <p className="login-subtitle">Ingresa a tu cuenta de Velvet Match</p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-envelope"></i>
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i>
                Contraseña
              </label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
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

            <button className="login-button" onClick={() => navigate("/dashboard")}>
              <span className="button-text">Iniciar Sesión</span>
            </button>

            <div className="register-link">
              <p>¿No tienes una cuenta? <Link to="/register" className="register-link-text">Regístrate aquí</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}