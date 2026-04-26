import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AgregarEmpresa.css";

const BUSINESS_TYPES = [
  { label: "Barbería",         icon: "fas fa-cut" },
  { label: "Estética",         icon: "fas fa-spa" },
  { label: "Salón de belleza", icon: "fas fa-paint-brush" },
  { label: "Salón de uñas",    icon: "fas fa-hand-sparkles" },
];

export default function AgregarEmpresa() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const TOTAL = 4;

  // Step 1
  const [businessType, setBusinessType] = useState("");

  // Step 2 — info básica
  const [info, setInfo] = useState({
    nombre: "", descripcion: "", telefono: "", ciudad: "",
    instagram: "", facebook: "",
  });
  const [bannerPreview, setBannerPreview] = useState("");
  const bannerRef = useRef();

  // Step 3 — admin
  const [admin, setAdmin] = useState({
    nombre: "", apellido: "", email: "", password: "", fechaNacimiento: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Step 4 — colores
  const [colors, setColors] = useState({ primary: "#7F055F", secondary: "#E5A4CB" });

  const progress = (step / TOTAL) * 100;

  const handleBanner = (e) => {
    const file = e.target.files[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const canContinueStep2 = info.nombre.trim() && info.telefono.trim() && info.ciudad.trim();
  const canContinueStep3 = admin.nombre.trim() && admin.apellido.trim() && admin.email.trim() && admin.password.length >= 8 && admin.fechaNacimiento;

  return (
    <div className="ae-wrapper">

      {/* ── Header / Progress ── */}
      <div className="ae-header">
        <div className="ae-header__inner">
          <Link to="/" className="ae-header__brand">
            <div className="ae-logo"><span>VM</span></div>
            <span className="ae-brand-name">Velvet Match</span>
          </Link>
          <span className="ae-step-text">Paso {step} de {TOTAL}</span>
        </div>
        <div className="ae-progress-track">
          <div className="ae-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="ae-content">

        {/* ── STEP 1 — Tipo de negocio ── */}
        {step === 1 && (
          <div className="step-container">
            <div className="ae-step-header">
              <h1>¿Qué tipo de negocio quieres crear?</h1>
              <p>Selecciona el tipo para comenzar</p>
            </div>
            <div className="ae-business-grid">
              {BUSINESS_TYPES.map((bt) => (
                <button
                  key={bt.label}
                  className="business-type-btn"
                  onClick={() => { setBusinessType(bt.label); setStep(2); }}
                >
                  <i className={`${bt.icon} ae-business-icon`}></i>
                  <h3>{bt.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2 — Info del negocio ── */}
        {step === 2 && (
          <div className="step-container ae-card">
            <div className="ae-card-header">
              <h2>Información de tu negocio</h2>
              <p className="ae-subtitle">Datos básicos de tu <strong>{businessType}</strong></p>
            </div>

            {/* Banner */}
            <div className="ae-form-group">
              <label>Imagen de portada <span className="ae-optional">Opcional</span></label>
              <div
                className={`banner-dropzone${bannerPreview ? " has-image" : ""}`}
                onClick={() => bannerRef.current.click()}
              >
                {bannerPreview
                  ? <img src={bannerPreview} alt="Banner" className="banner-img" />
                  : <div className="banner-placeholder">
                      <i className="fas fa-image" style={{ fontSize: "2.2rem", color: "var(--velvet-pink)" }}></i>
                      <p>Subir imagen de portada</p>
                      <span>JPG, PNG o WEBP · Recomendado 1200×400 px</span>
                    </div>
                }
              </div>
              <input type="file" ref={bannerRef} accept="image/*" style={{ display: "none" }} onChange={handleBanner} />
              {bannerPreview && (
                <button className="ae-remove-banner" onClick={() => setBannerPreview("")}>
                  <i className="fas fa-times"></i> Quitar imagen
                </button>
              )}
            </div>

            {/* Nombre */}
            <div className="ae-form-group">
              <label>Nombre del negocio <span className="ae-required">*</span></label>
              <input
                className="vm-input"
                placeholder="Ej. Studio Velvet"
                value={info.nombre}
                onChange={(e) => setInfo({ ...info, nombre: e.target.value })}
              />
            </div>

            {/* Descripción */}
            <div className="ae-form-group">
              <label>Descripción <span className="ae-optional">Opcional</span></label>
              <textarea
                className="vm-input"
                rows="3"
                placeholder="Cuéntale a tus clientes de qué trata tu negocio..."
                value={info.descripcion}
                onChange={(e) => setInfo({ ...info, descripcion: e.target.value })}
              />
            </div>

            {/* Teléfono + Ciudad */}
            <div className="ae-grid-2">
              <div className="ae-form-group">
                <label>Teléfono / WhatsApp <span className="ae-required">*</span></label>
                <input
                  className="vm-input"
                  type="tel"
                  placeholder="+52 81 1234 5678"
                  value={info.telefono}
                  onChange={(e) => setInfo({ ...info, telefono: e.target.value })}
                />
              </div>
              <div className="ae-form-group">
                <label>Ciudad <span className="ae-required">*</span></label>
                <input
                  className="vm-input"
                  placeholder="Monterrey"
                  value={info.ciudad}
                  onChange={(e) => setInfo({ ...info, ciudad: e.target.value })}
                />
              </div>
            </div>

            {/* Redes sociales */}
            <div className="ae-grid-2">
              <div className="ae-form-group">
                <label><i className="fab fa-instagram ae-social-icon"></i> Instagram <span className="ae-optional">Opcional</span></label>
                <input
                  className="vm-input"
                  placeholder="@minegocio"
                  value={info.instagram}
                  onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                />
              </div>
              <div className="ae-form-group">
                <label><i className="fab fa-facebook ae-social-icon"></i> Facebook <span className="ae-optional">Opcional</span></label>
                <input
                  className="vm-input"
                  placeholder="facebook.com/minegocio"
                  value={info.facebook}
                  onChange={(e) => setInfo({ ...info, facebook: e.target.value })}
                />
              </div>
            </div>

            <div className="ae-btn-row">
              <button className="vm-btn-outline" onClick={() => setStep(1)}>
                <i className="fas fa-arrow-left"></i> Atrás
              </button>
              <button
                className="vm-btn-primary"
                onClick={() => setStep(3)}
                disabled={!canContinueStep2}
              >
                Continuar <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Registro Admin ── */}
        {step === 3 && (
          <div className="step-container ae-card">
            <div className="ae-card-header">
              <h2>Datos del administrador</h2>
              <p className="ae-subtitle">Tus datos como dueño/a del negocio</p>
            </div>

            <div className="ae-grid-2">
              <div className="ae-form-group">
                <label>Nombre <span className="ae-required">*</span></label>
                <input className="vm-input" placeholder="Juan" value={admin.nombre} onChange={(e) => setAdmin({ ...admin, nombre: e.target.value })} />
              </div>
              <div className="ae-form-group">
                <label>Apellido <span className="ae-required">*</span></label>
                <input className="vm-input" placeholder="Pérez" value={admin.apellido} onChange={(e) => setAdmin({ ...admin, apellido: e.target.value })} />
              </div>
            </div>

            <div className="ae-form-group">
              <label>Correo electrónico <span className="ae-required">*</span></label>
              <input className="vm-input" type="email" placeholder="admin@minegocio.com" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} />
            </div>

            <div className="ae-form-group">
              <label>Contraseña <span className="ae-required">*</span></label>
              <div className="ae-password-field">
                <input
                  className="vm-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={admin.password}
                  onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                />
                <button className="ae-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {admin.password && admin.password.length < 8 && (
                <p className="ae-error-text">Mínimo 8 caracteres</p>
              )}
            </div>

            <div className="ae-form-group">
              <label>Fecha de nacimiento <span className="ae-required">*</span></label>
              <input className="vm-input" type="date" value={admin.fechaNacimiento} onChange={(e) => setAdmin({ ...admin, fechaNacimiento: e.target.value })} />
            </div>

            <div className="ae-btn-row">
              <button className="vm-btn-outline" onClick={() => setStep(2)}>
                <i className="fas fa-arrow-left"></i> Atrás
              </button>
              <button
                className="vm-btn-primary"
                onClick={() => setStep(4)}
                disabled={!canContinueStep3}
              >
                Continuar <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Colores + Confirmar ── */}
        {step === 4 && (
          <div className="step-container ae-card">
            <div className="ae-card-header">
              <h2>Personalización</h2>
              <p className="ae-subtitle">Elige los colores de tu página</p>
            </div>

            <div className="ae-grid-2">
              <div className="ae-form-group">
                <label>Color principal</label>
                <div className="ae-color-row">
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    className="ae-color-input"
                  />
                  <input type="text" className="vm-input" value={colors.primary} readOnly />
                </div>
              </div>
              <div className="ae-form-group">
                <label>Color secundario</label>
                <div className="ae-color-row">
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    className="ae-color-input"
                  />
                  <input type="text" className="vm-input" value={colors.secondary} readOnly />
                </div>
              </div>
            </div>

            <div
              className="ae-color-preview"
              style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              <h4>Vista previa</h4>
              <p>Así se verán los colores en tu página</p>
            </div>

            {/* Resumen */}
            <div className="ae-summary">
              <h3>Resumen</h3>
              <div className="ae-summary-row"><span>Tipo</span><strong>{businessType}</strong></div>
              <div className="ae-summary-row"><span>Negocio</span><strong>{info.nombre}</strong></div>
              <div className="ae-summary-row"><span>Ciudad</span><strong>{info.ciudad}</strong></div>
              <div className="ae-summary-row"><span>Admin</span><strong>{admin.nombre} {admin.apellido}</strong></div>
            </div>

            <div className="ae-btn-row">
              <button className="vm-btn-outline" onClick={() => setStep(3)}>
                <i className="fas fa-arrow-left"></i> Atrás
              </button>
              <button className="vm-btn-primary" onClick={() => setStep(5)}>
                ✨ Crear negocio
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5 — Éxito ── */}
        {step === 5 && (
          <div className="step-container ae-card ae-success">
            <div style={{ fontSize: "4rem" }}>🎉</div>
            <h2>¡Negocio creado!</h2>
            <p className="ae-subtitle">Tu negocio ha sido configurado exitosamente. Ahora puedes agregar servicios y empleados desde tu dashboard.</p>
            <div className="ae-summary" style={{ width: "100%" }}>
              <div className="ae-summary-row"><span>Tipo</span><strong>{businessType}</strong></div>
              <div className="ae-summary-row"><span>Negocio</span><strong>{info.nombre}</strong></div>
              <div className="ae-summary-row"><span>Ciudad</span><strong>{info.ciudad}</strong></div>
              <div className="ae-summary-row"><span>Admin</span><strong>{admin.nombre} {admin.apellido}</strong></div>
            </div>
            <div className="ae-btn-row" style={{ justifyContent: "center" }}>
              <Link to="/dashboard" className="vm-btn-primary" style={{ textDecoration: "none" }}>
                Ir al Dashboard <i className="fas fa-arrow-right"></i>
              </Link>
              <button className="vm-btn-outline" onClick={() => { setStep(1); setBusinessType(""); setInfo({ nombre: "", descripcion: "", telefono: "", ciudad: "", instagram: "", facebook: "" }); setAdmin({ nombre: "", apellido: "", email: "", password: "", fechaNacimiento: "" }); setColors({ primary: "#7F055F", secondary: "#E5A4CB" }); setBannerPreview(""); }}>
                Crear otro
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}