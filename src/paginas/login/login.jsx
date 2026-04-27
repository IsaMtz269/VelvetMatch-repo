import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 1. Estado para guardar lo que escribe el usuario
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorMensaje, setErrorMensaje] = useState("");

  // 2. Función para capturar los datos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Función principal para conectarse al backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página recargue
    setErrorMensaje("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ¡ÉXITO! Guardamos la información del usuario en el navegador
        localStorage.setItem("usuario", JSON.stringify(data.Usuario));
        localStorage.setItem("token", data.token);
        
        // Lo mandamos a la Pantalla Principal
        navigate("/");
      } else {
        // Mostramos el error si la contraseña o correo están mal
        setErrorMensaje(data.message || "Credenciales inválidas.");
      }
    } catch (error) {
      setErrorMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <>
      <div className="background-animation" />

      {/* Floating elements */}
      <div className="floating-elements">
        <div className="floating-element floating-element-1"><i className="fas fa-cut"></i></div>
        <div className="floating-element floating-element-2"><i className="fas fa-spa"></i></div>
        <div className="floating-element floating-element-3"><i className="fas fa-paint-brush"></i></div>
        <div className="floating-element floating-element-4"><i className="fas fa-hand-sparkles"></i></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo"><span className="logo-text">VM</span></div>
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

          {/* Formulario convertido a etiqueta <form> para funcionar con backend */}
          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* Alerta de error si el login falla */}
            {errorMensaje && <div className="alert alert-danger p-2 mb-3 small text-center rounded">{errorMensaje}</div>}

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-envelope"></i> Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="tucorreo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i> Contraseña
              </label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

            <button type="submit" className="login-button">
              <span className="button-text">Iniciar Sesión</span>
            </button>

            <div className="register-link">
              <p>¿No tienes una cuenta? <Link to="/registro" className="register-link-text">Regístrate aquí</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}