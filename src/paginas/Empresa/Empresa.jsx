import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Empresa.css';

export default function EmpresaLanding() {
  // Obtenemos el ID del negocio desde la URL
  const { id } = useParams();

  // --- ESTADOS ---
  const [currentStep, setCurrentStep] = useState(1);
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- OBTENER DATOS DEL BACKEND ---
  useEffect(() => {
    const fetchNegocioData = async () => {
      try {
        // 1. Obtener la información del negocio
        const resNegocio = await fetch(`http://localhost:5000/api/negocios/${id}`);
        if (!resNegocio.ok) throw new Error('No se encontró el negocio');
        const dataNegocio = await resNegocio.json();
        setNegocio(dataNegocio);

        // 2. Obtener los servicios del negocio
        const resServicios = await fetch(`http://localhost:5000/api/servicios/negocio/${id}`);
        if (resServicios.ok) {
          const dataServicios = await resServicios.json();
          setServicios(dataServicios);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNegocioData();
    }
  }, [id]);

  // --- LÓGICA PARA EL MODAL DE CITAS ---
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const submitBooking = () => {
    const bookingModalEl = document.getElementById('bookingModal');
    const bookingModal = window.bootstrap.Modal.getInstance(bookingModalEl);
    if (bookingModal) bookingModal.hide();

    setTimeout(() => {
      const successModalEl = document.getElementById('successModal');
      const successModal = new window.bootstrap.Modal(successModalEl);
      successModal.show();
      setTimeout(() => setCurrentStep(1), 1000);
    }, 500);
  };

  // Si está cargando, mostramos un spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light-custom">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si hay error (ej. id incorrecto)
  if (error || !negocio) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light-custom text-center">
        <div>
          <i className="fas fa-store-slash fa-4x text-muted mb-3"></i>
          <h2 className="fw-bold font-playfair text-dark">Negocio no encontrado</h2>
          <p className="text-muted">Parece que este negocio no existe o el enlace es incorrecto.</p>
        </div>
      </div>
    );
  }

  return (
    /* Aquí inyectamos los colores personalizados del negocio a las variables CSS */
    <div className="font-dm bg-light-custom" style={{ 
      '--primary-color': negocio.primaryColor || '#4A0E4E',
      '--secondary-color': negocio.secondaryColor || '#CFB53B' 
    }}>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg fixed-top animate__animated animate__fadeInDown shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold font-playfair fs-4 text-uppercase" href="#">
            <i className="fas fa-gem me-2"></i>{negocio.nombre}
          </a>
          <button className="navbar-toggler border-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <i className="fas fa-bars text-white"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><a className="nav-link custom-nav-link" href="#servicios">Servicios</a></li>
              <li className="nav-item"><a className="nav-link custom-nav-link" href="#novedades">Novedades</a></li>
              <li className="nav-item"><a className="nav-link custom-nav-link" href="#reviews">Opiniones</a></li>
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <button className="btn btn-outline-light btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#loginModal">
                  <i className="fas fa-user me-2"></i> Iniciar Sesión
                </button>
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
          <a href="#servicios" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-bold">
            Explorar Servicios <i className="fas fa-arrow-down ms-2"></i>
          </a>
        </div>
      </header>

      {/* ================= SERVICIOS ================= */}
      <section id="servicios" className="py-5 bg-light-custom">
        <div className="container py-5">
          <div className="text-center mb-5 animate__animated animate__fadeIn">
            <h2 className="section-title fw-bold font-playfair">Nuestros Servicios</h2>
            <div className="divider mx-auto"></div>
            <p className="text-muted">Selecciona el tratamiento ideal para ti</p>
          </div>
          
          {/* LÓGICA DE SERVICIOS VACÍOS */}
          {servicios.length === 0 ? (
            <div className="text-center py-5 animate__animated animate__fadeInUp bg-white rounded-4 shadow-sm border p-5 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="bg-primary-light text-primary-custom rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-box-open fa-3x"></i>
              </div>
              <h3 className="fw-bold font-playfair text-dark">Aún no hay servicios disponibles</h3>
              <p className="text-muted mb-4">Este negocio es nuevo y está preparando su catálogo de servicios. ¡Vuelve pronto para agendar tu cita!</p>
              
              {/* Botón puramente visual por ahora */}
              <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm hover-lift">
                <i className="fas fa-plus me-2"></i> Agregar servicios
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {/* Aquí mapearíamos los servicios reales si existieran */}
              {servicios.map((servicio, index) => (
                <div className="col-md-6 col-lg-4 animate__animated animate__fadeInUp" key={servicio._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="card service-card h-100 border-0 shadow-sm rounded-4">
                    <div className="position-relative overflow-hidden rounded-top-4">
                      <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" className="card-img-top" alt={servicio.nombre} />
                      <span className="price-tag shadow-sm font-dm">${servicio.precio}.00 MXN</span>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title fw-bold mb-0 font-playfair">{servicio.nombre}</h5>
                        <small className="text-muted fw-bold"><i className="far fa-clock me-1"></i> {servicio.duracion} min</small>
                      </div>
                      <p className="card-text text-muted small flex-grow-1 mt-2">{servicio.descripcion || 'Servicio profesional de alta calidad.'}</p>
                      <button className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm mt-3" data-bs-toggle="modal" data-bs-target="#bookingModal" onClick={() => setCurrentStep(1)}>
                        Agendar Cita
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER DINÁMICO ================= */}
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
            <p className="mb-0">&copy; 2024 {negocio.nombre}. Powered by <strong className="text-white">Velvet Match</strong>.</p>
          </div>
        </div>
      </footer>

      {/* ================= MODAL DE RESERVA (WIZARD) ================= */}
      <div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            
            <div className="modal-header text-white border-0 flex-column align-items-start p-4 bg-primary-custom">
              <div className="d-flex justify-content-between w-100 mb-3">
                <h4 className="modal-title fw-bold font-playfair" id="bookingTitle">Agendar Cita</h4>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="w-100 position-relative">
                <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-bar bg-white rounded-pill" style={{ width: `${currentStep * 33.33}%`, transition: 'width 0.3s ease' }}></div>
                </div>
                <div className="d-flex justify-content-between mt-2 text-white-50 small fw-bold" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <span className={currentStep >= 1 ? "text-white" : ""}>1. Servicio</span>
                  <span className={currentStep >= 2 ? "text-white" : ""}>2. Fecha y Hora</span>
                  <span className={currentStep === 3 ? "text-white" : ""}>3. Confirmación</span>
                </div>
              </div>
            </div>

            <div className="modal-body p-0">
              {/* PASO 1 */}
              {currentStep === 1 && (
                <div className="booking-step p-4 p-md-5 animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-dark mb-4 font-playfair">Detalles de tu selección</h5>
                  <div className="card border border-primary-subtle rounded-4 shadow-sm mb-4">
                    <div className="card-body p-4 d-flex align-items-center">
                      <div className="bg-primary-light text-primary-custom rounded-circle d-flex justify-content-center align-items-center me-4" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-cut fa-2x"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1 font-playfair">Corte & Estilo</h5>
                        <p className="text-muted small mb-0">Corte profesional con lavado incluido, masaje capilar y peinado final con productos premium.</p>
                      </div>
                      <div className="text-end ms-3">
                        <h4 className="fw-bold text-success mb-0">$350.00</h4>
                        <small className="text-muted fw-bold"><i className="far fa-clock me-1"></i>45 min</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2 */}
              {currentStep === 2 && (
                <div className="booking-step p-4 p-md-5 animate__animated animate__fadeInRight">
                  <div className="alert alert-info border-0 bg-info-subtle text-info-emphasis d-flex align-items-center mb-4 rounded-4 shadow-sm p-3">
                    <i className="fas fa-info-circle fa-2x me-3"></i>
                    <small>Recuerda que solo puedes agendar citas con al menos <strong>48 horas de anticipación</strong>.</small>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-7 border-end-md pe-md-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <button className="btn btn-sm btn-light rounded-circle shadow-sm"><i className="fas fa-chevron-left"></i></button>
                        <h6 className="fw-bold m-0 font-playfair fs-5">Febrero 2024</h6>
                        <button className="btn btn-sm btn-light rounded-circle shadow-sm"><i className="fas fa-chevron-right"></i></button>
                      </div>
                      <div className="calendar-grid text-center">
                        <div className="text-muted small fw-bold mb-2">Do</div><div className="text-muted small fw-bold mb-2">Lu</div><div className="text-muted small fw-bold mb-2">Ma</div><div className="text-muted small fw-bold mb-2">Mi</div><div className="text-muted small fw-bold mb-2">Ju</div><div className="text-muted small fw-bold mb-2">Vi</div><div className="text-muted small fw-bold mb-2">Sa</div>
                        <div className="cal-day disabled">18</div><div className="cal-day disabled">19</div><div className="cal-day disabled">20</div>
                        <div className="cal-day available">21</div><div className="cal-day available active">22</div><div className="cal-day available">23</div><div className="cal-day available">24</div>
                        <div className="cal-day available">25</div><div className="cal-day available">26</div><div className="cal-day available">27</div><div className="cal-day available">28</div><div className="cal-day available">29</div>
                      </div>
                    </div>
                    
                    <div className="col-md-5 ps-md-4">
                      <h6 className="fw-bold mb-4 text-center font-playfair">Horarios para el 22 Feb</h6>
                      <div className="d-grid gap-3 timeslot-grid px-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        <button className="btn btn-outline-primary timeslot-btn rounded-pill fw-bold py-2">09:00 AM</button>
                        <button className="btn btn-outline-primary timeslot-btn rounded-pill fw-bold py-2">10:00 AM</button>
                        <button className="btn btn-outline-primary timeslot-btn active rounded-pill fw-bold py-2">11:30 AM</button>
                        <button className="btn btn-outline-primary timeslot-btn rounded-pill fw-bold py-2" disabled>01:00 PM (Ocupado)</button>
                        <button className="btn btn-outline-primary timeslot-btn rounded-pill fw-bold py-2">03:00 PM</button>
                        <button className="btn btn-outline-primary timeslot-btn rounded-pill fw-bold py-2">05:00 PM</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3 */}
              {currentStep === 3 && (
                <div className="booking-step p-4 p-md-5 animate__animated animate__fadeInRight">
                  <div className="text-center mb-4">
                    <div className="bg-success-subtle text-success rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-check-circle fa-3x"></i>
                    </div>
                    <h3 className="fw-bold font-playfair">Resumen de tu Cita</h3>
                  </div>

                  <div className="bg-light rounded-4 p-4 mb-4 border shadow-sm">
                    <div className="row mb-3 align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Servicio:</div>
                      <div className="col-7 fw-bold text-end fs-6">Corte & Estilo</div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Fecha y Hora:</div>
                      <div className="col-7 fw-bold text-end text-primary-custom fs-6">Jueves 22 Feb, 11:30 AM</div>
                    </div>
                    <hr className="opacity-25" />
                    <div className="row mb-2 align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Total del Servicio:</div>
                      <div className="col-7 fw-bold text-end">$350.00 MXN</div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-5 text-warning small fw-bold text-uppercase">Anticipo Requerido (15%):</div>
                      <div className="col-7 fw-bold text-end text-warning fs-5 bg-warning-subtle rounded px-2 py-1">$52.50 MXN</div>
                    </div>
                    <div className="row align-items-center">
                      <div className="col-5 text-muted small fw-bold text-uppercase">Restante a pagar local:</div>
                      <div className="col-7 fw-bold text-end text-success fs-5">$297.50 MXN</div>
                    </div>
                  </div>

                  <div className="alert alert-warning border-0 bg-warning-subtle text-dark-emphasis p-4 rounded-4 mb-0 shadow-sm">
                    <h6 className="fw-bold mb-3 font-playfair"><i className="fas fa-exclamation-triangle me-2 text-warning"></i>Políticas Importantes</h6>
                    <ul className="small mb-0 ps-3">
                      <li className="mb-2">El <strong>anticipo del 15% ($52.50 MXN)</strong> es necesario para reservar tu espacio. El resto se pagará en efectivo el día de tu cita.</li>
                      <li className="mb-2">Puedes cancelar tu cita desde tu perfil, pero únicamente con <strong>6 horas de anticipación</strong>.</li>
                      <li>Al confirmar, la cita quedará en estado <strong>Pendiente</strong> hasta que el administrador la apruebe y te asigne un profesional.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-0 p-4 pt-0 justify-content-between bg-white rounded-bottom-4">
              {currentStep > 1 ? (
                <button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" onClick={prevStep}>Atrás</button>
              ) : (
                <div></div> /* Div vacío para mantener el espacio con justify-content-between */
              )}
              
              <div className="ms-auto">
                {currentStep === 1 && (
                  <button type="button" className="btn btn-light rounded-pill px-4 me-2 fw-bold" data-bs-dismiss="modal">Cancelar</button>
                )}
                
                {currentStep < 3 ? (
                  <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" onClick={nextStep}>
                    Continuar <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button type="button" className="btn btn-success rounded-pill px-5 shadow-sm fw-bold" onClick={submitBooking}>
                    <i className="fas fa-check me-2"></i> Confirmar Cita
                  </button>
                )}
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

      {/* ================= MODAL DE LOGIN ================= */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            <div className="modal-header text-white border-0 p-4 bg-primary-custom">
              <h4 className="modal-title fw-bold font-playfair"><i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</h4>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 p-md-5">
              <form>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Correo Electrónico / Usuario</label>
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
                
                <div className="text-center bg-light-custom p-4 rounded-4 border border-light-subtle">
                  <p className="text-muted small mb-2 fw-bold">¿Eres cliente y aún no tienes cuenta?</p>
                  <a href="#" className="fw-bold fs-6 text-decoration-none text-secondary-custom hover-lift d-inline-block">Regístrate aquí <i className="fas fa-arrow-right ms-1 small"></i></a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}