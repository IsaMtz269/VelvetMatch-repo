import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registro.css";

export default function Register() {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    fechNacimiento: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMensaje, setErrorMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje("");

    if (formData.password !== formData.confirmPassword) {
      return setErrorMensaje("Las contraseñas no coinciden.");
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          fechNacimiento: formData.fechNacimiento
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
        navigate("/login"); 
      } else {
        setErrorMensaje(data.message || "Hubo un error al registrar.");
      }
    } catch (error) {
      setErrorMensaje("Error de conexión con el servidor.");
    }
  };

 return (
    <>
      <div className="background-animation" />
      <header className="header">
        <div className="logo-container">
          <div className="logo"><span className="logo-text">VM</span></div>
          <span className="brand-name">Velvet Match</span>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
        </nav>
      </header>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Crear cuenta</h1>
            <p className="login-subtitle">Únete a Velvet Match</p>
          </div>

          {/* Formulario conectado */}
          <form className="login-form" onSubmit={handleSubmit}>
            {errorMensaje && <div className="alert alert-danger p-2 small text-center rounded">{errorMensaje}</div>}

            <div className="form-group">
              <label className="form-label"><i className="fas fa-user"></i> Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fas fa-user"></i> Apellido</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fas fa-envelope"></i> Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fas fa-calendar"></i> Fecha de Nacimiento</label>
              <input type="date" name="fechNacimiento" value={formData.fechNacimiento} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fas fa-lock"></i> Contraseña</label>
              <div className="password-field">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="form-input" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fas fa-lock"></i> Confirmar Contraseña</label>
              <div className="password-field">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-input" required />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              <span className="button-text">Crear Cuenta</span>
            </button>

            <div className="register-link">
              <p>¿Ya tienes una cuenta? <Link to="/login" className="register-link-text">Inicia sesión aquí</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}