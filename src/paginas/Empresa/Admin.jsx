import React, { useState } from 'react';
import './Admin.css';

export default function Admin() {
  // --- ESTADOS ---
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState('gestion'); // 'gestion' o 'informacion'
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const [employeeData, setEmployeeData] = useState({
    horario: days.map(d => ({ 
      dia: d, 
      activo: (d !== 'Sábado' && d !== 'Domingo'),
      entrada: '09:00', 
      salida: '18:00' 
    }))
  });

  // --- LÓGICA ---
  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  const handleDayChange = (e) => {
    setSelectedDayIndex(parseInt(e.target.value));
  };

  const updateDayData = (field, value) => {
    const newHorario = [...employeeData.horario];
    newHorario[selectedDayIndex][field] = value;
    setEmployeeData({ ...employeeData, horario: newHorario });
  };

  const timeToDecimal = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':');
    return parseInt(h) + (parseInt(m) / 60);
  };

  const currentDay = employeeData.horario[selectedDayIndex];

  return (
    <>
      <div className="admin-page-container d-flex">
        {/* ================= SIDEBAR ================= */}
        <aside className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
          <div className="sidebar-header">
            <div className="brand d-flex align-items-center text-white">
              <i className="fas fa-gem fa-lg me-2 text-warning" style={{ color: 'var(--secondary-color)' }}></i>
              <div>
                <div className="brand-name">Velvet Admin</div>
                <div className="brand-sub" style={{ color: 'var(--secondary-color)' }}>Panel de Negocio</div>
              </div>
            </div>
            <button className="close-sidebar" onClick={toggleSidebar}>✕</button>
          </div>
          
          <nav className="nav nav-tabs flex-column border-0 custom-sidebar-nav" role="tablist">
            <div className="nav-label">Módulos</div>
            <button 
              className={`nav-link text-start ${activeTab === 'gestion' ? 'active' : ''}`}
              onClick={() => setActiveTab('gestion')}
            >
              <span className="ic"><i className="fas fa-tasks"></i></span> Gestión
            </button>
            <button 
              className={`nav-link text-start ${activeTab === 'informacion' ? 'active' : ''}`}
              onClick={() => setActiveTab('informacion')}
            >
              <span className="ic"><i className="fas fa-calendar-alt"></i></span> Agenda y Equipo
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="user-dot text-primary-custom bg-white">I</div>
            <div className="user-info text-white">
              <div className="name">Isabella M.</div>
              <div className="role text-white-50">Propietaria</div>
            </div>
          </div>
        </aside>

        <div className={`overlay ${sidebarActive ? 'active' : ''}`} onClick={toggleSidebar}></div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="main w-100">
          <header className="topbar shadow-sm">
            <button className="menu-toggle btn border-0" onClick={toggleSidebar}><i className="fas fa-bars"></i></button>
            <span className="topbar-title font-playfair fw-bold text-primary-custom d-none d-md-block">Dashboard General</span>
            <div className="topbar-right ms-auto d-flex align-items-center gap-3">
              <div className="text-end d-none d-sm-block">
                <h6 className="m-0 fw-bold text-dark font-dm small">Glamour Haven</h6>
              </div>
              <img src="https://ui-avatars.com/api/?name=Isabella+M&background=random" className="rounded-circle border border-2 shadow-sm" width="40" height="40" alt="Avatar" />
            </div>
          </header>

          <div className="content container-fluid py-4 px-4 px-xl-5">
            <div className="tab-content" id="adminTabsContent">
              
              {/* ================= PESTAÑA: GESTIÓN ================= */}
              {activeTab === 'gestion' && (
                <div className="tab-pane fade show active animate__animated animate__fadeIn" id="gestion">
                  
                  <div className="admin-banner shadow-sm mb-4 text-white">
                    <div className="admin-banner-left">
                      <div className="detail-avatar bg-white text-primary-custom shadow-lg d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px', fontSize: '28px' }}>I</div>
                      <div>
                        <div className="d-flex align-items-center gap-3 mb-1">
                          <h3 className="font-playfair m-0 fs-3 fw-bold text-white">Isabella Martínez</h3>
                          {/* BOTÓN EDITAR PERFIL ADMIN */}
                          <button className="btn btn-sm btn-light bg-white bg-opacity-25 text-white border-0 rounded-pill px-3 shadow-sm" title="Editar Perfil" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                            <i className="fas fa-user-edit me-2"></i>Editar Perfil
                          </button>
                        </div>
                        <div className="d-flex flex-wrap gap-2 align-items-center font-dm mt-2">
                          <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill"><i className="fas fa-key text-warning me-1"></i> Administrador</span>
                          
                          {/* BOTÓN EDITAR NEGOCIO */}
                          <span className="text-white small d-flex align-items-center bg-dark bg-opacity-25 px-3 py-2 rounded-pill shadow-sm">
                            <i className="fas fa-store me-2"></i> Glamour Haven (Estética)
                            <button className="btn btn-sm text-white bg-white bg-opacity-10 ms-2 rounded-circle" style={{width: '28px', height: '28px', padding: '0'}} title="Editar Negocio" data-bs-toggle="modal" data-bs-target="#editBusinessModal">
                              <i className="fas fa-pencil-alt" style={{fontSize: '12px'}}></i>
                            </button>
                          </span>
                          
                          <span className="text-white font-monospace small bg-dark bg-opacity-25 px-2 py-1 rounded">/estetica/glamour-haven</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-banner-stats mt-4 mt-md-0 ps-md-4 border-start-md border-light border-opacity-25 font-dm">
                      <div className="px-4">
                        <h3 className="fw-bold text-white mb-0">142</h3>
                        <small className="text-white-50 text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Citas</small>
                      </div>
                      <div className="px-4 border-start border-light border-opacity-25">
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>$15k</h3>
                        <small className="text-white-50 text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Ingresos</small>
                      </div>
                      <div className="px-4 border-start border-light border-opacity-25">
                        <h3 className="fw-bold text-white mb-0">8</h3>
                        <small className="text-white-50 text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Personal</small>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-4 font-dm align-items-center">
                    <span className="text-muted small fw-bold text-uppercase me-2" style={{ letterSpacing: '1px' }}>Acciones Rápidas:</span>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newServiceModal">
                      <i className="fas fa-plus-circle"></i> Nuevo Servicio
                    </button>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newEmployeeModal">
                      <i className="fas fa-user-plus"></i> Nuevo Empleado
                    </button>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newPostModal">
                      <i className="fas fa-camera"></i> Crear Post
                    </button>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#manualApptModal">
                      <i className="fas fa-phone-alt"></i> Cita Manual
                    </button>
                    <button className="action-chip danger btn ms-md-auto mt-2 mt-md-0 px-4" data-bs-toggle="modal" data-bs-target="#blockDateModal">
                      <i className="fas fa-ban me-2"></i> Bloquear Fecha Especial
                    </button>
                  </div>

                  <div className="card detail-card shadow-sm border-0 mb-5">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center px-4">
                      <div>
                        <h4 className="font-playfair text-primary-custom m-0">Solicitudes Pendientes</h4>
                        <p className="font-dm small text-muted m-0">Citas web esperando asignación de empleado</p>
                      </div>
                      <span className="badge bg-danger rounded-pill px-3 py-2 shadow-sm font-dm">6 Nuevas</span>
                    </div>
                    
                    <div className="table-responsive font-dm">
                      <table className="table custom-data-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Cliente</th>
                            <th>Servicio Solicitado</th>
                            <th>Fecha y Hora</th>
                            <th>Anticipo (15%)</th>
                            <th style={{ minWidth: '200px' }}>Asignar Profesional</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Fila 1 */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-sm bg-light text-primary-custom fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>M</div>
                                <div>
                                  <div className="fw-bold text-dark">María Pérez</div>
                                  <div className="small text-muted">Cliente Recurrente</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge bg-light text-dark border px-2 py-1">Corte & Estilo</span></td>
                            <td>
                              <div className="fw-semibold text-dark">Jue 22 Feb</div><div className="small text-muted">10:00 AM</div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning"><i className="fas fa-dollar-sign me-1"></i>52.50</span></td>
                            <td>
                              <select className="form-select form-select-sm border border-secondary-subtle shadow-none" defaultValue="0">
                                <option disabled value="0">Seleccionar...</option>
                                <option value="1">Elena Torres</option>
                                <option value="2">Carlos Ruiz</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"><i className="fas fa-check me-1"></i>Aceptar</button>
                               <button className="btn btn-sm btn-outline-danger rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#rejectApptModal">Rechazar</button>
                              </div>
                            </td>
                          </tr>
                          {/* Fila 2 */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-sm bg-light text-primary-custom fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>C</div>
                                <div>
                                  <div className="fw-bold text-dark">Carla Ruiz</div>
                                  <div className="small text-muted">Nuevo Cliente</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge bg-light text-dark border px-2 py-1">Manicura Gelish</span></td>
                            <td>
                              <div className="fw-semibold text-dark">Jue 22 Feb</div><div className="small text-muted">11:30 AM</div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning"><i className="fas fa-dollar-sign me-1"></i>67.50</span></td>
                            <td>
                              <select className="form-select form-select-sm border border-secondary-subtle shadow-none" defaultValue="0">
                                <option disabled value="0">Seleccionar...</option>
                                <option value="3">Ana Méndez</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"><i className="fas fa-check me-1"></i>Aceptar</button>
                               <button className="btn btn-sm btn-outline-danger rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#rejectApptModal">Rechazar</button>
                              </div>
                            </td>
                          </tr>
                          {/* Fila 3 */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-sm bg-light text-primary-custom fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>J</div>
                                <div>
                                  <div className="fw-bold text-dark">Juan Hernández</div>
                                  <div className="small text-muted">Nuevo Cliente</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge bg-light text-dark border px-2 py-1">Barba Clásica</span></td>
                            <td>
                              <div className="fw-semibold text-dark">Vie 23 Feb</div><div className="small text-muted">04:00 PM</div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning"><i className="fas fa-dollar-sign me-1"></i>45.00</span></td>
                            <td>
                              <select className="form-select form-select-sm border border-secondary-subtle shadow-none" defaultValue="0">
                                <option disabled value="0">Seleccionar...</option>
                                <option value="2">Carlos Ruiz</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"><i className="fas fa-check me-1"></i>Aceptar</button>
                                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#rejectApptModal">Rechazar</button>
                              </div>
                            </td>
                          </tr>
                          {/* Fila 4 */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-sm bg-light text-primary-custom fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>S</div>
                                <div>
                                  <div className="fw-bold text-dark">Sofía Mendoza</div>
                                  <div className="small text-muted">Cliente Recurrente</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge bg-light text-dark border px-2 py-1">Maquillaje Social</span></td>
                            <td>
                              <div className="fw-semibold text-dark">Sáb 24 Feb</div><div className="small text-muted">01:00 PM</div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning"><i className="fas fa-dollar-sign me-1"></i>120.00</span></td>
                            <td>
                              <select className="form-select form-select-sm border border-secondary-subtle shadow-none" defaultValue="0">
                                <option disabled value="0">Seleccionar...</option>
                                <option value="1">Elena Torres</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"><i className="fas fa-check me-1"></i>Aceptar</button>
                                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#rejectApptModal">Rechazar</button>
                              </div>
                            </td>
                          </tr>
                          {/* Fila 5 */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-sm bg-light text-primary-custom fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>A</div>
                                <div>
                                  <div className="fw-bold text-dark">Andrea Garza</div>
                                  <div className="small text-muted">Nuevo Cliente</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge bg-light text-dark border px-2 py-1">Pedicure Spa</span></td>
                            <td>
                              <div className="fw-semibold text-dark">Sáb 24 Feb</div><div className="small text-muted">03:30 PM</div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning"><i className="fas fa-dollar-sign me-1"></i>75.00</span></td>
                            <td>
                              <select className="form-select form-select-sm border border-secondary-subtle shadow-none" defaultValue="0">
                                <option disabled value="0">Seleccionar...</option>
                                <option value="3">Ana Méndez</option>
                              </select>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"><i className="fas fa-check me-1"></i>Aceptar</button>
                               <button className="btn btn-sm btn-outline-danger rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#rejectApptModal">Rechazar</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* ================= SECCIÓN: LISTA DE SERVICIOS Y POSTS ================= */}
                  <div className="row mt-4">
                    {/* Tarjeta de Servicios */}
                    <div className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100 rounded-4">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                          <h5 className="font-playfair text-primary-custom m-0"><i className="fas fa-cut me-2"></i>Mis Servicios</h5>
                        </div>
                        <div className="card-body p-0">
                          <ul className="list-group list-group-flush font-dm">
                            {/* Ejemplo de un servicio */}
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom">
                              <div>
                                <h6 className="mb-0 fw-bold text-dark">Corte & Estilo</h6>
                                <small className="text-muted">$350.00 MXN • 45 min</small>
                              </div>
                              {/* BOTÓN ELIMINAR SERVICIO */}
                              <button className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm" title="Eliminar Servicio">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                              <div>
                                <h6 className="mb-0 fw-bold text-dark">Manicura Gelish</h6>
                                <small className="text-muted">$450.00 MXN • 60 min</small>
                              </div>
                              <button className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm" title="Eliminar Servicio">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta de Posts */}
                    <div className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100 rounded-4">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                          <h5 className="font-playfair text-primary-custom m-0"><i className="fas fa-bullhorn me-2"></i>Mis Publicaciones</h5>
                        </div>
                        <div className="card-body p-0">
                          <ul className="list-group list-group-flush font-dm">
                            {/* Ejemplo de un post */}
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom">
                              <div>
                                <h6 className="mb-0 fw-bold text-dark">Tendencias de Verano 2024</h6>
                                <small className="text-muted"><i className="far fa-calendar-alt me-1"></i>Hace 2 días</small>
                              </div>
                              {/* BOTÓN ELIMINAR POST */}
                              <button className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm" title="Eliminar Publicación">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= PESTAÑA: INFORMACIÓN / AGENDA ================= */}
              {activeTab === 'informacion' && (
                <div className="tab-pane fade show active animate__animated animate__fadeIn" id="informacion">
                  <div className="row">
                    <div className="col-12">
                      <div className="card detail-card shadow-sm border-0 mb-5">
                        <div className="card-header main-header-bg text-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="font-playfair text-white mb-0">Agenda Semanal</h3>
                            <p className="font-dm text-white-50 mb-0 small">Visualización completa de citas y empleados asignados</p>
                          </div>
                          <div className="d-flex gap-2 font-dm">
                            <button className="btn btn-light btn-sm rounded-circle"><i className="fas fa-chevron-left"></i></button>
                            <div className="bg-white text-dark px-4 py-2 rounded-pill shadow-sm fw-bold">
                              <i className="fas fa-calendar me-2"></i>Febrero 2024
                            </div>
                            <button className="btn btn-light btn-sm rounded-circle"><i className="fas fa-chevron-right"></i></button>
                          </div>
                        </div>
                        
                        <div className="card-body p-0 font-dm">
                          <div className="table-responsive">
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
                                  <td className="bg-light-stripe text-muted small">CERRADO</td> 
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple">
                                      <div className="fw-bold small">Corte</div>
                                      <div className="xsmall text-muted">Elena T.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-blue text-blue rounded-3 p-2 shadow-sm text-start border-start border-4 border-blue">
                                      <div className="fw-bold small">Uñas</div>
                                      <div className="xsmall text-muted">Ana M.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning">
                                      <div className="fw-bold small">Boda</div>
                                      <div className="xsmall text-muted">Todos</div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">10:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning">
                                      <div className="fw-bold small">Tinte</div>
                                      <div className="xsmall text-muted">Elena T.</div>
                                    </div>
                                  </td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple">
                                      <div className="fw-bold small">Barba</div>
                                      <div className="xsmall text-muted">Carlos</div>
                                    </div>
                                  </td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">11:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td></td>
                                  <td></td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple">
                                      <div className="fw-bold small">Corte</div>
                                      <div className="xsmall text-muted">Elena T.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">12:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-blue text-blue rounded-3 p-2 shadow-sm text-start border-start border-4 border-blue">
                                      <div className="fw-bold small">Manicura</div>
                                      <div className="xsmall text-muted">Ana M.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td></td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning">
                                      <div className="fw-bold small">Retoque</div>
                                      <div className="xsmall text-muted">Elena T.</div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">13:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  {/* AQUÍ SE CORRIGIÓ EL colSpan PARA REACT */}
                                  <td colSpan={6} className="bg-light text-muted small fw-bold" style={{ verticalAlign: 'middle', backgroundImage: 'none' }}>HORA DE COMIDA</td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">14:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple">
                                      <div className="fw-bold small">Barba</div>
                                      <div className="xsmall text-muted">Carlos</div>
                                    </div>
                                  </td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-blue text-blue rounded-3 p-2 shadow-sm text-start border-start border-4 border-blue">
                                      <div className="fw-bold small">Acrílico</div>
                                      <div className="xsmall text-muted">Ana M.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">15:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning">
                                      <div className="fw-bold small">Tinte Comp.</div>
                                      <div className="xsmall text-muted">Elena T.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td></td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple">
                                      <div className="fw-bold small">Corte</div>
                                      <div className="xsmall text-muted">Carlos</div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">16:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td></td>
                                  <td></td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-blue text-blue rounded-3 p-2 shadow-sm text-start border-start border-4 border-blue">
                                      <div className="fw-bold small">Retiro Gel</div>
                                      <div className="xsmall text-muted">Ana M.</div>
                                    </div>
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">17:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-purple text-purple rounded-3 p-2 shadow-sm text-start border-start border-4 border-purple">
                                      <div className="fw-bold small">Corte</div>
                                      <div className="xsmall text-muted">Elena T.</div>
                                    </div>
                                  </td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td></td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-blue text-blue rounded-3 p-2 shadow-sm text-start border-start border-4 border-blue">
                                      <div className="fw-bold small">Maquillaje</div>
                                      <div className="xsmall text-muted">Sofia</div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted fw-bold bg-light">18:00</td>
                                  <td className="bg-light-stripe text-muted small">CERRADO</td>
                                  <td></td>
                                  <td></td>
                                  <td className="bg-light-stripe text-muted small">DESC.</td>
                                  <td></td>
                                  <td className="p-2">
                                    <div className="appt-pill bg-soft-gold text-dark rounded-3 p-2 shadow-sm text-start border-start border-4 border-warning">
                                      <div className="fw-bold small">Corte</div>
                                      <div className="xsmall text-muted">Carlos</div>
                                    </div>
                                  </td>
                                  <td></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="card-footer bg-white border-top py-4 px-4">
                          <h6 className="font-dm text-primary-custom mb-3 text-uppercase small fw-bold">Equipo de Trabajo Activo</h6>
                          <div className="d-flex gap-4 overflow-auto pb-2 font-dm">
                            <div className="d-flex align-items-center gap-3 pe-4 border-end">
                              <img src="https://ui-avatars.com/api/?name=Elena+T&background=random" className="rounded-circle shadow-sm" width="45" alt="Avatar" />
                              <div>
                                <h6 className="fw-bold m-0 text-dark">Elena Torres</h6>
                                <small className="text-muted">Estilista Senior</small>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 pe-4 border-end">
                              <img src="https://ui-avatars.com/api/?name=Carlos+R&background=random" className="rounded-circle shadow-sm" width="45" alt="Avatar" />
                              <div>
                                <h6 className="fw-bold m-0 text-dark">Carlos Ruiz</h6>
                                <small className="text-muted">Barbero</small>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                              <img src="https://ui-avatars.com/api/?name=Ana+M&background=random" className="rounded-circle shadow-sm" width="45" alt="Avatar" />
                              <div>
                                <h6 className="fw-bold m-0 text-dark">Ana Méndez</h6>
                                <small className="text-muted">Manicurista</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> 
          </div> 
        </main>
      </div>

      {/* ================= MODALES ================= */}
      
      {/* 1. MODAL: REGISTRAR EMPLEADO */}
      <div className="modal fade" id="newEmployeeModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            <div className="modal-header bg-primary text-white border-0 flex-column align-items-start p-4">
              <div className="d-flex justify-content-between w-100 mb-3">
                <h5 className="modal-title fw-bold" id="empModalTitle"><i className="fas fa-user-plus me-2"></i>Registrar Profesional</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="w-100">
                <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-bar bg-white rounded-pill" style={{ width: currentStep === 1 ? '50%' : '100%' }}></div>
                </div>
                <div className="d-flex justify-content-between mt-2 text-white-50 small fw-bold" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <span className={currentStep === 1 ? 'text-white' : ''}>1. Perfil y Servicios</span>
                  <span className={currentStep === 2 ? 'text-white' : ''}>2. Horario Visual</span>
                </div>
              </div>
            </div>

            <div className="modal-body p-0 font-dm">
              {currentStep === 1 ? (
                <div id="emp-step-1" className="p-4 p-md-5 animate__animated animate__fadeIn">
                  <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2">Datos Personales y Acceso</h6>
                  
                  {/* Fila 1: Nombre y Apellido */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Nombres <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0" placeholder="Ej. Elena" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Apellidos <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0" placeholder="Ej. Torres" />
                    </div>
                  </div>

                  {/* Fila 2: Correo y Contraseña */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Correo Electrónico <span className="text-danger">*</span></label>
                      <input type="email" className="form-control bg-light border-0" placeholder="empleado@velvetmatch.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Contraseña Provisional <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0" placeholder="Mínimo 8 caracteres" />
                    </div>
                  </div>

                  {/* Fila 3: Fecha de Nacimiento */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Fecha de Nacimiento <span className="text-danger">*</span></label>
                      <input type="date" className="form-control bg-light border-0" />
                    </div>
                  </div>

                  <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-2">Especialidades</h6>
                  <div className="row px-2">
                    <div className="col-6 col-md-4 mb-2"><div className="form-check"><input className="form-check-input" type="checkbox" /><label className="form-check-label small">Corte</label></div></div>
                    <div className="col-6 col-md-4 mb-2"><div className="form-check"><input className="form-check-input" type="checkbox" /><label className="form-check-label small">Tinte</label></div></div>
                    <div className="col-6 col-md-4 mb-2"><div className="form-check"><input className="form-check-input" type="checkbox" /><label className="form-check-label small">Manicura</label></div></div>
                  </div>
                </div>
              ) : (
                <div id="emp-step-2" className="p-4 p-md-5 animate__animated animate__fadeInRight">
                  <div className="mb-5">
                    <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 text-center">Edición de Jornada (00:00 - 24:00)</h6>
                    <div className="d-flex mx-auto" style={{ height: '220px', maxWidth: '580px' }}>
                      <div className="d-flex flex-column justify-content-between text-muted fw-bold pe-2 text-end" style={{ width: '40px', fontSize: '10px', paddingBottom: '26px', paddingTop: '4px' }}>
                        <span>24h</span><span>18h</span><span>12h</span><span>06h</span><span>00h</span>
                      </div>
                      <div id="vertical-chart" className="d-flex justify-content-between flex-grow-1 h-100 position-relative" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.04) 24px, rgba(0,0,0,0.04) 25px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        {employeeData.horario.map((item, index) => {
                          const isSelected = index === selectedDayIndex;
                          const startDec = timeToDecimal(item.entrada);
                          const endDec = timeToDecimal(item.salida);
                          let heightPct = ((endDec - startDec) / 24) * 100;
                          let bottomPct = (startDec / 24) * 100;
                          if (heightPct < 0) heightPct = 0;

                          return (
                            <div key={index} className="d-flex flex-column align-items-center h-100 cursor-pointer" style={{ width: '12%' }} onClick={() => setSelectedDayIndex(index)}>
                              <div className="w-75 flex-grow-1 position-relative d-flex align-items-end justify-content-center mb-2" style={{ backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '8px' }}>
                                {item.activo ? (
                                  <div className="w-100 position-absolute" style={{ backgroundColor: isSelected ? 'var(--secondary-color)' : 'var(--primary-color)', opacity: isSelected ? '1' : '0.8', height: `${heightPct}%`, bottom: `${bottomPct}%`, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>
                                ) : (
                                  <div className="bg-secondary bg-opacity-25 w-100" style={{ height: '12px', borderRadius: '4px' }}></div>
                                )}
                              </div>
                              <span className={`small fw-bold ${isSelected ? 'text-primary-custom' : 'text-muted'}`} style={{ fontSize: '11px' }}>{item.dia.substring(0,3)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-light rounded-4 p-4 shadow-sm border border-light-subtle max-w-600 mx-auto">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-4">
                        <label className="form-label fw-bold small text-primary-custom">Seleccionar Día</label>
                        <select className="form-select border-secondary-subtle fw-bold" value={selectedDayIndex} onChange={handleDayChange}>
                          {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                      </div>
                      <div className="col-md-2 text-center pb-2">
                        <div className="form-check form-switch d-inline-block">
                          <input className="form-check-input cursor-pointer" type="checkbox" checked={currentDay.activo} onChange={(e) => updateDayData('activo', e.target.checked)} />
                          <label className="form-check-label fw-bold small">Activo</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold small text-muted">Entrada</label>
                        <input type="time" className="form-control border-0 shadow-sm" value={currentDay.entrada} disabled={!currentDay.activo} onChange={(e) => updateDayData('entrada', e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold small text-muted">Salida</label>
                        <input type="time" className="form-control border-0 shadow-sm" value={currentDay.salida} disabled={!currentDay.activo} onChange={(e) => updateDayData('salida', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-0 p-4 pt-0">
              <button className={`btn btn-light rounded-pill px-4 fw-bold ${currentStep === 1 ? 'd-none' : ''}`} onClick={() => setCurrentStep(1)}>Atrás</button>
              <button className={`btn btn-${currentStep === 1 ? 'primary' : 'success'} rounded-pill px-5 shadow-sm fw-bold ms-auto`} onClick={() => currentStep === 1 ? setCurrentStep(2) : alert("Empleado Guardado")}>
                {currentStep === 1 ? 'Continuar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MODAL: NUEVO SERVICIO */}
      <div className="modal fade" id="newServiceModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-magic me-2"></i>Crear Nuevo Servicio</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Nombre del Servicio</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Ej. Depilación Láser" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Precio ($)</label>
                    <input type="number" className="form-control bg-light border-0" placeholder="0.00" />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Duración (min)</label>
                    <input type="number" className="form-control bg-light border-0" placeholder="30" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Descripción</label>
                  <textarea className="form-control bg-light border-0" rows="3" placeholder="Detalles del servicio..."></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Imagen (URL)</label>
                  <input type="url" className="form-control bg-light border-0" placeholder="https://..." />
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">Guardar Servicio</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL: CREAR POST */}
      <div className="modal fade" id="newPostModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-info text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-bullhorn me-2"></i>Publicar Novedad</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Título</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Ej. ¡Promoción de Verano!" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Contenido</label>
                  <textarea className="form-control bg-light border-0" rows="4" placeholder="Escribe aquí lo que verán tus clientes..."></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Multimedia</label>
                  <div className="border-2 border-dashed border-secondary-subtle rounded-3 p-4 text-center bg-light cursor-pointer">
                    <i className="fas fa-cloud-upload-alt fs-2 text-muted mb-2"></i>
                    <p className="small text-muted mb-0">Arrastra una imagen o video aquí</p>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-info text-white rounded-pill px-4 shadow-sm fw-bold">Publicar Ahora</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: CITA MANUAL */}
      <div className="modal fade" id="manualApptModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-success text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-phone-alt me-2"></i>Cita Telefónica</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Nombre del Cliente</label>
                  <input type="text" className="form-control bg-light border-0" placeholder="Ej. Juan Pérez" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Fecha</label>
                    <input type="date" className="form-control bg-light border-0" />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Hora</label>
                    <input type="time" className="form-control bg-light border-0" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Servicio</label>
                  <select className="form-select bg-light border-0" defaultValue="0">
                    <option disabled value="0">Seleccionar...</option>
                    <option value="1">Corte</option>
                    <option value="2">Manicura</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-success rounded-pill px-4 shadow-sm fw-bold">Agendar Cita</button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL: BLOQUEAR FECHA */}
      <div className="modal fade" id="blockDateModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-danger text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-ban me-2"></i>Cerrar Día</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <p className="small text-muted mb-3">Nadie podrá agendar citas en este día.</p>
              <div className="mb-3">
                <label className="form-label fw-bold small text-danger text-uppercase">Fecha a Bloquear</label>
                <input type="date" className="form-control bg-light border-0" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase">Motivo del Cierre</label>
                <textarea className="form-control bg-light border-0" rows="2" placeholder="Ej. Día Festivo, Mantenimiento, Vacaciones..."></textarea>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill w-100 mb-2 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger rounded-pill w-100 shadow-sm fw-bold">Confirmar Bloqueo</button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MODAL: RECHAZAR CITA */}
      <div className="modal fade" id="rejectApptModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-danger text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-times-circle me-2"></i>Rechazar Cita</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <p className="text-muted small mb-4">Por favor, indica el motivo por el cual no puedes aceptar esta cita. Esta información se le mostrará al cliente en su perfil para que pueda reagendar.</p>
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Motivo del Rechazo <span className="text-danger">*</span></label>
                  <textarea className="form-control bg-light border-0 shadow-sm" rows="3" placeholder="Ej. Lo sentimos, no contamos con disponibilidad de personal en ese horario..."></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger rounded-pill px-4 shadow-sm fw-bold" data-bs-dismiss="modal">Confirmar Rechazo</button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. MODAL: EDITAR PERFIL ADMIN */}
      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-user-edit me-2"></i>Editar Mi Perfil</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 font-dm">
              <form>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Nombres</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" defaultValue="Isabella" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Apellidos</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" defaultValue="Martínez" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Correo Electrónico</label>
                  <input type="email" className="form-control bg-light border-0 shadow-sm" defaultValue="admin@glamourhaven.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Fecha de Nacimiento</label>
                  <input type="date" className="form-control bg-light border-0 shadow-sm" defaultValue="1995-08-15" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Nueva Contraseña</label>
                  <input type="password" className="form-control bg-light border-0 shadow-sm" placeholder="Dejar en blanco para no cambiarla" />
                  <small className="text-muted" style={{ fontSize: '11px' }}>* Solo llena este campo si deseas actualizar tu contraseña actual.</small>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">Actualizar Perfil</button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. MODAL: EDITAR NEGOCIO */}
      <div className="modal fade" id="editBusinessModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-dark text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-store me-2"></i>Ajustes del Negocio</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 p-md-5 font-dm">
              <form>
                {/* Sección 1: Información Básica */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2">Información Principal</h6>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Nombre del Negocio</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" defaultValue="Glamour Haven" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Eslogan</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" defaultValue="Tu mejor versión comienza aquí" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Descripción Corta</label>
                  <textarea className="form-control bg-light border-0 shadow-sm" rows="2" defaultValue="Expertos en resaltar tu belleza natural con servicios de alta calidad."></textarea>
                </div>

                {/* Sección 2: Contacto */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-4">Contacto y Ubicación</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Celular / Teléfono</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-light border-0"><i className="fas fa-phone text-muted"></i></span>
                      <input type="text" className="form-control bg-light border-0" defaultValue="5551234567" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Dirección Completa</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-light border-0"><i className="fas fa-map-marker-alt text-muted"></i></span>
                      <input type="text" className="form-control bg-light border-0" defaultValue="Av. Principal 123, Centro" />
                    </div>
                  </div>
                </div>

                {/* Sección 3: Redes y Multimedia */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-4">Identidad y Redes Sociales</h6>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Instagram (URL o Usuario)</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" placeholder="@glamour_haven" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Facebook (URL o Usuario)</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" placeholder="/GlamourHaven" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Banner de Portada (URL)</label>
                  <input type="url" className="form-control bg-light border-0 shadow-sm" placeholder="https://ejemplo.com/imagen.jpg" />
                </div>

                {/* Sección 4: Colores y Pagos */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-4">Configuración del Sistema</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Color Primario</label>
                    <div className="d-flex align-items-center gap-2">
                      <input type="color" className="form-control form-control-color border-0 p-0 shadow-sm" defaultValue="#4A0E4E" style={{ width: '40px', height: '40px' }} />
                      <span className="small text-muted font-monospace">#4A0E4E</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Color Secundario</label>
                    <div className="d-flex align-items-center gap-2">
                      <input type="color" className="form-control form-control-color border-0 p-0 shadow-sm" defaultValue="#CFB53B" style={{ width: '40px', height: '40px' }} />
                      <span className="small text-muted font-monospace">#CFB53B</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Anticipo Citas (%)</label>
                    <div className="input-group shadow-sm rounded-3">
                      <input type="number" className="form-control bg-light border-0" defaultValue="15" min="0" max="100" />
                      <span className="input-group-text bg-light border-0">%</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-dark rounded-pill px-4 shadow-sm fw-bold">Guardar Negocio</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}