import React, { useState } from 'react';
import './Empleado.css'; 

export default function Empleado() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  return (
    <div className="admin-page-container d-flex w-100" style={{ minHeight: '100vh' }}>
      
      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="brand d-flex align-items-center text-white">
            <i className="fas fa-gem fa-lg me-2 text-warning" style={{ color: 'var(--secondary-color)' }}></i>
            <div>
              <div className="brand-name">Velvet Staff</div>
              <div className="brand-sub" style={{ color: 'var(--secondary-color)' }}>Panel de Equipo</div>
            </div>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>✕</button>
        </div>
        
        <nav className="nav nav-tabs flex-column border-0 custom-sidebar-nav" role="tablist">
          <div className="nav-label">Módulos</div>
          <button 
            className={`nav-link text-start ${activeTab === 'agenda' ? 'active' : ''}`}
            onClick={() => setActiveTab('agenda')}
          >
            <span className="ic"><i className="fas fa-calendar-check"></i></span> Mi Agenda
          </button>
          <button 
            className={`nav-link text-start ${activeTab === 'resenas' ? 'active' : ''}`}
            onClick={() => setActiveTab('resenas')}
          >
            <span className="ic"><i className="fas fa-star"></i></span> Mis Reseñas
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-dot text-primary-custom bg-white">E</div>
          <div className="user-info text-white">
            <div className="name">Elena Torres</div>
            <div className="role text-white-50">Estilista Senior</div>
          </div>
        </div>
      </aside>

      <div className={`overlay ${sidebarActive ? 'active' : ''}`} onClick={toggleSidebar}></div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main flex-grow-1" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <header className="topbar shadow-sm w-100">
          <button className="menu-toggle btn border-0" onClick={toggleSidebar}><i className="fas fa-bars"></i></button>
          <span className="topbar-title font-playfair fw-bold text-primary-custom d-none d-md-block">Dashboard de Empleado</span>
          <div className="topbar-right ms-auto d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <h6 className="m-0 fw-bold text-dark font-dm small">Glamour Haven</h6>
            </div>
            <img src="https://ui-avatars.com/api/?name=Elena+T&background=random" className="rounded-circle border border-2 shadow-sm" width="40" height="40" alt="Avatar" />
          </div>
        </header>

        <div className="content container-fluid py-4 px-4 px-xl-5 w-100">
          <div className="tab-content w-100" id="employeeTabsContent">
            
            {/* ================= PESTAÑA: MI AGENDA ================= */}
            {activeTab === 'agenda' && (
              <div className="tab-pane fade show active animate__animated animate__fadeIn w-100" id="agenda">
                
                <div className="admin-banner shadow-sm mb-4 text-white d-flex flex-wrap align-items-center w-100">
                  <div className="admin-banner-left d-flex align-items-center gap-4">
                    <img src="https://ui-avatars.com/api/?name=Elena+T&background=random" className="rounded-circle shadow-lg border border-3 border-white" width="80" height="80" alt="Avatar" />
                    <div>
                      <h3 className="font-playfair mb-1 fs-3 fw-bold text-white">Elena Torres</h3>
                      <div className="d-flex flex-wrap gap-2 align-items-center font-dm mt-2">
                        <span className="text-warning small fw-bold"><i className="fas fa-star me-1"></i> 4.8 / 5.0</span>
                        <span className="text-white-50 small">(24 Reseñas)</span>
                        <span className="ms-2 badge bg-white text-dark shadow-sm px-3 py-1 rounded-pill">Corte</span>
                        <span className="badge bg-white text-dark shadow-sm px-3 py-1 rounded-pill">Tinte</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="admin-banner-stats mt-4 mt-md-0 ps-md-4 border-start-md border-light border-opacity-25 font-dm d-flex ms-auto">
                    <div className="px-4 text-center">
                      <h3 className="fw-bold text-white mb-0">5</h3>
                      <small className="text-white-50 text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Citas Hoy</small>
                    </div>
                    <div className="px-4 border-start border-light border-opacity-25 text-center">
                      <h4 className="fw-bold mb-0 text-white mt-1">09:00 - 18:00</h4>
                      <small className="text-white-50 text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Horario de Hoy</small>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4 font-dm align-items-center w-100">
                  <span className="text-muted small fw-bold text-uppercase me-2" style={{ letterSpacing: '1px' }}>Acciones:</span>
                  <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newPostModal">
                    <i className="fas fa-camera"></i> Subir Trabajo a Portafolio
                  </button>
                </div>

                <div className="card detail-card shadow-sm border-0 mb-5 w-100">
                  <div className="card-header bg-white border-bottom py-4 d-flex justify-content-between align-items-center px-4 w-100">
                    <div>
                      <h3 className="font-playfair text-primary-custom mb-0">Mi Agenda Semanal</h3>
                      <p className="font-dm small text-muted mb-0">Haz clic en una cita para ver los detalles del cliente.</p>
                    </div>
                    <div className="d-flex gap-2 font-dm">
                      <button className="btn btn-light btn-sm rounded-circle shadow-sm"><i className="fas fa-chevron-left"></i></button>
                      <div className="bg-light text-dark px-4 py-2 rounded-pill fw-bold border">
                        <i className="fas fa-calendar me-2"></i>Febrero 2024
                      </div>
                      <button className="btn btn-light btn-sm rounded-circle shadow-sm"><i className="fas fa-chevron-right"></i></button>
                    </div>
                  </div>
                  
                  <div className="card-body p-0 font-dm w-100">
                    <div className="table-responsive w-100">
                      <table className="table table-bordered text-center align-middle mb-0 custom-calendar w-100">
                        <thead className="bg-light">
                          <tr>
                            <th className="py-3 text-uppercase small text-muted" style={{ width: '80px' }}>Hora</th>
                            <th className="py-3">Dom 18</th>
                            <th className="py-3">Lun 19</th>
                            <th className="py-3">Mar 20</th>
                            <th className="py-3">Mié 21</th>
                            <th className="py-3">Jue 22</th>
                            <th className="py-3">Vie 23</th>
                            <th className="py-3">Sáb 24</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-muted fw-bold bg-light">09:00</td>
                            <td className="bg-light-stripe text-muted small">DESCANSO</td> 
                            <td className="p-2">
                              <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple" data-bs-toggle="offcanvas" data-bs-target="#appointmentDetails" style={{ cursor: 'pointer' }}>
                                <div className="fw-bold small">Corte de Cabello</div>
                                <div className="xsmall text-muted"><i className="fas fa-user me-1"></i>María Pérez</div>
                              </div>
                            </td>
                            <td></td>
                            <td className="bg-light-stripe text-muted small">DESCANSO</td>
                            <td></td>
                            <td></td>
                            <td className="p-2">
                              <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning" data-bs-toggle="offcanvas" data-bs-target="#appointmentDetails" style={{ cursor: 'pointer' }}>
                                <div className="fw-bold small">Peinado Boda</div>
                                <div className="xsmall text-muted"><i className="fas fa-user me-1"></i>Lucía Garza</div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted fw-bold bg-light">10:00</td>
                            <td className="bg-light-stripe text-muted small">DESCANSO</td>
                            <td></td>
                            <td className="p-2">
                              <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning" data-bs-toggle="offcanvas" data-bs-target="#appointmentDetails" style={{ cursor: 'pointer' }}>
                                <div className="fw-bold small">Tinte Completo</div>
                                <div className="xsmall text-muted"><i className="fas fa-user me-1"></i>Carla Ruiz</div>
                              </div>
                            </td>
                            <td className="bg-light-stripe text-muted small">DESCANSO</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td className="text-muted fw-bold bg-light">13:00</td>
                            <td className="bg-light-stripe text-muted small">DESCANSO</td>
                            <td colSpan={6} className="bg-light text-muted small fw-bold" style={{ verticalAlign: 'middle', backgroundImage: 'none' }}>MI HORA DE COMIDA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= PESTAÑA: MIS RESEÑAS ================= */}
            {activeTab === 'resenas' && (
              <div className="tab-pane fade show active animate__animated animate__fadeIn w-100" id="resenas">
                <div className="card detail-card shadow-sm border-0 mb-5 w-100">
                  <div className="card-header bg-white border-bottom py-4 px-4 d-flex justify-content-between align-items-center w-100">
                    <div>
                      <h3 className="font-playfair text-primary-custom mb-0">Mis Reseñas Recientes</h3>
                      <p className="font-dm small text-muted mb-0">Lo que tus clientes opinan sobre tu trabajo.</p>
                    </div>
                    <div className="text-end">
                      <h3 className="fw-bold text-dark mb-0">4.8 <i className="fas fa-star text-warning small"></i></h3>
                      <small className="text-muted font-dm">Promedio Global</small>
                    </div>
                  </div>
                  
                  <div className="card-body p-4 p-md-5 font-dm bg-light w-100">
                    <div className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle mb-4 w-100">
                      <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
                        <div className="avatar-sm bg-primary-subtle text-primary fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px' }}>M</div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">María Pérez</h6>
                          <div className="text-warning small">
                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm"><i className="fas fa-cut me-2 text-primary-custom"></i>Corte de Cabello</span>
                        </div>
                      </div>
                      <p className="text-muted mb-0 fst-italic">"Elena es increíble. Entendió perfectamente el estilo que estaba buscando y fue súper amable en todo momento."</p>
                      <div className="text-end mt-2"><small className="text-muted">Hace 2 días</small></div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle mb-4 w-100">
                      <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
                        <div className="avatar-sm bg-danger-subtle text-danger fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px' }}>C</div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">Carla Ruiz</h6>
                          <div className="text-warning small">
                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star text-muted"></i>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm"><i className="fas fa-paint-brush me-2 text-primary-custom"></i>Tinte Completo</span>
                        </div>
                      </div>
                      <p className="text-muted mb-0 fst-italic">"Me encantó el color. El único detalle fue que empezamos 10 minutos tarde, pero el resultado del tinte valió la pena por completo. Muy profesional."</p>
                      <div className="text-end mt-2"><small className="text-muted">Hace 1 semana</small></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div> 
        </div> 
      </main>

      {/* ================= OFFCANVAS (SOBREPUESTO / FLOTANTE) ================= */}
      <div className="offcanvas offcanvas-end border-0 shadow-lg custom-offcanvas" tabIndex="-1" id="appointmentDetails" aria-labelledby="appointmentDetailsLabel">
        <div className="offcanvas-header main-header-bg text-white p-4">
          <h5 className="offcanvas-title font-playfair fw-bold fs-4" id="appointmentDetailsLabel"><i className="fas fa-calendar-check me-2"></i>Detalles de Cita</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0 font-dm">
          <div className="p-4 bg-light border-bottom text-center">
            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="fas fa-user fa-3x text-primary-custom"></i>
            </div>
            <h4 className="fw-bold text-dark mb-0">María Pérez</h4>
            <p className="text-muted small mb-3">Cliente Registrado</p>
            <button className="btn btn-outline-success btn-sm rounded-pill px-4 fw-bold"><i className="fab fa-whatsapp me-2"></i>Contactar Cliente</button>
          </div>

          <div className="p-4">
            <h6 className="text-uppercase text-muted small fw-bold mb-3" style={{ letterSpacing: '1px' }}>Información del Servicio</h6>
            
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary-light text-primary-custom rounded-3 p-3 me-3">
                <i className="fas fa-cut fa-lg"></i>
              </div>
              <div>
                <h5 className="font-playfair fw-bold mb-0">Corte de Cabello</h5>
                <p className="text-muted small mb-0">Servicio Estándar</p>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border">
                  <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '10px' }}><i className="far fa-clock me-1"></i>Duración</small>
                  <span className="fw-bold text-dark fs-6">45 Minutos</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border">
                  <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '10px' }}><i className="fas fa-tag me-1"></i>Precio Final</small>
                  <span className="fw-bold text-success fs-6">$350.00 MXN</span>
                </div>
              </div>
              {/* ¡AQUÍ ESTÁ LA FECHA Y HORA RESTAURADA! */}
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border">
                  <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '10px' }}><i className="far fa-calendar-alt me-1"></i>Fecha y Hora</small>
                  <span className="fw-bold text-dark">Lunes 19 Feb, 09:00 AM</span>
                </div>
              </div>
            </div>

            <div className="alert alert-success border-0 bg-success-subtle text-dark-emphasis shadow-sm d-flex align-items-center" role="alert">
              <i className="fas fa-check-circle fa-2x me-3 text-success"></i>
              <small>Esta cita ya ha sido aprobada por el administrador.</small>
            </div>
          </div>
        </div>
        <div className="offcanvas-footer p-4 border-top bg-light font-dm">
          <button className="btn btn-primary w-100 rounded-pill shadow-sm py-3 fw-bold fs-6">Marcar Servicio como Completado</button>
        </div>
      </div>

      {/* ================= MODALES ================= */}
      <div className="modal fade" id="newPostModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title font-playfair fw-bold"><i className="fas fa-camera me-2"></i>Publicar Trabajo</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Título del Post</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Ej. ¡Nuevo corte en tendencia!" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Descripción</label>
                  <textarea className="form-control bg-light border-0" rows="3" placeholder="Describe el trabajo que realizaste..."></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4 font-dm">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">Publicar en Portafolio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}