import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Empresa.css';

export default function EmpresaLanding() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- ESTADOS DE DATOS ---
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ESTADOS DE SLIDERS ---
  const [serviceIndex, setServiceIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);

  // --- ESTADOS DEL MODAL DE RESERVA ---
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const horasDisponibles = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  // --- 👇 NUEVOS ESTADOS DE LOGIN ---
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const getContrastColor = (hexcolor) => {
    if (!hexcolor) return '#ffffff';
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#2a0020' : '#ffffff'; 
  };

  useEffect(() => {
  if (bookingDate && negocio) {
    const fetchHorasOcupadas = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/citas/ocupadas?id_negocio=${negocio._id}&fecha=${bookingDate}`);
        if (res.ok) {
          const data = await res.json();
          // Se espera que el backend retorne un array de strings, ej: ["10:00", "14:00"]
          setHorasOcupadas(data.horasOcupadas || data);
        }
      } catch (err) {
        console.error("Error al obtener horas ocupadas:", err);
      }
    };
    fetchHorasOcupadas();
  }
}, [bookingDate, negocio]);

const generarDiasCalendario = () => {
  const hoy = new Date();
  const añoActual = hoy.getFullYear();
  const mesActual = hoy.getMonth();

  // Primer día del mes y total de días
  const primerDiaIndex = new Date(añoActual, mesActual, 1).getDay(); // 0: Dom, 1: Lun...
  const totalDias = new Date(añoActual, mesActual + 1, 0).getDate();

  const dias = [];
  
  // Rellenar espacios vacíos antes del primer día del mes
  for (let i = 0; i < primerDiaIndex; i++) {
    dias.push({ numero: "", fechaString: "", disabled: true });
  }

  // Generar los días reales del mes
  for (let dia = 1; dia <= totalDias; dia++) {
    const fechaObj = new Date(añoActual, mesActual, dia);
    const fechaString = fechaObj.toISOString().split('T')[0];

    // Validación de regla de negocio: mínimo 48 horas de anticipación
    const diffHours = (fechaObj - hoy) / (1000 * 60 * 60);
    const esPasadoODisabled = diffHours < 48;

    dias.push({
      numero: dia,
      fechaString: fechaString,
      disabled: esPasadoODisabled
    });
  }

  return dias;
};

  useEffect(() => {
    const userStr = localStorage.getItem('usuario');
    if (userStr) setUsuarioActivo(JSON.parse(userStr));

    const fetchAllData = async () => {
      try {
        const resNegocio = await fetch(`http://localhost:5000/api/negocios/${id}`);
        if (!resNegocio.ok) throw new Error('No se encontró el negocio');
        const dataNegocio = await resNegocio.json();
        setNegocio(dataNegocio);

        const resServicios = await fetch(`http://localhost:5000/api/servicios/negocio/${id}`);
        if (resServicios.ok) setServicios(await resServicios.json());

        const resPosts = await fetch(`http://localhost:5000/api/posts/negocio/${id}`);
        if (resPosts.ok) setPosts(await resPosts.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAllData();
  }, [id]);

  const nextServices = () => { if (serviceIndex < servicios.length - 3) setServiceIndex(prev => prev + 1); };
  const prevServices = () => { if (serviceIndex > 0) setServiceIndex(prev => prev - 1); };
  const nextPosts = () => { if (postIndex < posts.length - 4) setPostIndex(prev => prev + 1); };
  const prevPosts = () => { if (postIndex > 0) setPostIndex(prev => prev - 1); };

  // --- 👇 LÓGICA DE INICIO DE SESIÓN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); setLoginSuccess("");
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

      // Guardamos la sesión exitosa
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.Usuario));
      setUsuarioActivo(data.Usuario);
      setLoginSuccess("¡Inicio de sesión exitoso!");

      setTimeout(() => {
        setLoginSuccess("");
        const modalEl = document.getElementById('loginModal');
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        setLoginData({ email: '', password: '' }); // Limpiamos el form
      }, 1000);

    } catch (err) {
      setLoginError(err.message);
    }
  };

  // --- 👇 LÓGICA DEL BOTÓN "MI PANEL" ---
  const irAlPanel = () => {
    // 1. Verificamos si es un empleado o admin intentando entrar al panel
    if (usuarioActivo.roles === 'admin' || usuarioActivo.roles === 'superadmin' || usuarioActivo.roles === 'empleado') {
      
      // 2. Comprobamos que pertenezca a ESTE negocio específicamente
      if (usuarioActivo.id_negocio !== negocio._id) {
        alert("Acceso denegado: Tu cuenta de empleado/administrador pertenece a otro establecimiento.");
        return;
      }

      // 3. Lo mandamos a su panel correspondiente
      if (usuarioActivo.roles === 'empleado') {
        navigate('/empleado');
      } else {
        navigate('/admin');
      }
    }
  };

  // --- LÓGICA DE AGENDAMIENTO ---
  const handleOpenBooking = (servicio) => {
    if (!usuarioActivo) {
      const loginModal = new window.bootstrap.Modal(document.getElementById('loginModal'));
      loginModal.show();
      return;
    }
    setSelectedService(servicio);
    setCurrentStep(1); setBookingDate(""); setBookingTime(""); setBookingError("");
    const bookingModal = new window.bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
  };

  const handleNextToStep3 = () => {
    setBookingError("");
    if (!bookingDate || !bookingTime) return setBookingError("Por favor, selecciona una fecha y una hora.");
    const fechaHoraCita = new Date(`${bookingDate}T${bookingTime}:00`);
    const diffHours = (fechaHoraCita - new Date()) / (1000 * 60 * 60);
    if (diffHours < 48) return setBookingError("Las citas deben agendarse con al menos 48 horas de anticipación.");
    setCurrentStep(3);
  };

  const submitBooking = async () => {
    setBookingError("");
    try {
      const anticipoMonto = selectedService.precio * (negocio.anticipo / 100);
      const res = await fetch('http://localhost:5000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: usuarioActivo.id, id_negocio: negocio._id, id_servicio: selectedService._id,
          fecha: bookingDate, hora: bookingTime, precio_final: selectedService.precio, anticipo_pagado: anticipoMonto
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const bookingModal = window.bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
      if (bookingModal) bookingModal.hide();

      setTimeout(() => {
        const successModal = new window.bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
      }, 500);
    } catch (err) {
      setBookingError(err.message);
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error || !negocio) return <div className="d-flex justify-content-center align-items-center vh-100"><h2>Negocio no encontrado</h2></div>;

  const dynamicTextColor = getContrastColor(negocio.primaryColor);
  const serviciosVisibles = servicios.slice(serviceIndex, serviceIndex + 3);
  const postsVisibles = posts.slice(postIndex, postIndex + 4);
  const anticipoMonto = selectedService ? (selectedService.precio * (negocio.anticipo / 100)) : 0;
  const restanteMonto = selectedService ? (selectedService.precio - anticipoMonto) : 0;
  const getMinDate = () => { const d = new Date(); d.setHours(d.getHours() + 48); return d.toISOString().split('T')[0]; };

  return (
    <div className="font-dm bg-light-custom" style={{ '--primary-color': negocio.primaryColor || '#4A0E4E', '--secondary-color': negocio.secondaryColor || '#CFB53B', '--text-on-primary': dynamicTextColor }}>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg fixed-top animate__animated animate__fadeInDown shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="container">
          <a className="navbar-brand fw-bold font-playfair fs-4 text-uppercase" style={{ color: 'var(--text-on-primary)' }} href="#">
            <i className="fas fa-gem me-2"></i>{negocio.nombre}
          </a>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <i className="fas fa-bars" style={{ color: 'var(--text-on-primary)' }}></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><a className="nav-link custom-nav-link" style={{ color: 'var(--text-on-primary)' }} href="#servicios">Servicios</a></li>
              <li className="nav-item"><a className="nav-link custom-nav-link" style={{ color: 'var(--text-on-primary)' }} href="#novedades">Novedades</a></li>
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                {usuarioActivo ? (
                  (usuarioActivo.roles === 'admin' || usuarioActivo.roles === 'superadmin' || usuarioActivo.roles === 'empleado') ? (
                    <button onClick={irAlPanel} className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center" style={{ color: 'var(--text-on-primary)', borderColor: 'var(--text-on-primary)' }}>
                      <i className="fas fa-cog me-2"></i> Mi Panel
                    </button>
                  ) : (
                    <button onClick={() => { localStorage.removeItem('usuario'); localStorage.removeItem('token'); setUsuarioActivo(null); }} className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center" style={{ color: 'var(--text-on-primary)', borderColor: 'var(--text-on-primary)' }}>
                      <i className="fas fa-sign-out-alt me-2"></i> Salir
                    </button>
                  )
                ) : (
                  <button className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center" style={{ color: 'var(--text-on-primary)', borderColor: 'var(--text-on-primary)' }} data-bs-toggle="modal" data-bs-target="#loginModal">
                    <i className="fas fa-user me-2"></i> Iniciar Sesión
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <header className="hero-section d-flex align-items-center text-center text-white" style={{ backgroundImage: negocio.banner ? `url(${negocio.banner})` : "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="overlay"></div>
        <div className="container position-relative z-2 animate__animated animate__fadeInUp">
          <span className="badge bg-secondary mb-3 px-4 py-2 rounded-pill fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{negocio.tipo}</span>
          <h1 className="display-3 fw-bold mb-4 font-playfair text-capitalize">{negocio.nombre}</h1>
          <p className="lead mb-5 mx-auto opacity-75" style={{ maxWidth: '700px' }}>{negocio.descripcion || 'Descubre servicios profesionales, agenda tu cita en segundos y déjate consentir por nuestros expertos.'}</p>
          <a href="#servicios" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-bold" style={{ color: 'var(--text-on-primary)' }}> Explorar Servicios <i className="fas fa-arrow-down ms-2"></i></a>
        </div>
      </header>

      {/* ================= SERVICIOS ================= */}
      <section id="servicios" className="py-5 bg-light-custom">
        <div className="container py-5 position-relative">
          <div className="text-center mb-5 animate__animated animate__fadeIn">
            <h2 className="section-title fw-bold font-playfair">Nuestros Servicios</h2>
            <div className="divider mx-auto"></div>
            <p className="text-muted">Selecciona el tratamiento ideal para ti</p>
          </div>
          
          {servicios.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="bg-primary-light text-primary-custom rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px' }}><i className="fas fa-box-open fa-3x"></i></div>
              <h3 className="fw-bold font-playfair text-dark">Aún no hay servicios disponibles</h3>
            </div>
          ) : (
            <div className="position-relative px-md-5">
              {servicios.length > 3 && (
                <>
                  <button onClick={prevServices} disabled={serviceIndex === 0} className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow border d-flex align-items-center justify-content-center z-3" style={{ width: '45px', height: '45px', opacity: serviceIndex === 0 ? 0.4 : 1 }}><i className="fas fa-chevron-left text-dark"></i></button>
                  <button onClick={nextServices} disabled={serviceIndex >= servicios.length - 3} className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow border d-flex align-items-center justify-content-center z-3" style={{ width: '45px', height: '45px', opacity: serviceIndex >= servicios.length - 3 ? 0.4 : 1 }}><i className="fas fa-chevron-right text-dark"></i></button>
                </>
              )}
              <div className="row g-4 justify-content-center animate__animated animate__fadeIn">
                {serviciosVisibles.map((servicio) => (
                  <div className="col-md-6 col-lg-4" key={servicio._id}>
                    <div className="card service-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                      <div className="position-relative overflow-hidden">
                        <img src={servicio.imagen || "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} className="card-img-top" alt={servicio.nombre} style={{ height: '220px', objectFit: 'cover' }} />
                        <span className="price-tag shadow-sm font-dm">${servicio.precio}.00 MXN</span>
                      </div>
                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="card-title fw-bold mb-0 font-playfair text-capitalize text-dark">{servicio.nombre}</h5>
                          <small className="text-muted fw-bold"><i className="far fa-clock me-1"></i> {servicio.duracion} min</small>
                        </div>
                        <p className="card-text text-muted small flex-grow-1 mt-2">{servicio.descripcion || 'Servicio profesional de alta calidad y atención personalizada.'}</p>
                        <button className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm mt-3" onClick={() => handleOpenBooking(servicio)} style={{ color: 'var(--text-on-primary)' }}>Agendar Cita</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= NOVEDADES / POSTS ================= */}
      <section id="novedades" className="py-5 bg-white">
        <div className="container py-5 position-relative">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold font-playfair">Novedades y Promociones</h2>
            <div className="divider mx-auto"></div>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-5 bg-light-custom rounded-4 shadow-sm border p-5 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="bg-primary-light text-primary-custom rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.04)' }}><i className="fas fa-bullhorn fa-3x text-muted"></i></div>
              <h3 className="fw-bold font-playfair text-dark">No hay publicaciones subidas</h3>
            </div>
          ) : (
            <div className="position-relative px-md-5">
              {posts.length > 4 && (
                <>
                  <button onClick={prevPosts} disabled={postIndex === 0} className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow border d-flex align-items-center justify-content-center z-3" style={{ width: '45px', height: '45px', opacity: postIndex === 0 ? 0.4 : 1 }}><i className="fas fa-chevron-left text-dark"></i></button>
                  <button onClick={nextPosts} disabled={postIndex >= posts.length - 4} className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow border d-flex align-items-center justify-content-center z-3" style={{ width: '45px', height: '45px', opacity: postIndex >= posts.length - 4 ? 0.4 : 1 }}><i className="fas fa-chevron-right text-dark"></i></button>
                </>
              )}
              <div className="row g-4 justify-content-center animate__animated animate__fadeIn">
                {postsVisibles.map((post) => (
                  <div className="col-md-6 col-lg-3" key={post._id}> 
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-column">
                      {post.image_url && <div className="position-relative"><img src={post.image_url} className="w-100" alt={post.titulo_p} style={{ objectFit: 'cover', height: '160px' }}/></div>}
                      <div className="card-body p-4 d-flex flex-column flex-grow-1">
                        <span className="text-primary-custom fw-bold small text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '11px' }}><i className="far fa-newspaper me-1"></i> Novedad</span>
                        <h5 className="card-title fw-bold font-playfair text-capitalize text-dark mb-2">{post.titulo_p}</h5>
                        <p className="card-text text-muted small flex-grow-1" style={{ whiteSpace: 'pre-line', fontSize: '13px' }}>{post.contenido}</p>
                        <small className="text-muted mt-3 block small border-top pt-2" style={{ fontSize: '11px' }}><i className="far fa-calendar-alt me-1"></i> {new Date(post.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-white py-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold mb-3 font-playfair text-uppercase"><i className="fas fa-gem me-2"></i>{negocio.nombre}</h4>
              <p className="small text-white-50 pe-md-4">{negocio.descripcion || 'Expertos en resaltar tu belleza natural con servicios de alta calidad y atención personalizada.'}</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-4 font-playfair">Horarios de Atención</h5>
              <ul className="list-unstyled small text-white-50">
                <li className="mb-2 d-flex justify-content-between border-bottom border-secondary pb-2 pe-4"><span>Lunes - Viernes:</span> <span>9:00 AM - 8:00 PM</span></li>
                <li className="mb-2 d-flex justify-content-between border-bottom border-secondary pb-2 pe-4"><span>Sábado:</span> <span>10:00 AM - 6:00 PM</span></li>
                <li className="d-flex justify-content-between pe-4"><span>Domingo:</span> <span>Cerrado</span></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-4 font-playfair">Contacto</h5>
              <ul className="list-unstyled small text-white-50">
                <li className="mb-3"><i className="fas fa-phone me-3 fs-5"></i> {negocio.celular}</li>
                {negocio.ubicacion && <li className="mb-3"><i className="fas fa-map-marker-alt me-3 fs-5"></i> {negocio.ubicacion}</li>}
                {negocio.instagram && <li className="mb-3"><i className="fab fa-instagram me-3 fs-5"></i> {negocio.instagram}</li>}
                {negocio.facebook && <li><i className="fab fa-facebook me-3 fs-5"></i> {negocio.facebook}</li>}
              </ul>
            </div>
          </div>
          <div className="text-center small text-white-50 mt-4 pt-4 border-top border-secondary">
            <p className="mb-0">&copy; 2026 {negocio.nombre}. Powered by <strong className="text-white">Velvet Match</strong>.</p>
          </div>
        </div>
      </footer>

            {/* ================= MODAL: AGENDAR CITA (REDISEÑADO A REACT) ================= */}
      <div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            
            <div className="modal-header text-white border-0 flex-column align-items-start p-4 bg-primary-custom" style={{ backgroundColor: 'var(--primary-color)' }}>
              <div className="d-flex justify-content-between w-100 mb-3">
                <h4 className="modal-title fw-bold font-playfair" style={{ color: 'var(--text-on-primary)' }}>Agendar Cita</h4>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={() => setCurrentStep(1)}></button>
              </div>
              <div className="w-100 position-relative">
                <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-bar bg-white rounded-pill transition-all" style={{ width: `${currentStep * 33.33}%` }}></div>
                </div>
                <div className="d-flex justify-content-between mt-2 small fw-bold" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-on-primary)' }}>
                  <span className={currentStep >= 1 ? "" : "opacity-50"}>1. Servicio</span>
                  <span className={currentStep >= 2 ? "" : "opacity-50"}>2. Fecha y Hora</span>
                  <span className={currentStep === 3 ? "" : "opacity-50"}>3. Confirmación</span>
                </div>
              </div>
            </div>

            <div className="modal-body p-0 bg-light-custom">
              {bookingError && (
                <div className="m-4 alert alert-danger d-flex align-items-center shadow-sm rounded-3 py-2 px-3 mb-0">
                  <i className="fas fa-exclamation-circle me-2"></i><div className="small fw-bold">{bookingError}</div>
                </div>
              )}

              {/* PASO 1 */}
              {currentStep === 1 && selectedService && (
                <div className="p-4 p-md-5 animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-dark mb-4 font-playfair">Detalles de tu selección</h5>
                  <div className="card border border-primary-subtle rounded-4 shadow-sm mb-4">
                    <div className="card-body p-4 d-flex align-items-center">
                      <div className="bg-primary-light text-primary-custom rounded-circle d-flex justify-content-center align-items-center me-4 shadow-sm" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-cut fa-2x"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1 font-playfair text-capitalize">{selectedService.nombre}</h5>
                        <p className="text-muted small mb-0">{selectedService.descripcion || 'Servicio profesional'}</p>
                      </div>
                      <div className="text-end ms-3">
                        <h4 className="fw-bold text-success mb-0">${selectedService.precio}.00</h4>
                        <small className="text-muted fw-bold"><i className="far fa-clock me-1"></i>{selectedService.duracion} min</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
  <div className="animate__animated animate__fadeIn">
    <div className="text-center mb-4">
      <span className="badge bg-primary-light text-primary-custom mb-2 px-3 py-1 rounded-pill fw-bold">Paso 2 de 3</span>
      <h4 className="fw-bold font-playfair text-dark">Selecciona Fecha y Hora</h4>
      <p className="text-muted small">Recuerda que las reservas requieren un mínimo de 48 horas de anticipación.</p>
    </div>

    {bookingError && (
      <div className="alert alert-danger py-2 rounded-3 small shadow-sm mb-3">
        <i className="fas fa-exclamation-circle me-2"></i>{bookingError}
      </div>
    )}

    <div className="row g-4">
      {/* SECCIÓN DEL MINI CALENDARIO */}
      <div className="col-lg-7">
        <label className="form-label fw-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
          <i className="far fa-calendar-alt me-2 text-primary-custom"></i>Calendario
        </label>
        <div className="bg-light p-3 rounded-4 border border-light-subtle shadow-sm">
          {/* Encabezado de los días de la semana */}
          <div className="calendar-grid text-center font-playfair small fw-bold text-muted mb-2">
            <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sá</div>
          </div>
          
          {/* Grid de días del mes */}
          <div className="calendar-grid text-center">
            {generarDiasCalendario().map((dia, index) => {
              if (!dia.numero) return <div key={`empty-${index}`} className="cal-day disabled"></div>;
              
              const isSelected = bookingDate === dia.fechaString;
              return (
                <button
                  key={`day-${dia.numero}`}
                  type="button"
                  disabled={dia.disabled}
                  onClick={() => { setBookingDate(dia.fechaString); setBookingTime(""); }}
                  className={`btn cal-day p-2 w-100 border-0 ${
                    dia.disabled ? 'disabled' : isSelected ? 'available active bg-primary-custom text-white' : 'available bg-white shadow-sm border'
                  }`}
                >
                  {dia.numero}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN DE HORARIOS DISPONIBLES */}
      <div className="col-lg-5">
        <label className="form-label fw-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
          <i className="far fa-clock me-2 text-primary-custom"></i>Horarios
        </label>
        
        {!bookingDate ? (
          <div className="d-flex align-items-center justify-content-center h-75 bg-light rounded-4 border border-dashed p-4 text-center">
            <p className="text-muted small mb-0">Selecciona un día del calendario para ver las horas disponibles</p>
          </div>
        ) : (
          <div className="row row-cols-2 g-2 overflow-y-auto" style={{ maxHeight: '240px', paddingRight: '4px' }}>
            {horasDisponibles.map((hora) => {
              const estaOcupada = horasOcupadas.includes(hora);
              const isSelected = bookingTime === hora;

              return (
                <div className="col" key={hora}>
                  <button
                    type="button"
                    disabled={estaOcupada}
                    onClick={() => setBookingTime(hora)}
                    className={`btn w-100 py-2.5 rounded-3 fw-bold small transition-all shadow-sm ${
                      estaOcupada 
                        ? 'btn-light text-muted opacity-50 border border-light-subtle' 
                        : isSelected 
                          ? 'btn-primary bg-primary-custom text-white' 
                          : 'btn-outline-primary bg-white border border-light-subtle text-dark'
                    }`}
                    style={{ textDecoration: estaOcupada ? 'line-through' : 'none' }}
                  >
                    <i className={`far ${estaOcupada ? 'fa-calendar-times' : 'fa-clock'} me-1.5 small`}></i>
                    {hora}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

    {/* BOTONES DE NAVEGACIÓN PROPIOS DEL MODAL */}
    <div className="d-flex gap-2 justify-content-between mt-4 pt-3 border-top border-light-subtle">
      <button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" onClick={() => setCurrentStep(1)}>
        <i className="fas fa-arrow-left me-2"></i>Regresar
      </button>
      <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={handleNextToStep3} style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary)' }}>
        Continuar<i className="fas fa-arrow-right ms-2"></i>
      </button>
    </div>
  </div>
)}

              {/* PASO 3: RESUMEN Y CÁLCULOS */}
              {currentStep === 3 && selectedService && (
                <div className="p-4 p-md-5 animate__animated animate__fadeInRight">
                  <div className="text-center mb-4">
                    <div className="bg-success-subtle text-success rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-check-circle fa-3x"></i>
                    </div>
                    <h3 className="fw-bold font-playfair text-dark">Resumen de tu Cita</h3>
                  </div>

                  <div className="bg-white rounded-4 p-4 mb-4 border shadow-sm">
                    <div className="row mb-3 align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Servicio:</div>
                      <div className="col-7 fw-bold text-end fs-6 text-capitalize">{selectedService.nombre}</div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Fecha y Hora:</div>
                      <div className="col-7 fw-bold text-end text-primary-custom fs-6">{bookingDate} a las {bookingTime}</div>
                    </div>
                    <hr className="opacity-25" />
                    <div className="row mb-2 align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Total del Servicio:</div>
                      <div className="col-7 fw-bold text-end">${selectedService.precio.toFixed(2)} MXN</div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-5 text-warning small fw-bold text-uppercase">Anticipo Requerido ({negocio.anticipo}%):</div>
                      <div className="col-7 fw-bold text-end text-warning fs-5 bg-warning-subtle rounded px-2 py-1">${anticipoMonto.toFixed(2)} MXN</div>
                    </div>
                    <div className="row align-items-center">
                      <div class="col-5 text-muted small fw-bold text-uppercase">Restante a pagar local:</div>
                      <div className="col-7 fw-bold text-end text-success fs-5">${restanteMonto.toFixed(2)} MXN</div>
                    </div>
                  </div>

                  <div className="alert alert-warning border-0 bg-warning-subtle text-dark-emphasis p-4 rounded-4 mb-0 shadow-sm">
                    <h6 className="fw-bold mb-3 font-playfair"><i className="fas fa-exclamation-triangle me-2 text-warning"></i>Políticas Importantes</h6>
                    <ul className="small mb-0 ps-3">
                      <li className="mb-2">El <strong>anticipo del {negocio.anticipo}% (${anticipoMonto.toFixed(2)} MXN)</strong> es necesario para reservar tu espacio. El resto se pagará en efectivo el día de tu cita.</li>
                      <li className="mb-2">Puedes cancelar tu cita desde tu perfil, pero únicamente con <strong>6 horas de anticipación</strong>.</li>
                      <li>Al confirmar, la cita quedará en estado <strong>Pendiente</strong> hasta que se apruebe.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-0 p-4 bg-white rounded-bottom-4 d-flex justify-content-between">
              {currentStep > 1 ? (
                <button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" onClick={() => { setCurrentStep(prev => prev - 1); setBookingError(""); }}> Atrás </button>
              ) : ( <div></div> )}

              <div>
                <button type="button" className="btn btn-light rounded-pill px-4 me-2 fw-bold" data-bs-dismiss="modal" onClick={() => setCurrentStep(1)}>Cancelar</button>
                {currentStep === 1 && <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" onClick={() => setCurrentStep(2)}>Continuar <i className="fas fa-arrow-right ms-2"></i></button>}
                {currentStep === 2 && <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" onClick={handleNextToStep3}>Continuar <i className="fas fa-arrow-right ms-2"></i></button>}
                {currentStep === 3 && <button type="button" className="btn btn-success rounded-pill px-5 shadow-sm fw-bold" onClick={submitBooking}><i className="fas fa-check me-2"></i> Confirmar Cita</button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: ÉXITO ================= */}
      <div className="modal fade" id="successModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 rounded-4 shadow-lg text-center p-4">
            <div className="text-warning mb-3"><i className="fas fa-hourglass-half fa-4x animate__animated animate__pulse animate__infinite"></i></div>
            <h4 className="fw-bold font-playfair">Cita en Revisión</h4>
            <p className="text-muted small mb-4">Tu solicitud ha sido enviada. El administrador revisará y confirmará tu cita pronto.</p>
            <button type="button" className="btn btn-primary rounded-pill w-100 fw-bold py-2 shadow-sm" data-bs-dismiss="modal">Entendido</button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: LOGIN FUNCIONAL ================= */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                  <div className="modal-header text-white border-0 p-4 bg-primary-custom" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <h4 className="modal-title fw-bold font-playfair" style={{ color: 'var(--text-on-primary)' }}><i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</h4>
                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body p-4 p-md-5">
                      
                      {loginError && <div className="alert alert-danger small rounded-3"><i className="fas fa-exclamation-circle me-2"></i>{loginError}</div>}
                      {loginSuccess && <div className="alert alert-success small rounded-3"><i className="fas fa-check-circle me-2"></i>{loginSuccess}</div>}

                      <div className="alert alert-warning small border-0 mb-4 rounded-3"><i className="fas fa-info-circle me-2"></i>Para agendar una cita o ir a tu panel necesitas iniciar sesión.</div>
                      
                      <form onSubmit={handleLogin}>
                          <div className="mb-4">
                              <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Correo Electrónico</label>
                              <div className="input-group shadow-sm rounded-3">
                                  <span className="input-group-text bg-light border-end-0 border-light-subtle"><i className="fas fa-envelope text-muted"></i></span>
                                  <input type="email" className="form-control form-control-lg bg-light border-start-0 border-light-subtle ps-0" placeholder="tu@correo.com" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Contraseña</label>
                              <div className="input-group shadow-sm rounded-3">
                                  <span className="input-group-text bg-light border-end-0 border-light-subtle"><i className="fas fa-lock text-muted"></i></span>
                                  <input type="password" className="form-control form-control-lg bg-light border-start-0 border-light-subtle ps-0" placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                              </div>
                          </div>
                          <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold mb-4 shadow-sm fs-6">Ingresar al Panel</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      
    </div>
  );
}