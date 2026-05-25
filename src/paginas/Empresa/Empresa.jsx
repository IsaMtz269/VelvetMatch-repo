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

  // --- SLIDERS ---
  const nextServices = () => { if (serviceIndex < servicios.length - 3) setServiceIndex(prev => prev + 1); };
  const prevServices = () => { if (serviceIndex > 0) setServiceIndex(prev => prev - 1); };
  const nextPosts = () => { if (postIndex < posts.length - 4) setPostIndex(prev => prev + 1); };
  const prevPosts = () => { if (postIndex > 0) setPostIndex(prev => prev - 1); };

  const irAlPanel = () => {
    if (usuarioActivo.roles === 'admin' || usuarioActivo.roles === 'superadmin') navigate('/admin');
    else if (usuarioActivo.roles === 'empleado') navigate('/empleado');
  };

  // --- LÓGICA DE AGENDAMIENTO ---
  const handleOpenBooking = (servicio) => {
    // Si no está registrado o no inició sesión, mostramos el modal de Login en lugar del de Cita
    if (!usuarioActivo) {
      const loginModal = new window.bootstrap.Modal(document.getElementById('loginModal'));
      loginModal.show();
      return;
    }
    
    setSelectedService(servicio);
    setCurrentStep(1);
    setBookingDate("");
    setBookingTime("");
    setBookingError("");
    
    const bookingModal = new window.bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
  };

  const handleNextToStep3 = () => {
    setBookingError("");
    if (!bookingDate || !bookingTime) {
      return setBookingError("Por favor, selecciona una fecha y una hora.");
    }

    // Validación Front-End: 48 horas de anticipo
    const fechaHoraCita = new Date(`${bookingDate}T${bookingTime}:00`);
    const ahora = new Date();
    const diffHours = (fechaHoraCita - ahora) / (1000 * 60 * 60);

    if (diffHours < 48) {
      return setBookingError("Las citas deben agendarse con al menos 48 horas de anticipación.");
    }

    setCurrentStep(3);
  };

  const submitBooking = async () => {
    setBookingError("");
    try {
      // Cálculos
      const anticipoMonto = selectedService.precio * (negocio.anticipo / 100);
      
      const res = await fetch('http://localhost:5000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: usuarioActivo.id,
          id_negocio: negocio._id,
          id_servicio: selectedService._id,
          fecha: bookingDate,
          hora: bookingTime,
          precio_final: selectedService.precio,
          anticipo_pagado: anticipoMonto
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Si fue exitoso, cerramos un modal y abrimos el de éxito
      const bookingModalEl = document.getElementById('bookingModal');
      const bookingModal = window.bootstrap.Modal.getInstance(bookingModalEl);
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

  // Variables para el resumen (Paso 3)
  const anticipoMonto = selectedService ? (selectedService.precio * (negocio.anticipo / 100)) : 0;
  const restanteMonto = selectedService ? (selectedService.precio - anticipoMonto) : 0;

  // Fecha mínima permitida (48 hrs desde hoy) para el selector de HTML
  const getMinDate = () => {
    const d = new Date();
    d.setHours(d.getHours() + 48);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="font-dm bg-light-custom" style={{ 
      '--primary-color': negocio.primaryColor || '#4A0E4E',
      '--secondary-color': negocio.secondaryColor || '#CFB53B',
      '--text-on-primary': dynamicTextColor
    }}>
      
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
              <li className="nav-item"><a className="nav-link custom-nav-link" style={{ color: 'var(--text-on-primary)' }} href="#reviews">Opiniones</a></li>
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
      <header 
        className="hero-section d-flex align-items-center text-center text-white"
        style={{
          backgroundImage: negocio.banner 
            ? `url(${negocio.banner})` 
            : "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="overlay"></div>
        <div className="container position-relative z-2 animate__animated animate__fadeInUp">
          <span className="badge bg-secondary mb-3 px-4 py-2 rounded-pill fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
            {negocio.tipo}
          </span>
          <h1 className="display-3 fw-bold mb-4 font-playfair text-capitalize">
            {negocio.nombre}
          </h1>
          <p className="lead mb-5 mx-auto opacity-75" style={{ maxWidth: '700px' }}>
            {negocio.descripcion || 'Descubre servicios profesionales, agenda tu cita en segundos y déjate consentir por nuestros expertos.'}
          </p>
          <a href="#servicios" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-bold" style={{ color: 'var(--text-on-primary)' }}>
            Explorar Servicios <i className="fas fa-arrow-down ms-2"></i>
          </a>
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
              <p className="text-muted mb-0">Este negocio está preparando su catálogo de servicios. ¡Vuelve pronto para agendar tu cita!</p>
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
                        {/* 👇 BOTÓN INTELIGENTE DE RESERVA */}
                        <button className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm mt-3" onClick={() => handleOpenBooking(servicio)} style={{ color: 'var(--text-on-primary)' }}>
                          Agendar Cita
                        </button>
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
            <p className="text-muted">Mantente al tanto de nuestros últimos avisos y ofertas especiales</p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-5 bg-light-custom rounded-4 shadow-sm border p-5 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="bg-primary-light text-primary-custom rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <i className="fas fa-bullhorn fa-3x text-muted"></i>
              </div>
              <h3 className="fw-bold font-playfair text-dark">No hay publicaciones subidas</h3>
              <p className="text-muted mb-0">Por el momento este establecimiento no ha compartido publicaciones recientes.</p>
            </div>
          ) : (
            <div className="position-relative px-md-5">
              
              {/* FLECHAS DEL SLIDER DE NOVEDADES (> 4) */}
              {posts.length > 4 && (
                <>
                  <button onClick={prevPosts} disabled={postIndex === 0} className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow border d-flex align-items-center justify-content-center z-3" style={{ width: '45px', height: '45px', opacity: postIndex === 0 ? 0.4 : 1 }}>
                    <i className="fas fa-chevron-left text-dark"></i>
                  </button>
                  <button onClick={nextPosts} disabled={postIndex >= posts.length - 4} className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow border d-flex align-items-center justify-content-center z-3" style={{ width: '45px', height: '45px', opacity: postIndex >= posts.length - 4 ? 0.4 : 1 }}>
                    <i className="fas fa-chevron-right text-dark"></i>
                  </button>
                </>
              )}

              <div className="row g-4 justify-content-center animate__animated animate__fadeIn">
                {postsVisibles.map((post) => (
                  <div className="col-md-6 col-lg-3" key={post._id}> {/* Reducido a col-lg-3 para acomodar 4 juntos */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-column">
                      {post.image_url && (
                        <div className="position-relative">
                          <img 
                            src={post.image_url} 
                            className="w-100" 
                            alt={post.titulo_p} 
                            style={{ objectFit: 'cover', height: '160px' }}
                          />
                        </div>
                      )}
                      <div className="card-body p-4 d-flex flex-column flex-grow-1">
                        <span className="text-primary-custom fw-bold small text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '11px' }}>
                          <i className="far fa-newspaper me-1"></i> Novedad
                        </span>
                        <h5 className="card-title fw-bold font-playfair text-capitalize text-dark mb-2">{post.titulo_p}</h5>
                        <p className="card-text text-muted small flex-grow-1" style={{ whiteSpace: 'pre-line', fontSize: '13px' }}>{post.contenido}</p>
                        <small className="text-muted mt-3 block small border-top pt-2" style={{ fontSize: '11px' }}>
                          <i className="far fa-calendar-alt me-1"></i> {new Date(post.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </small>
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

              {/* PASO 2: SELECTORES DE FECHA/HORA HTML5 */}
              {currentStep === 2 && (
                <div className="p-4 p-md-5 animate__animated animate__fadeInRight">
                  <div className="alert alert-info border-0 bg-info-subtle text-info-emphasis d-flex align-items-center mb-4 rounded-4 shadow-sm p-3">
                    <i className="fas fa-info-circle fa-2x me-3"></i>
                    <small>Recuerda que solo puedes agendar citas con al menos <strong>48 horas de anticipación</strong>.</small>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-md-6 border-end-md pe-md-4">
                      <h6 className="fw-bold mb-3 font-playfair fs-5 text-dark">Selecciona la Fecha</h6>
                      <input 
                        type="date" 
                        className="form-control form-control-lg bg-white border-light-subtle shadow-sm fw-bold text-muted" 
                        min={getMinDate()}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 ps-md-4">
                      <h6 className="fw-bold mb-3 font-playfair fs-5 text-dark">Selecciona la Hora</h6>
                      <input 
                        type="time" 
                        className="form-control form-control-lg bg-white border-light-subtle shadow-sm fw-bold text-muted" 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      />
                    </div>
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

      {/* ================= MODAL DE ÉXITO ================= */}
      <div className="modal fade" id="successModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 rounded-4 shadow-lg text-center p-4">
            <div className="text-warning mb-3">
              <i className="fas fa-hourglass-half fa-4x animate__animated animate__pulse animate__infinite"></i>
            </div>
            <h4 className="fw-bold font-playfair">Cita en Revisión</h4>
            <p className="text-muted small mb-4">Tu solicitud ha sido enviada. El administrador revisará y confirmará tu cita pronto.</p>
            <button type="button" className="btn btn-primary rounded-pill w-100 fw-bold py-2 shadow-sm" data-bs-dismiss="modal">Entendido</button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: LOGIN ================= */}
      {/* (Se mantiene intacto el mismo que tenías) */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                  <div className="modal-header text-white border-0 p-4 bg-primary-custom" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <h4 className="modal-title fw-bold font-playfair" style={{ color: 'var(--text-on-primary)' }}><i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</h4>
                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body p-4 p-md-5">
                      <div className="alert alert-warning small border-0 mb-4 rounded-3"><i className="fas fa-info-circle me-2"></i>Para agendar una cita necesitas iniciar sesión como cliente.</div>
                      <form>
                          <div className="mb-4">
                              <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Correo Electrónico</label>
                              <div className="input-group shadow-sm rounded-3">
                                  <span className="input-group-text bg-light border-end-0 border-light-subtle"><i className="fas fa-envelope text-muted"></i></span>
                                  <input type="email" className="form-control form-control-lg bg-light border-start-0 border-light-subtle ps-0" placeholder="tu@correo.com" />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Contraseña</label>
                              <div className="input-group shadow-sm rounded-3">
                                  <span className="input-group-text bg-light border-end-0 border-light-subtle"><i className="fas fa-lock text-muted"></i></span>
                                  <input type="password" className="form-control form-control-lg bg-light border-start-0 border-light-subtle ps-0" placeholder="••••••••" />
                              </div>
                          </div>
                          <button type="button" className="btn btn-primary w-100 rounded-pill py-3 fw-bold mb-4 shadow-sm fs-6">Ingresar al Panel</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      
    </div>
  );
}