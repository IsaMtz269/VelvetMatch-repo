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
  const [bannerBase64, setBannerBase64] = useState("");
  const bannerRef = useRef();

  // Step 3 — admin
  const [admin, setAdmin] = useState({
    nombre: "", apellido: "", email: "", password: "", fechaNacimiento: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Step 4 — colores y anticipo
  const [colors, setColors] = useState({ primary: "#7F055F", secondary: "#E5A4CB" });
  const [anticipo, setAnticipo] = useState(0); // <-- Nuevo estado para el anticipo

  const progress = (step / TOTAL) * 100;

  // --- FUNCIONES DE VALIDACIÓN ---
  
  // Función para calcular si es mayor de 16 años
  const esMayorDe16 = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad >= 16;
  };

  // Autocompletar el "@" en Instagram cuando el usuario sale del input (onBlur)
  const handleInstagramBlur = () => {
    if (info.instagram && !info.instagram.startsWith('@')) {
      setInfo({ ...info, instagram: '@' + info.instagram });
    }
  };

const handleBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert("¡Cuidado! El archivo seleccionado no es válido. Por favor, sube únicamente imágenes JPG, PNG o WEBP.");
      e.target.value = null; 
      return;
    }

    const maxSize = 2 * 1024 * 1024; 
    if (file.size > maxSize) {
      alert("La imagen es muy pesada. Por favor, elige una que pese menos de 2MB.");
      e.target.value = null;
      return;
    }

    // 1. Mostrar la vista previa rápidamente
    setBannerPreview(URL.createObjectURL(file));

    // 2. Convertir la imagen a texto (Base64) para enviarla a la base de datos
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBannerBase64(reader.result); // Guardamos el texto larguísimo en el estado
    };
  };

  const handleSubmit = async () => {
    try {
      // 1. Registrar al Administrador
      const resAdmin = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: admin.nombre,
          apellido: admin.apellido,
          email: admin.email,
          password: admin.password,
          fechNacimiento: admin.fechaNacimiento,
          roles: 'admin' 
        })
      });
      const dataAdmin = await resAdmin.json();

      if (!resAdmin.ok) throw new Error(dataAdmin.message);

      // 2. Registrar el Negocio vinculado a ese Administrador
      const resNegocio = await fetch('http://localhost:5000/api/negocios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: info.nombre,
          tipo: businessType,
          descripcion: info.descripcion,
          celular: info.telefono,
          ubicacion: info.ciudad,
          instagram: info.instagram,
          facebook: info.facebook,
          primaryColor: colors.primary,
          secondaryColor: colors.secondary,
          anticipo: Number(anticipo), // <-- Enviamos el anticipo numérico
          id_usuario: dataAdmin.usuario._id,
          banner: bannerBase64
        })
      });
      const dataNegocio = await resNegocio.json();

      if (!resNegocio.ok) throw new Error(dataNegocio.message);

      // 3. Redirigir a la pantalla principal con un mensaje de éxito
      navigate('/', { state: { successMessage: '¡Tu negocio y cuenta de administrador fueron creados con éxito!' } });

    } catch (error) {
      alert(`Error al registrar: ${error.message}`);
    }
  };

  // Validaciones para habilitar el botón "Continuar"
  const canContinueStep2 = info.nombre.trim() && info.telefono.length === 10 && info.ciudad.trim();
  const canContinueStep3 = admin.nombre.trim() && admin.apellido.trim() && admin.email.trim() && admin.password.length >= 8 && esMayorDe16(admin.fechaNacimiento);

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

            <div className="ae-form-group">
              <label>Nombre del negocio <span className="ae-required">*</span></label>
              <input
                className="vm-input"
                placeholder="Ej. Studio Velvet"
                value={info.nombre}
                onChange={(e) => setInfo({ ...info, nombre: e.target.value })}
              />
            </div>

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

            <div className="ae-grid-2">
              <div className="ae-form-group">
                <label>Teléfono / WhatsApp <span className="ae-required">*</span></label>
                <input
                  className="vm-input"
                  type="text"
                  placeholder="10 dígitos"
                  value={info.telefono}
                  onChange={(e) => {
                    // Validar que solo se ingresen números y máximo 10
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setInfo({ ...info, telefono: onlyNums });
                  }}
                />
                {info.telefono.length > 0 && info.telefono.length < 10 && (
                  <p className="ae-error-text">Debe contener exactamente 10 números.</p>
                )}
              </div>
              <div className="ae-form-group">
                <label>Ciudad <span className="ae-required">*</span></label>
                <input
                  className="vm-input"
                  placeholder="Monterrey"
                  value={info.ciudad}
                  onChange={(e) => {
                    // Validar que solo se ingresen letras y espacios
                    const onlyLetters = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setInfo({ ...info, ciudad: onlyLetters });
                  }}
                />
              </div>
            </div>

            <div className="ae-grid-2">
              <div className="ae-form-group">
                <label><i className="fab fa-instagram ae-social-icon"></i> Instagram <span className="ae-optional">Opcional</span></label>
                <input
                  className="vm-input"
                  placeholder="@minegocio"
                  value={info.instagram}
                  onChange={(e) => {
                    const sinEspacios = e.target.value.replace(/\s/g, '');
                    setInfo({ ...info, instagram: sinEspacios });
                  }}
                  onBlur={handleInstagramBlur} 
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
                <input 
                  className="vm-input" 
                  placeholder="Juan" 
                  value={admin.nombre} 
                  onChange={(e) => {
                    // Validar solo letras
                    const onlyLetters = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setAdmin({ ...admin, nombre: onlyLetters });
                  }} 
                />
              </div>
              <div className="ae-form-group">
                <label>Apellido <span className="ae-required">*</span></label>
                <input 
                  className="vm-input" 
                  placeholder="Pérez" 
                  value={admin.apellido} 
                  onChange={(e) => {
                    // Validar solo letras
                    const onlyLetters = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setAdmin({ ...admin, apellido: onlyLetters });
                  }} 
                />
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
              {admin.fechaNacimiento && !esMayorDe16(admin.fechaNacimiento) && (
                <p className="ae-error-text">Debes ser mayor de 16 años para registrar un negocio.</p>
              )}
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

        {/* ── STEP 4 — Colores + Anticipo + Confirmar ── */}
        {step === 4 && (
          <div className="step-container ae-card">
            <div className="ae-card-header">
              <h2>Configuración Adicional</h2>
              <p className="ae-subtitle">Personaliza tu página y los pagos de tus clientes</p>
            </div>

            <div className="ae-grid-2 mb-4">
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

            {/* SECCIÓN DEL ANTICIPO */}
            <div className="ae-form-group" style={{ padding: '1rem', background: 'var(--velvet-cream)', borderRadius: '0.75rem', border: '1px solid var(--velvet-blush)' }}>
              <label><i className="fas fa-percentage" style={{ color: 'var(--velvet-plum)', marginRight: '8px' }}></i>Anticipo de citas (%) <span className="ae-optional">Opcional</span></label>
              <p style={{ fontSize: '0.85rem', color: 'var(--velvet-dark)', opacity: 0.8, marginBottom: '0.8rem', lineHeight: '1.4' }}>
                El anticipo es el porcentaje del costo total que tus clientes deberán pagar en línea al momento de agendar para asegurar su lugar. Déjalo en 0 si no deseas cobrar anticipo.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', maxWidth: '150px' }}>
                <input
                  className="vm-input"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ej. 15"
                  value={anticipo}
                  onChange={(e) => setAnticipo(e.target.value)}
                />
                <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'var(--velvet-dark)' }}>%</span>
              </div>
            </div>

            <div
              className="ae-color-preview"
              style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
            >
              <h4>Vista previa de tus colores</h4>
              <p>Así se verán los botones y detalles en tu página</p>
            </div>

            {/* Resumen */}
            <div className="ae-summary">
              <h3>Resumen Final</h3>
              <div className="ae-summary-row"><span>Tipo</span><strong>{businessType}</strong></div>
              <div className="ae-summary-row"><span>Negocio</span><strong>{info.nombre}</strong></div>
              <div className="ae-summary-row"><span>Anticipo a cobrar</span><strong>{anticipo}%</strong></div>
              <div className="ae-summary-row"><span>Admin</span><strong>{admin.nombre} {admin.apellido}</strong></div>
            </div>

            <div className="ae-btn-row">
              <button className="vm-btn-outline" onClick={() => setStep(3)}>
                <i className="fas fa-arrow-left"></i> Atrás
              </button>
              <button className="vm-btn-primary" onClick={handleSubmit}>
                ✨ Crear negocio
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}