import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Empleado.css'; 

export default function Empleado() {
  const navigate = useNavigate();

  // ================= ESTADOS DE DATOS =================
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [citas, setCitas] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= ESTADOS PARA CREAR POST =================
  const [newPost, setNewPost] = useState({ titulo_p: '', contenido: '' });
  const [postImage, setPostImage] = useState("");
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");

  // ================= ESTADOS DE UI Y CALENDARIO =================
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateDetails, setSelectedDateDetails] = useState(null); 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // ================= CARGA DE DATOS DESDE EL BACKEND =================
  const cargarDatosEmpleado = async (user) => {
    try {
      const [resNeg, resCitas, resResenas, resEmpleados] = await Promise.all([
        fetch(`http://localhost:5000/api/negocios/${user.id_negocio}`),
        fetch(`http://localhost:5000/api/citas/negocio/${user.id_negocio}`),
        fetch(`http://localhost:5000/api/citas/negocio/${user.id_negocio}/resenas`),
        fetch(`http://localhost:5000/api/usuarios/empleados/negocio/${user.id_negocio}`) 
      ]);

      if (resNeg.ok) setNegocio(await resNeg.json());
      
      if (resCitas.ok) {
        const todasLasCitas = await resCitas.json();
        const citasAsignadas = todasLasCitas.filter(c => c.id_empleado?._id === user.id || c.id_empleado === user.id);
        setCitas(citasAsignadas);
      }

      if (resResenas.ok) {
        const todasLasResenas = await resResenas.json();
        const misResenas = todasLasResenas.filter(r => r.id_empleado?._id === user.id || r.id_empleado === user.id);
        setResenas(misResenas);
      }

      if (resEmpleados.ok) {
        const listaEmpleados = await resEmpleados.json();
        const miPerfilCompleto = listaEmpleados.find(e => e._id === user.id);
        if (miPerfilCompleto) {
          setUsuarioActivo(prev => ({
            ...prev, 
            horario_dia: miPerfilCompleto.horario_dia, 
            servicio_empl: miPerfilCompleto.servicio_empl
          }));
        }
      }

    } catch (error) {
      console.error("Error al cargar la información del empleado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('usuario');
    if (!userStr) { navigate('/login'); return; }
    const user = JSON.parse(userStr);
    
    if (user.roles !== 'empleado' || !user.id_negocio) { navigate('/'); return; }

    setUsuarioActivo(user);
    cargarDatosEmpleado(user);
  }, [navigate]);

  // ================= ACCIONES REALES =================
  const handleCompletarCita = async (id_cita) => {
    try {
      const res = await fetch(`http://localhost:5000/api/citas/${id_cita}/completar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol_usuario: usuarioActivo.roles })
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado de la cita.");
      cargarDatosEmpleado(usuarioActivo);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- LÓGICA DE POSTS ---
  const handlePostImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setPostError("Solo se admiten formatos .JPG o .PNG"); e.target.value = null; return;
    }
    setPostError("");
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onloadend = () => setPostImage(reader.result);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault(); setPostError(""); setPostSuccess("");
    if (!newPost.titulo_p || !newPost.contenido) return setPostError("Título y contenido son obligatorios.");
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo_p: newPost.titulo_p, contenido: newPost.contenido, image_url: postImage, id_negocio: negocio._id, rol_usuario: usuarioActivo.roles })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPostSuccess(data.message);
      setNewPost({ titulo_p: '', contenido: '' }); setPostImage("");
      setTimeout(() => {
        setPostSuccess("");
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
        if(modal) modal.hide();
      }, 1500);
    } catch (error) { setPostError(error.message); }
  };

  // ================= CÁLCULO DE JORNADA =================
  const obtenerHorarioHoy = () => {
    if (!usuarioActivo || !usuarioActivo.horario_dia) return "Día libre";
    try {
      const horarioArray = typeof usuarioActivo.horario_dia === 'string' 
        ? JSON.parse(usuarioActivo.horario_dia) 
        : usuarioActivo.horario_dia;

      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const nombreDiaHoy = diasSemana[new Date().getDay()]; // Nos dirá "Lunes", "Martes", etc.
      
      const configHoy = horarioArray.find(d => d.dia.toLowerCase() === nombreDiaHoy.toLowerCase());
      if (configHoy && configHoy.activo) {
        return `${configHoy.entrada} - ${configHoy.salida}`;
      }
      return "Día libre";
    } catch (e) {
      console.error("Error parseando horario:", e);
      return "Día libre";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i key={index} className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted opacity-25'}`}></i>
    ));
  };

  if (loading || !negocio || !usuarioActivo) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const inicialesEmpleado = `${usuarioActivo.nombre.charAt(0)}${usuarioActivo.apellido.charAt(0)}`.toUpperCase();
  const hoyStr = new Date().toISOString().split('T')[0];
  const citasDeHoy = citas.filter(c => c.fecha === hoyStr && c.estado === 'programada');
  const citasCalendario = citas.filter(c => ['programada', 'cancelada', 'completada'].includes(c.estado.toLowerCase()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay });
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <>
      <div className="admin-page-container d-flex w-100" style={{ minHeight: '100vh', '--primary-color': negocio.primaryColor || '#4A0E4E', '--secondary-color': negocio.secondaryColor || '#CFB53B' }}>
        
        {/* ================= SIDEBAR LATERAL ================= */}
        <aside className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
          <div className="sidebar-header">
            <div className="brand d-flex align-items-center text-white">
              <i className="fas fa-gem fa-lg me-2 text-warning" style={{ color: 'var(--secondary-color)' }}></i>
              <div>
                <div className="brand-name text-capitalize">{negocio.nombre}</div>
                <div className="brand-sub" style={{ color: 'var(--secondary-color)' }}>Panel de Equipo</div>
              </div>
            </div>
            <button className="close-sidebar btn border-0 text-white" onClick={() => setSidebarActive(false)}>✕</button>
          </div>
          
          <nav className="nav nav-tabs flex-column border-0 custom-sidebar-nav" role="tablist">
            <div className="nav-label">Módulos</div>
            <button className={`nav-link text-start ${activeTab === 'agenda' ? 'active' : ''}`} onClick={() => setActiveTab('agenda')}>
              <span className="ic"><i className="fas fa-calendar-alt"></i></span> Mi Agenda
            </button>
            <button className={`nav-link text-start mt-2 ${activeTab === 'resenas' ? 'active' : ''}`} onClick={() => setActiveTab('resenas')}>
              <span className="ic"><i className="fas fa-star"></i></span> Ver mis reseñas
            </button>
          </nav>

          <div className="sidebar-footer mt-auto p-3 d-flex align-items-center gap-2">
            <div className="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px', fontSize: '12px' }}>{inicialesEmpleado}</div>
            <div className="text-white text-truncate" style={{ maxWidth: '130px' }}>
              <div className="small fw-bold text-capitalize">{usuarioActivo.nombre}</div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>Especialista</div>
            </div>
          </div>
        </aside>

        <div className={`overlay ${sidebarActive ? 'active' : ''}`} onClick={() => setSidebarActive(false)}></div>

        {/* ================= CONTENEDOR PRINCIPAL ================= */}
        <main className="main w-100 bg-light-custom">
          <header className="topbar shadow-sm bg-white d-flex align-items-center justify-content-between px-4 py-3">
            <div className="d-flex align-items-center">
              <button className="menu-toggle btn border-0 p-0 me-3" onClick={() => setSidebarActive(!sidebarActive)}><i className="fas fa-bars fs-4"></i></button>
              <h5 className="font-playfair fw-bold text-primary-custom m-0">
                {activeTab === 'agenda' ? 'Mi Agenda de Trabajo' : 'Mis Reseñas y Calificaciones'}
              </h5>
            </div>
            
            <button 
              className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center font-dm"
              onClick={() => { localStorage.removeItem('usuario'); localStorage.removeItem('token'); setUsuarioActivo(null); navigate('/'); }}
            >
              <i className="fas fa-sign-out-alt me-2"></i> Salir
            </button>
          </header>

          <div className="content container-fluid py-4 px-4 px-xl-5">
            
            {/* ================= VISTA DE AGENDA ================= */}
            {activeTab === 'agenda' && (
              <div className="animate__animated animate__fadeIn">
                
                {/* BOTÓN FLOTANTE PARA CREAR POST */}
                <div className="d-flex justify-content-end mb-3">
                  <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm font-dm" data-bs-toggle="modal" data-bs-target="#newPostModal">
                    <i className="fas fa-camera me-2"></i> Crear Publicación
                  </button>
                </div>

                {/* TARJETAS DE RESUMEN DIARIO  */}
                <div className="row g-4 mb-5">
                  {/* Tarjeta 1: Bienvenida */}
                  <div className="col-md-4">
                      <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                          <div className="card-body p-4 d-flex align-items-center gap-4">
                              <div className="rounded-circle bg-primary-light text-primary-custom d-flex justify-content-center align-items-center fs-2" style={{ width: '70px', height: '70px' }}>
                                  <i className="fas fa-user-circle"></i>
                              </div>
                              <div>
                                  <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '11px' }}>Bienvenido(a)</span>
                                  <h4 className="fw-bold font-playfair text-dark m-0 mt-1 text-capitalize">{usuarioActivo.nombre} {usuarioActivo.apellido}</h4>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Tarjeta 2: Horario */}
                  <div className="col-md-4">
                      <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                          <div className="card-body p-4 d-flex align-items-center gap-4">
                              <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex justify-content-center align-items-center fs-2" style={{ width: '70px', height: '70px' }}>
                                  <i className="far fa-clock"></i>
                              </div>
                              <div>
                                  <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '11px' }}>Mi Horario Hoy</span>
                                  <h4 className="fw-bold font-dm text-dark m-0 mt-1">{obtenerHorarioHoy()}</h4>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Tarjeta 3: Citas */}
                  <div className="col-md-4">
                      <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                          <div className="card-body p-4 d-flex align-items-center gap-4">
                              <div className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex justify-content-center align-items-center fs-2" style={{ width: '70px', height: '70px' }}>
                                  <i className="fas fa-calendar-day"></i>
                              </div>
                              <div>
                                  <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '11px' }}>Citas Agendadas Hoy</span>
                                  <h4 className="fw-bold font-dm text-dark m-0 mt-1">{citasDeHoy.length} Atenciones</h4>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>

                {/* CALENDARIO MENSUAL */}
                <div className="d-flex justify-content-between align-items-center mb-4 font-dm">
                  <h4 className="font-playfair text-primary-custom fw-bold m-0"><i className="far fa-calendar-alt me-2"></i>Agenda Mensual</h4>
                  <div className="d-flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="btn btn-outline-secondary btn-sm fw-bold"><i className="fas fa-chevron-left"></i></button>
                    <button onClick={() => setCurrentDate(new Date())} className="btn btn-light border btn-sm fw-bold px-3">Hoy</button>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="btn btn-outline-secondary btn-sm fw-bold"><i className="fas fa-chevron-right"></i></button>
                  </div>
                </div>

                <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4 position-relative">
                  <div className="card-header bg-white border-bottom py-3">
                    <h5 className="m-0 font-dm fw-bold text-center text-capitalize text-dark">{monthNames[month]} {year}</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="calendar-grid bg-light p-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                        <div key={d} className="text-center fw-bold small text-muted py-2">{d}</div>
                      ))}
                      
                      {blanks.map((_, i) => <div key={`blank-${i}`} className="cal-day bg-transparent p-2" style={{ height: '110px' }}></div>)}
                      
                      {daysArray.map(day => {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const citasDelDia = citasCalendario.filter(c => c.fecha === dateStr);
                        
                        return (
                          <div 
                            key={day} 
                            className="cal-day bg-white border p-2 text-start overflow-hidden position-relative shadow-sm rounded-3 cursor-pointer" 
                            style={{ height: '110px', transition: 'all 0.2s' }}
                            onClick={() => {
                              setSelectedDateDetails(dateStr);
                              setIsRightSidebarOpen(true);
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                          >
                            <div className={`fw-bold mb-1 small ${dateStr === hoyStr ? 'text-danger bg-danger bg-opacity-10 rounded-circle d-inline-flex justify-content-center align-items-center' : 'text-dark'}`} style={{ width: '24px', height: '24px' }}>{day}</div>
                            <div className="d-flex flex-column gap-1 overflow-y-auto" style={{ maxHeight: '75px' }}>
                              {citasDelDia.map(cita => {
                                let badgeColor = 'bg-primary text-white';
                                if (cita.estado === 'cancelada') badgeColor = 'bg-danger text-white';
                                if (cita.estado === 'completada') badgeColor = 'bg-success text-white';

                                return (
                                  <div key={cita._id} className={`badge w-100 text-start text-truncate shadow-sm ${badgeColor}`} style={{ fontSize: '9px', padding: '4px' }}>
                                    {cita.hora} - {cita.id_cliente?.nombre || 'Cliente'}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= VISTA DE RESEÑAS ================= */}
            {activeTab === 'resenas' && (
              <div className="animate__animated animate__fadeIn">
                <div className="text-center mb-5 mt-4">
                  <h3 className="font-playfair fw-bold text-dark">Lo que dicen tus clientes</h3>
                  <p className="text-muted font-dm">Calificaciones y comentarios de los servicios que has completado.</p>
                </div>

                {resenas.length === 0 ? (
                  <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5 font-dm mx-auto" style={{ maxWidth: '600px' }}>
                    <i className="fas fa-star-half-alt fa-4x text-warning mb-3 opacity-50"></i>
                    <h5 className="fw-bold text-dark font-playfair">Aún no tienes reseñas</h5>
                    <p className="text-muted small">Cuando completes citas, tus clientes podrán calificar tu atención desde su portal. ¡Sigue dando un excelente servicio!</p>
                  </div>
                ) : (
                  <div className="row g-4 font-dm">
                    {resenas.map((resena, index) => (
                      <div className="col-md-6 col-lg-4" key={resena._id || index}>
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="fw-bold text-dark m-0 text-capitalize">{resena.id_cliente?.nombre} {resena.id_cliente?.apellido}</h6>
                              <small className="text-muted" style={{ fontSize: '11px' }}>{resena.fecha}</small>
                            </div>
                            <div className="fs-6">
                              {renderStars(resena.review_stars || 5)}
                            </div>
                          </div>
                          <span className="badge bg-light text-dark border px-2 py-1 mb-3 text-capitalize align-self-start">{resena.id_servicio?.nombre}</span>
                          <p className="text-muted small m-0 fst-italic">"{resena.review_texto || 'Sin comentarios adicionales.'}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= SIDEBAR DERECHO (DETALLES DE AGENDA) ================= */}
            {isRightSidebarOpen && (
              <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 animate__animated animate__fadeIn" style={{ zIndex: 1040 }} onClick={() => setIsRightSidebarOpen(false)}></div>
            )}

            <div className="bg-white shadow-lg h-100 position-fixed top-0 rounded-start-4 font-dm overflow-y-auto" 
                 style={{ width: '380px', zIndex: 1050, right: isRightSidebarOpen ? '0' : '-400px', transition: 'right 0.3s ease-in-out' }}>
              
              <div className="p-4 border-bottom bg-light-custom position-sticky top-0 d-flex justify-content-between align-items-center" style={{ zIndex: 1 }}>
                <h5 className="fw-bold font-playfair m-0 text-primary-custom">
                  <i className="far fa-calendar-check me-2"></i>Mis Citas del Día
                </h5>
                <button className="btn-close shadow-none" onClick={() => setIsRightSidebarOpen(false)}></button>
              </div>

              <div className="p-4">
                <div className="text-center mb-4">
                  <span className="badge bg-dark px-3 py-2 rounded-pill font-monospace" style={{ fontSize: '13px' }}>{selectedDateDetails}</span>
                </div>

                {citasCalendario.filter(c => c.fecha === selectedDateDetails).length === 0 ? (
                  <div className="text-center text-muted small mt-5 pt-5 animate__animated animate__fadeIn">
                    <i className="fas fa-sparkles fa-3x mb-3 text-warning opacity-50"></i>
                    <p className="fw-bold">No tienes labores o citas asignadas para este día.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {citasCalendario.filter(c => c.fecha === selectedDateDetails).map(cita => {
                      let borderClass = 'border-primary';
                      let bgBadge = 'bg-primary';
                      if (cita.estado === 'cancelada') { borderClass = 'border-danger'; bgBadge = 'bg-danger'; }
                      if (cita.estado === 'completada') { borderClass = 'border-success'; bgBadge = 'bg-success'; }

                      return (
                        <div key={cita._id} className={`card border-0 shadow-sm rounded-3 border-start border-4 ${borderClass} animate__animated animate__fadeInUp`}>
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-bold text-dark fs-5">{cita.hora}</span>
                              <span className={`badge ${bgBadge} text-capitalize text-white`}>{cita.estado}</span>
                            </div>
                            <h6 className="fw-bold text-capitalize text-dark mb-1 font-playfair fs-6">{cita.id_servicio?.nombre}</h6>
                            
                            <ul className="list-unstyled small text-muted mb-0 mt-3 border-bottom pb-2">
                              <li className="mb-2"><i className="fas fa-user me-2 text-primary-custom"></i>Cliente: <span className="text-capitalize fw-bold text-dark">{cita.id_cliente?.nombre} {cita.id_cliente?.apellido}</span></li>
                              <li><i className="fas fa-hand-holding-usd me-2 text-success"></i>Valor Servicio: <span className="fw-bold text-dark">${cita.id_servicio?.precio || cita.precio_final}.00 MXN</span></li>
                            </ul>

                            {cita.estado === 'programada' && (
                              <button 
                                className="btn btn-sm btn-success w-100 rounded-pill fw-bold mt-3 py-2 shadow-sm animate__animated animate__pulse animate__infinite"
                                onClick={() => handleCompletarCita(cita._id)}
                              >
                                <i className="fas fa-check-double me-2"></i>Marcar como Completada
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ================= MODAL: NUEVO POST (Novedades) ================= */}
      <div className="modal fade" id="newPostModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-info text-white rounded-top-4 border-0 p-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-bullhorn me-2"></i>Publicar Novedad o Trabajo</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              {postError && <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-exclamation-circle me-2"></i><div className="small fw-bold">{postError}</div></div>}
              {postSuccess && <div className="alert alert-success d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-check-circle me-2"></i><div className="small fw-bold">{postSuccess}</div></div>}
              
              <div className="alert alert-info small border-0 bg-info-subtle text-info-emphasis mb-4 rounded-3 p-3">
                <i className="fas fa-info-circle me-2"></i> Utiliza este espacio para subir fotos de tus mejores cortes o tratamientos al muro del negocio.
              </div>

              <form onSubmit={handleCreatePost}>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Título *</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Ej. ¡Excelente cambio de look!" value={newPost.titulo_p} onChange={(e) => setNewPost({...newPost, titulo_p: e.target.value})} required/>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Descripción del Trabajo *</label>
                  <textarea className="form-control bg-light border-0 shadow-sm" rows="3" placeholder="Describe brevemente el procedimiento..." value={newPost.contenido} onChange={(e) => setNewPost({...newPost, contenido: e.target.value})} required></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Foto (.JPG o .PNG)</label>
                  <input type="file" className="form-control bg-light border-0 shadow-sm" accept=".jpg,.jpeg,.png" onChange={handlePostImage} />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" className="btn btn-info text-white rounded-pill px-4 shadow-sm fw-bold"><i className="fas fa-paper-plane me-2"></i>Publicar Ahora</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}