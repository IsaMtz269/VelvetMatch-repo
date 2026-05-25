import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();

  // ================= ESTADOS DE DATOS =================
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= ESTADOS DE GESTIÓN DE CITAS =================
  const [asignaciones, setAsignaciones] = useState({}); // { citaId: empleadoId }
  const [citaRechazarId, setCitaRechazarId] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // ================= ESTADOS PARA FORMULARIOS (MODALES) =================
  const [editBusiness, setEditBusiness] = useState({}); 

  const [newService, setNewService] = useState({ nombre: '', precio: '', duracion: '', descripcion: '' });
  const [serviceImage, setServiceImage] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [serviceSuccess, setServiceSuccess] = useState("");

  const [newEmployee, setNewEmployee] = useState({ nombre: '', apellido: '', email: '', password: '', fechNacimiento: '', serviciosSeleccionados: [] });
  const [employeeError, setEmployeeError] = useState("");
  const [employeeSuccess, setEmployeeSuccess] = useState("");
  const [employeeStep, setEmployeeStep] = useState(1);

  const [newPost, setNewPost] = useState({ titulo_p: '', contenido: '' });
  const [postImage, setPostImage] = useState("");
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");

  const [blockDate, setBlockDate] = useState({ fecha_f: '', razon_f: '' });
  const [blockDateError, setBlockDateError] = useState("");
  const [blockDateSuccess, setBlockDateSuccess] = useState("");

  // ================= ESTADOS DE UI =================
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState('gestion'); 
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const [employeeData, setEmployeeData] = useState({
    horario: days.map(d => ({ dia: d, activo: (d !== 'Sábado' && d !== 'Domingo'), entrada: '09:00', salida: '18:00' }))
  });

  // ================= FUNCIONES AUXILIARES =================
  const getContrastColor = (hexcolor) => {
    if (!hexcolor) return '#ffffff';
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16), g = parseInt(hexcolor.substr(2, 2), 16), b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#2a0020' : '#ffffff';
  };

  const timeToDecimal = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':');
    return parseInt(h) + (parseInt(m) / 60);
  };

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const handleDayChange = (e) => setSelectedDayIndex(parseInt(e.target.value));

  const updateDayData = (field, value) => {
    const newHorario = [...employeeData.horario];
    newHorario[selectedDayIndex][field] = value;
    setEmployeeData({ ...employeeData, horario: newHorario });
  };

  const toggleServiceSelection = (serviceId) => {
    setNewEmployee(prev => {
      if (prev.serviciosSeleccionados.includes(serviceId)) {
        return { ...prev, serviciosSeleccionados: prev.serviciosSeleccionados.filter(id => id !== serviceId) };
      } else {
        return { ...prev, serviciosSeleccionados: [...prev.serviciosSeleccionados, serviceId] };
      }
    });
  };

  // ================= CARGA DE DATOS =================
  const cargarDatosPrincipales = async (user) => {
    try {
      const [resNeg, resServ, resCitas, resEmp, resPost] = await Promise.all([
        fetch(`http://localhost:5000/api/negocios/${user.id_negocio}`),
        fetch(`http://localhost:5000/api/servicios/negocio/${user.id_negocio}`),
        fetch(`http://localhost:5000/api/citas/negocio/${user.id_negocio}`),
        fetch(`http://localhost:5000/api/usuarios/empleados/negocio/${user.id_negocio}`),
        fetch(`http://localhost:5000/api/posts/negocio/${user.id_negocio}`)
      ]);

      if (resNeg.ok) {
          const dataNegocio = await resNeg.json();
          setNegocio(dataNegocio); 
      }
      if (resServ.ok) setServicios(await resServ.json());
      if (resCitas.ok) setCitas(await resCitas.json());
      if (resEmp.ok) setEmpleados(await resEmp.json());
      if (resPost.ok) setPosts(await resPost.json());

    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('usuario');
    if (!userStr) { navigate('/login'); return; }
    const user = JSON.parse(userStr);
    if ((user.roles !== 'admin' && user.roles !== 'superadmin') || !user.id_negocio) { navigate('/'); return; }
    
    setUsuarioActivo(user);
    cargarDatosPrincipales(user);
  }, [navigate]);

  // ================= LÓGICAS DE CITAS =================
  const handleAceptarCita = async (id_cita) => {
    const empleadoSeleccionado = asignaciones[id_cita];
    if (!empleadoSeleccionado) return alert("Por favor, selecciona un profesional de la lista antes de aceptar la cita.");
    try {
      const res = await fetch(`http://localhost:5000/api/citas/${id_cita}/aceptar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_empleado: empleadoSeleccionado, rol_usuario: usuarioActivo.roles })
      });
      if (!res.ok) throw new Error("Error al aceptar la cita");
      cargarDatosPrincipales(usuarioActivo);
    } catch (err) { alert(err.message); }
  };

  const handleRechazarCita = async () => {
    if (!motivoRechazo) return alert("Debes escribir un motivo de rechazo.");
    try {
      const res = await fetch(`http://localhost:5000/api/citas/${citaRechazarId}/rechazar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo_rechazo: motivoRechazo, rol_usuario: usuarioActivo.roles })
      });
      if (!res.ok) throw new Error("Error al rechazar");
      setMotivoRechazo("");
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('rejectApptModal'));
      if (modal) modal.hide();
      cargarDatosPrincipales(usuarioActivo);
    } catch (err) { alert(err.message); }
  };

  const handleUpdateBusiness = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/negocios/${negocio._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBusiness)
      });
      if (!res.ok) throw new Error("Error al guardar los ajustes");
      cargarDatosPrincipales(usuarioActivo);
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('editBusinessModal'));
      if (modal) modal.hide();
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= LÓGICAS DE CREACIÓN (MODALES) =================
  // 1. Servicio
  const handleServiceImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setServiceError("Solo se admiten formatos .JPG o .PNG"); e.target.value = null; return;
    }
    setServiceError("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setServiceImage(reader.result);
  };

  const handleCreateService = async (e) => {
    e.preventDefault(); setServiceError(""); setServiceSuccess("");
    if (!newService.nombre || !newService.precio || !newService.duracion) return setServiceError("Completa los campos obligatorios.");
    try {
      const res = await fetch('http://localhost:5000/api/servicios', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newService, imagen: serviceImage, id_negocio: negocio._id, rol_usuario: usuarioActivo.roles })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setServiceSuccess(data.message);
      setNewService({ nombre: '', precio: '', duracion: '', descripcion: '' }); setServiceImage("");
      setTimeout(() => {
        setServiceSuccess("");
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('newServiceModal'));
        if(modal) modal.hide();
        cargarDatosPrincipales(usuarioActivo);
      }, 1500);
    } catch (error) { setServiceError(error.message); }
  };

  const handleDeleteService = async (idServicio) => {
    const citasActivas = citas.filter(c => 
      (c.id_servicio?._id === idServicio || c.id_servicio === idServicio) && 
      (c.estado === 'pendiente' || c.estado === 'programada')
    );

    if (citasActivas.length > 0) {
      return alert("❌ No se puede eliminar: Tienes citas pendientes o programadas para este servicio.");
    }

    const empleadosAsignados = empleados.filter(e => 
      e.servicio_empl && e.servicio_empl.includes(idServicio)
    );

    if (empleadosAsignados.length > 0) {
      return alert("❌ No se puede eliminar: Hay empleados asignados a este servicio. Desasígnalo de su perfil primero.");
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este servicio de forma permanente?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/servicios/${idServicio}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      cargarDatosPrincipales(usuarioActivo);
      alert("✅ " + data.message); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

// 2. Empleado

    const handleCreateEmployee = async (e) => {
    e.preventDefault(); setEmployeeError(""); setEmployeeSuccess("");
    const diasActivos = employeeData.horario.filter(d => d.activo);
    if (diasActivos.length === 0) return setEmployeeError("El empleado debe tener al menos un día activo.");
    try {
      const res = await fetch('http://localhost:5000/api/usuarios/empleados', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployee, id_negocio: negocio._id, rol_usuario: usuarioActivo.roles,
          servicio_empl: newEmployee.serviciosSeleccionados, horario_dia: JSON.stringify(employeeData.horario)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEmployeeSuccess(data.message);
      setNewEmployee({ nombre: '', apellido: '', email: '', password: '', fechNacimiento: '', serviciosSeleccionados: [] });
      setTimeout(() => {
        setEmployeeSuccess(""); setEmployeeStep(1);
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('newEmployeeModal'));
        if(modal) modal.hide();
        cargarDatosPrincipales(usuarioActivo);
      }, 1500);
    } catch (error) { setEmployeeError(error.message); }
  };

  const handleNextEmployeeStep = () => {
    setEmployeeError("");
    console.log("Cambiando a paso 2..."); 
    
    if (!newEmployee.nombre || !newEmployee.apellido || !newEmployee.email || !newEmployee.password || !newEmployee.fechNacimiento) {
      return setEmployeeError("Por favor completa todos los datos personales.");
    }
    
    if (newEmployee.password.length < 8) return setEmployeeError("La contraseña debe tener al menos 8 caracteres.");
    
    // Validación de edad
    const hoy = new Date(); 
    const cumpleanos = new Date(newEmployee.fechNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) edad--;
    if (edad < 16) return setEmployeeError("El empleado debe ser mayor de 16 años.");
    
    if (newEmployee.serviciosSeleccionados.length === 0) return setEmployeeError("Debes asignar al menos una especialidad.");
    
    setEmployeeStep(2); // ¡Aquí es donde ocurre la magia!
  };


  // 3. Post
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
        cargarDatosPrincipales(usuarioActivo);
      }, 1500);
    } catch (error) { setPostError(error.message); }
  };

  const handleDeletePost = async (idPost) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${idPost}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Error al eliminar la publicación");
      
      cargarDatosPrincipales(usuarioActivo);
      alert("✅ " + data.message); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 4. Bloquear Fecha
  const handleBlockDate = async (e) => {
    e.preventDefault(); setBlockDateError(""); setBlockDateSuccess("");
    if (!blockDate.fecha_f || !blockDate.razon_f) return setBlockDateError("Completa la fecha y la razón.");
    
    const fechaBloqueo = new Date(blockDate.fecha_f + 'T00:00:00');
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    if (fechaBloqueo < hoy) return setBlockDateError("No puedes bloquear fechas del pasado.");

    const citasPendientesEseDia = citas.filter(c => c.fecha === blockDate.fecha_f && c.estado !== 'cancelada' && c.estado !== 'rechazada');
    if (citasPendientesEseDia.length > 0) return setBlockDateError(`Tienes ${citasPendientesEseDia.length} cita(s) pendiente(s) o programada(s).`);

    try {
      const res = await fetch('http://localhost:5000/api/fechas-prohibidas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha_f: blockDate.fecha_f, razon_f: blockDate.razon_f, id_negocio: negocio._id, rol_usuario: usuarioActivo.roles })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBlockDateSuccess(data.message);
      setBlockDate({ fecha_f: '', razon_f: '' });
      setTimeout(() => {
        setBlockDateSuccess("");
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('blockDateModal'));
        if(modal) modal.hide();
      }, 1500);
    } catch (error) { setBlockDateError(error.message); }
  };


  if (loading || !negocio || !usuarioActivo) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;
  }

  const inicialesAdmin = `${usuarioActivo.nombre.charAt(0)}${usuarioActivo.apellido.charAt(0)}`.toUpperCase();
  const dynamicTextColor = getContrastColor(negocio.primaryColor);

  const citasPendientes = citas.filter(c => c.estado === 'pendiente');
  const citasProgramadas = citas.filter(c => c.estado === 'programada');
  const ingresosTotales = citas.filter(c => c.estado === 'completada').reduce((acc, curr) => acc + (curr.precio_final || 0), 0);

  // Variables del Calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay });
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <>
      <div className="admin-page-container d-flex" style={{ '--primary-color': negocio.primaryColor || '#4A0E4E', '--secondary-color': negocio.secondaryColor || '#CFB53B', '--text-on-primary': dynamicTextColor }}>
        
        {/* ================= SIDEBAR ================= */}
        <aside className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
          <div className="sidebar-header">
            <div className="brand d-flex align-items-center" style={{ color: 'var(--text-on-primary)' }}>
              <i className="fas fa-gem fa-lg me-2 text-warning" style={{ color: 'var(--secondary-color)' }}></i>
              <div>
                <div className="brand-name text-capitalize" style={{ color: 'var(--text-on-primary)' }}>{negocio.nombre}</div>
                <div className="brand-sub" style={{ color: 'var(--secondary-color)' }}>Panel de Administración</div>
              </div>
            </div>
            <button className="close-sidebar btn border-0" style={{ color: 'var(--text-on-primary)' }} onClick={() => setSidebarActive(!sidebarActive)}>✕</button>
          </div>
          
          <nav className="nav nav-tabs flex-column border-0 custom-sidebar-nav" role="tablist">
            <div className="nav-label" style={{ color: 'var(--text-on-primary)', opacity: 0.7 }}>Módulos</div>
            <button className={`nav-link text-start ${activeTab === 'gestion' ? 'active' : ''}`} onClick={() => setActiveTab('gestion')} style={{ color: activeTab === 'gestion' ? 'var(--text-on-primary)' : `color-mix(in srgb, var(--text-on-primary) 70%, transparent)` }}>
              <span className="ic"><i className="fas fa-tasks"></i></span> Gestión
            </button>
            <button className={`nav-link text-start ${activeTab === 'informacion' ? 'active' : ''}`} onClick={() => setActiveTab('informacion')} style={{ color: activeTab === 'informacion' ? 'var(--text-on-primary)' : `color-mix(in srgb, var(--text-on-primary) 70%, transparent)` }}>
              <span className="ic"><i className="fas fa-calendar-alt"></i></span> Agenda y Equipo
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="user-dot bg-white" style={{ color: 'var(--primary-color)' }}>{inicialesAdmin}</div>
            <div className="user-info" style={{ color: 'var(--text-on-primary)' }}>
              <div className="name text-capitalize">{usuarioActivo.nombre} {usuarioActivo.apellido.charAt(0)}.</div>
              <div className="role" style={{ opacity: 0.8 }}>Propietaria</div>
            </div>
          </div>
        </aside>

        <div className={`overlay ${sidebarActive ? 'active' : ''}`} onClick={() => setSidebarActive(false)}></div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="main w-100">
          <header className="topbar shadow-sm">
            <button className="menu-toggle btn border-0" onClick={() => setSidebarActive(!sidebarActive)}><i className="fas fa-bars"></i></button>
            <span className="topbar-title font-playfair fw-bold text-primary-custom d-none d-md-block">Dashboard General</span>
            <div className="topbar-right ms-auto d-flex align-items-center gap-3">
              <Link to={`/empresa/${negocio._id}`} target="_blank" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold d-none d-md-block" title="Abrir página del negocio en nueva pestaña">
                <i className="fas fa-external-link-alt me-2"></i>Ver mi página
              </Link>
              <div className="text-end d-none d-sm-block ms-2">
                <h6 className="m-0 fw-bold text-dark font-dm small text-capitalize">{negocio.nombre}</h6>
              </div>
              <div className="rounded-circle border border-2 shadow-sm bg-primary-custom d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', color: 'var(--text-on-primary)' }}>
                {inicialesAdmin}
              </div>
            </div>
          </header>

          <div className="content container-fluid py-4 px-4 px-xl-5">
            <div className="tab-content" id="adminTabsContent">
              
              {/* === PESTAÑA: GESTIÓN === */}
              {activeTab === 'gestion' && (
                <div className="tab-pane fade show active animate__animated animate__fadeIn" id="gestion">
                  
                  {/* Banner Dinámico */}
                  <div className="admin-banner shadow-sm mb-4" style={{ color: 'var(--text-on-primary)' }}>
                    <div className="admin-banner-left">
                      <div className="detail-avatar bg-white shadow-lg d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px', fontSize: '28px', color: 'var(--primary-color)' }}>
                        {inicialesAdmin}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-3 mb-1">
                          <h3 className="font-playfair m-0 fs-3 fw-bold text-capitalize">{usuarioActivo.nombre} {usuarioActivo.apellido}</h3>
                        </div>
                        <div className="d-flex flex-wrap gap-2 align-items-center font-dm mt-2">
                          <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill"><i className="fas fa-key text-warning me-1"></i> Administrador</span>
                          <span className="small d-flex align-items-center bg-dark bg-opacity-25 px-3 py-2 rounded-pill shadow-sm" style={{ color: 'var(--text-on-primary)' }}>
                            <i className="fas fa-store me-2"></i> <span className="text-capitalize">{negocio.nombre} ({negocio.tipo})</span>
                            <button className="btn btn-sm bg-white bg-opacity-10 ms-2 rounded-circle" style={{width: '28px', height: '28px', padding: '0', color: 'var(--text-on-primary)'}} data-bs-toggle="modal" data-bs-target="#editBusinessModal">
                              <i className="fas fa-pencil-alt" style={{fontSize: '12px'}}></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="admin-banner-stats mt-4 mt-md-0 ps-md-4 border-start-md border-light border-opacity-25 font-dm">
                      <div className="px-4"><h3 className="fw-bold mb-0">{citas.length}</h3><small className="text-uppercase" style={{ fontSize: '11px', opacity: 0.8 }}>Citas Totales</small></div>
                      <div className="px-4 border-start border-light border-opacity-25"><h3 className="fw-bold mb-0" style={{ color: dynamicTextColor === '#ffffff' ? 'var(--secondary-color)' : 'var(--text-on-primary)' }}>${ingresosTotales}</h3><small className="text-uppercase" style={{ fontSize: '11px', opacity: 0.8 }}>Ingresos</small></div>
                      <div className="px-4 border-start border-light border-opacity-25"><h3 className="fw-bold mb-0">{empleados.length}</h3><small className="text-uppercase" style={{ fontSize: '11px', opacity: 0.8 }}>Personal</small></div>
                    </div>
                  </div>

                  {/* Botones de Acción Rápida */}
                  <div className="d-flex flex-wrap gap-2 mb-4 font-dm align-items-center">
                    <span className="text-muted small fw-bold text-uppercase me-2" style={{ letterSpacing: '1px' }}>Acciones Rápidas:</span>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newServiceModal"><i className="fas fa-plus-circle"></i> Nuevo Servicio</button>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newEmployeeModal"><i className="fas fa-user-plus"></i> Nuevo Empleado</button>
                    <button className="action-chip btn" data-bs-toggle="modal" data-bs-target="#newPostModal"><i className="fas fa-camera"></i> Crear Post</button>
                    <button className="action-chip danger btn ms-md-auto mt-2 mt-md-0 px-4" data-bs-toggle="modal" data-bs-target="#blockDateModal"><i className="fas fa-ban me-2"></i> Bloquear Fecha Especial</button>
                  </div>

                  {/* TABLA DE SOLICITUDES PENDIENTES */}
                  <div className="card detail-card shadow-sm border-0 mb-5">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center px-4">
                      <div><h4 className="font-playfair text-primary-custom m-0">Solicitudes Pendientes</h4><p className="font-dm small text-muted m-0">Citas web esperando asignación de empleado</p></div>
                      {citasPendientes.length > 0 && <span className="badge bg-danger rounded-pill px-3 py-2 shadow-sm font-dm">{citasPendientes.length} Nuevas</span>}
                    </div>
                    {citasPendientes.length === 0 ? (
                      <div className="text-center py-5 font-dm"><i className="fas fa-calendar-check fa-4x text-muted mb-3 opacity-25"></i><h5 className="fw-bold text-dark font-playfair">No hay solicitudes pendientes</h5><p className="text-muted small">Todas las citas han sido gestionadas o aún no tienes nuevas reservaciones.</p></div>
                    ) : (
                      <div className="table-responsive font-dm">
                        <table className="table custom-data-table align-middle mb-0">
                          <thead>
                            <tr><th>Cliente</th><th>Servicio Solicitado</th><th>Fecha y Hora</th><th>Anticipo</th><th style={{ minWidth: '200px' }}>Asignar Profesional</th><th className="text-center">Acciones</th></tr>
                          </thead>
                          <tbody>
                            {citasPendientes.map((cita) => (
                              <tr key={cita._id}>
                                <td>
                                  <div className="d-flex align-items-center gap-3">
                                    <div className="avatar-sm bg-light text-primary-custom fw-bold rounded-circle d-flex justify-content-center align-items-center text-uppercase" style={{ width: '40px', height: '40px' }}>{cita.id_cliente?.nombre?.charAt(0)}</div>
                                    <div><div className="fw-bold text-dark text-capitalize">{cita.id_cliente?.nombre} {cita.id_cliente?.apellido}</div><div className="small text-muted">{cita.id_cliente?.email}</div></div>
                                  </div>
                                </td>
                                <td><span className="badge bg-light text-dark border px-2 py-1 text-capitalize">{cita.id_servicio?.nombre}</span></td>
                                <td><div className="fw-semibold text-dark">{cita.fecha}</div><div className="small text-muted">{cita.hora}</div></td>
                                <td><span className="badge bg-warning-subtle text-warning border border-warning"><i className="fas fa-dollar-sign me-1"></i>{cita.anticipo_pagado || 0}</span></td>
                                <td>
                                  <select className="form-select form-select-sm border border-secondary-subtle shadow-none" value={asignaciones[cita._id] || ""} onChange={(e) => setAsignaciones({...asignaciones, [cita._id]: e.target.value})}>
                                    <option disabled value="">Seleccionar profesional...</option>
                                    {empleados.map(emp => <option key={emp._id} value={emp._id}>{emp.nombre} {emp.apellido}</option>)}
                                  </select>
                                </td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm" onClick={() => handleAceptarCita(cita._id)}><i className="fas fa-check me-1"></i>Aceptar</button>
                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#rejectApptModal" onClick={() => setCitaRechazarId(cita._id)}>Rechazar</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* LISTAS DE SERVICIOS Y POSTS */}
                  <div className="row mt-4">
                    <div className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100 rounded-4">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                          <h5 className="font-playfair text-primary-custom m-0"><i className="fas fa-cut me-2"></i>Mis Servicios</h5>
                        </div>
                        <div className="card-body p-0">
                          <ul className="list-group list-group-flush font-dm">
                            {servicios.length === 0 ? <li className="list-group-item text-center p-4"><span className="text-muted small">No tienes servicios registrados aún.</span></li> : 
                             servicios.map(servicio => (
                               <li key={servicio._id} className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom">
                                 <div><h6 className="mb-0 fw-bold text-dark text-capitalize">{servicio.nombre}</h6><small className="text-muted">${servicio.precio}.00 MXN • {servicio.duracion} min</small></div>
                                <button className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm" title="Eliminar Servicio"onClick={() => handleDeleteService(servicio._id)}> <i className="fas fa-trash-alt"></i> </button>
                               </li>
                             ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100 rounded-4">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                          <h5 className="font-playfair text-primary-custom m-0"><i className="fas fa-bullhorn me-2"></i>Mis Publicaciones</h5>
                        </div>
                        <div className="card-body p-0">
                          <ul className="list-group list-group-flush font-dm">
                            {posts.length === 0 ? <li className="list-group-item text-center p-4"><span className="text-muted small">No has compartido publicaciones.</span></li> :
                             posts.map(post => (
                               <li key={post._id} className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom">
                                 <div><h6 className="mb-0 fw-bold text-dark text-capitalize">{post.titulo_p}</h6><small className="text-muted d-inline-block text-truncate" style={{maxWidth: '250px'}}>{post.contenido}</small></div>
                                 <button className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm" title="Eliminar Post" onClick={() => handleDeletePost(post._id)}> <i className="fas fa-trash-alt"></i></button>
                               </li>
                             ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === PESTAÑA: AGENDA Y EQUIPO (CALENDARIO) === */}
              {activeTab === 'informacion' && (
                <div className="tab-pane fade show active animate__animated animate__fadeIn" id="informacion">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="font-playfair text-primary-custom fw-bold m-0"><i className="fas fa-calendar-check me-2"></i>Mi Agenda</h4>
                    <div className="d-flex gap-2">
                        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="btn btn-outline-secondary btn-sm fw-bold"><i className="fas fa-chevron-left"></i></button>
                        <button onClick={() => setCurrentDate(new Date())} className="btn btn-light border btn-sm fw-bold px-3">Hoy</button>
                        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="btn btn-outline-secondary btn-sm fw-bold"><i className="fas fa-chevron-right"></i></button>
                    </div>
                  </div>

                  <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                      <div className="card-header bg-white border-bottom py-3">
                          <h5 className="m-0 font-dm fw-bold text-center text-capitalize">{monthNames[month]} {year}</h5>
                      </div>
                      <div className="card-body p-0">
                          <div className="calendar-grid bg-light p-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                              {/* Días de la semana */}
                              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                                <div key={d} className="text-center fw-bold small text-muted py-2">{d}</div>
                              ))}
                              
                              {/* Espacios en blanco para alinear el primer día */}
                              {blanks.map((_, i) => <div key={`blank-${i}`} className="cal-day bg-transparent p-2 text-start" style={{ height: '100px' }}></div>)}
                              
                              {/* Días del mes con sus citas */}
                              {daysArray.map(day => {
                                 const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                 const citasDelDia = citasProgramadas.filter(c => c.fecha === dateStr);
                                 
                                 return (
                                   <div key={day} className="cal-day bg-white border p-2 text-start overflow-hidden position-relative shadow-sm rounded-3" style={{ height: '100px' }}>
                                     <div className="fw-bold mb-1">{day}</div>
                                     <div className="d-flex flex-column gap-1 overflow-y-auto" style={{ maxHeight: '70px' }}>
                                       {citasDelDia.map(cita => (
                                         <div key={cita._id} className="badge bg-success w-100 text-start text-truncate text-white" style={{ fontSize: '10px' }} title={`${cita.hora} - ${cita.id_servicio?.nombre} | Cliente: ${cita.id_cliente?.nombre}`}>
                                           <i className="fas fa-cut me-1"></i> {cita.hora} - {cita.id_servicio?.nombre}
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 )
                              })}
                          </div>
                      </div>
                  </div>
                </div>
              )}
            </div> 
          </div> 
        </main>
      </div>

      {/* ================= MODAL: NUEVO SERVICIO ================= */}
      <div className="modal fade" id="newServiceModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-0 bg-light-custom p-4 rounded-top-4">
              <h5 className="modal-title font-playfair fw-bold text-primary-custom"><i className="fas fa-plus-circle me-2"></i>Agregar Nuevo Servicio</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              {serviceError && <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-exclamation-circle me-2"></i><div className="small fw-bold">{serviceError}</div></div>}
              {serviceSuccess && <div className="alert alert-success d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-check-circle me-2"></i><div className="small fw-bold">{serviceSuccess}</div></div>}
              <form onSubmit={handleCreateService}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Nombre del Servicio *</label>
                  <input type="text" className="form-control bg-light border-0 shadow-sm" placeholder="Ej. Corte de Cabello" value={newService.nombre} onChange={(e) => setNewService({...newService, nombre: e.target.value})} />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Precio (MXN) *</label>
                    <div className="input-group shadow-sm"><span className="input-group-text bg-light border-0 text-muted">$</span><input type="text" className="form-control bg-light border-0" placeholder="350" value={newService.precio} onChange={(e) => setNewService({...newService, precio: e.target.value.replace(/\D/g, '')})} /></div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Duración *</label>
                    <div className="input-group shadow-sm"><input type="text" className="form-control bg-light border-0" placeholder="45" value={newService.duracion} onChange={(e) => setNewService({...newService, duracion: e.target.value.replace(/\D/g, '')})} /><span className="input-group-text bg-light border-0 text-muted">min</span></div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Imagen (Opcional)</label>
                  <input type="file" className="form-control bg-light border-0 shadow-sm" accept=".jpg,.jpeg,.png" onChange={handleServiceImage} />
                  <div className="form-text small opacity-75">Solo archivos .JPG o .PNG</div>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Descripción (Opcional)</label>
                  <textarea className="form-control bg-light border-0 shadow-sm" rows="2" placeholder="Describe los beneficios del servicio..." value={newService.descripcion} onChange={(e) => setNewService({...newService, descripcion: e.target.value})}></textarea>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"><i className="fas fa-save me-2"></i>Guardar Servicio</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

     {/* 1. MODAL: REGISTRAR EMPLEADO */}
      <div className="modal fade" id="newEmployeeModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            
            {/* CABECERA DEL MODAL CON BARRA DE PROGRESO */}
            <div className="modal-header bg-primary-custom text-white border-0 flex-column align-items-start p-4" style={{ backgroundColor: 'var(--primary-color)' }}>
              <div className="d-flex justify-content-between w-100 mb-3">
                <h5 className="modal-title fw-bold" id="empModalTitle"><i className="fas fa-user-plus me-2"></i>Registrar Profesional</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setEmployeeStep(1); setEmployeeError(""); }}></button>
              </div>
              <div className="w-100">
                <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-bar bg-white rounded-pill transition-all" style={{ width: employeeStep === 1 ? '50%' : '100%' }}></div>
                </div>
                <div className="d-flex justify-content-between mt-2 small fw-bold" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <span className={employeeStep === 1 ? 'text-white' : 'text-white-50'}>1. Perfil y Servicios</span>
                  <span className={employeeStep === 2 ? 'text-white' : 'text-white-50'}>2. Horario Visual</span>
                </div>
              </div>
            </div>

            <div className="modal-body p-0 font-dm bg-light-custom">
              {/* BANNERS DE ERROR Y ÉXITO FLOTANTES */}
              <div className="px-4 pt-3">
                {employeeError && (
                  <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-0"><i className="fas fa-exclamation-circle me-2"></i><div className="small fw-bold">{employeeError}</div></div>
                )}
                {employeeSuccess && (
                  <div className="alert alert-success d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-0"><i className="fas fa-check-circle me-2"></i><div className="small fw-bold">{employeeSuccess}</div></div>
                )}
              </div>

              {/* ================= PASO 1: DATOS PERSONALES ================= */}
              {employeeStep === 1 && (
                <div className="p-4 p-md-5 animate__animated animate__fadeIn">
                  <h6 className="text-primary-custom fw-bold text-uppercase small mb-4 border-bottom pb-2">Datos de Identidad</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Nombres *</label>
                      <input type="text" className="form-control bg-light border-0 shadow-sm" placeholder="Ej. Elena" value={newEmployee.nombre} 
                        onChange={(e) => setNewEmployee({...newEmployee, nombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} required/>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Apellidos *</label>
                      <input type="text" className="form-control bg-light border-0 shadow-sm" placeholder="Ej. Torres" value={newEmployee.apellido} 
                        onChange={(e) => setNewEmployee({...newEmployee, apellido: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} required/>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Correo *</label>
                      <input type="email" className="form-control bg-light border-0 shadow-sm" placeholder="elena@correo.com" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required/>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Contraseña *</label>
                      <input type="password" className="form-control bg-light border-0 shadow-sm" placeholder="Mínimo 8 caracteres" minLength="8" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} required/>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Nacimiento *</label>
                      <input type="date" className="form-control bg-light border-0 shadow-sm" value={newEmployee.fechNacimiento} onChange={(e) => setNewEmployee({...newEmployee, fechNacimiento: e.target.value})} required/>
                    </div>
                  </div>

                  <h6 className="text-primary-custom fw-bold text-uppercase small mb-4 border-bottom pb-2 mt-4">Especialidades *</h6>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {servicios.length === 0 ? (
                      <div className="alert alert-warning small w-100 py-2 m-0"><i className="fas fa-exclamation-triangle me-2"></i>Debes registrar al menos un servicio en tu panel antes.</div>
                    ) : (
                      servicios.map(servicio => (
                        <div key={servicio._id} className="btn-group" role="group">
                          <input type="checkbox" className="btn-check" id={`svc-${servicio._id}`} 
                            checked={newEmployee.serviciosSeleccionados.includes(servicio._id)}
                            onChange={() => toggleServiceSelection(servicio._id)} autoComplete="off" />
                          <label className="btn btn-outline-primary btn-sm rounded-pill shadow-sm text-capitalize" htmlFor={`svc-${servicio._id}`}>
                            {newEmployee.serviciosSeleccionados.includes(servicio._id) ? <i className="fas fa-check me-1"></i> : <i className="fas fa-plus me-1"></i>} {servicio.nombre}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ================= PASO 2: HORARIO VISUAL DINÁMICO ================= */}
              {employeeStep === 2 && (
                <div className="p-4 p-md-5 animate__animated animate__fadeInRight">
                  
                  {/* GRÁFICA DE BARRAS INVERTIDA */}
                  <div className="mb-5">
                    <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 text-center">Edición de Jornada (00:00 - 24:00)</h6>
                    <div className="d-flex mx-auto" style={{ height: '220px', maxWidth: '580px' }}>
                      
                      {/* Eje Y invertido: 00h arriba y 24h abajo */}
                      <div className="d-flex flex-column justify-content-between text-muted fw-bold pe-2 text-end" style={{ width: '40px', fontSize: '10px', paddingBottom: '26px', paddingTop: '4px' }}>
                        <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>24h</span>
                      </div>
                      
                      {/* Contenedor de las barras */}
                      <div id="vertical-chart" className="d-flex justify-content-between flex-grow-1 h-100 position-relative" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.04) 24px, rgba(0,0,0,0.04) 25px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        
                        {employeeData.horario.map((item, index) => {
                          const isSelected = index === selectedDayIndex;
                          let barContent = null;

                          if (!item.activo) {
                            // Si está inactivo, se dibuja un pequeño bloque en el tope superior (00h)
                            barContent = <div className="bg-secondary bg-opacity-25 w-100" style={{ height: '12px', borderRadius: '4px' }}></div>;
                          } else {
                            const startDec = timeToDecimal(item.entrada);
                            const endDec = timeToDecimal(item.salida);
                            let heightPct = ((endDec - startDec) / 24) * 100;
                            
                            // 👇 TRUCO: Usamos 'top' en lugar de 'bottom' para que baje desde las 00h
                            let topPct = (startDec / 24) * 100; 
                            if (heightPct < 0) heightPct = 0;

                            const color = isSelected ? 'var(--secondary-color)' : 'var(--primary-color)';
                            const opacity = isSelected ? '1' : '0.8';

                            barContent = <div className="w-100 position-absolute transition-all" style={{ backgroundColor: color, opacity: opacity, height: `${heightPct}%`, top: `${topPct}%`, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>;
                          }

                          return (
                            <div key={index} className="d-flex flex-column align-items-center h-100 cursor-pointer" style={{ width: '12%' }} onClick={() => setSelectedDayIndex(index)}>
                              {/* 👇 Cambiamos 'align-items-end' por 'align-items-start' para consistencia */}
                              <div className="w-75 flex-grow-1 position-relative d-flex align-items-start justify-content-center mb-2" style={{ backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '8px' }}>
                                {barContent}
                              </div>
                              <span className={`small fw-bold ${isSelected ? 'text-primary-custom' : 'text-muted'}`} style={{ fontSize: '11px' }}>{item.dia.substring(0,3)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* CONTROLES DEL DÍA SELECCIONADO (Se mantiene igual a lo que tenías) */}
                  <div className="bg-white rounded-4 p-4 shadow-sm border border-light-subtle mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-4">
                        <label className="form-label fw-bold small text-primary-custom text-uppercase">Seleccionar Día</label>
                        <select className="form-select border-secondary-subtle fw-bold bg-light shadow-sm" value={selectedDayIndex} onChange={handleDayChange}>
                          {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                      </div>
                      <div className="col-md-2 text-center pb-2">
                        <div className="form-check form-switch d-inline-block">
                          <input className="form-check-input cursor-pointer shadow-sm" type="checkbox" style={{ transform: 'scale(1.2)' }} checked={employeeData.horario[selectedDayIndex].activo} onChange={(e) => updateDayData('activo', e.target.checked)}/>
                          <label className="form-check-label fw-bold small mt-1">Activo</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold small text-muted text-uppercase">Entrada</label>
                        <input type="time" className="form-control border-0 bg-light shadow-sm fw-bold" value={employeeData.horario[selectedDayIndex].entrada} onChange={(e) => updateDayData('entrada', e.target.value)} disabled={!employeeData.horario[selectedDayIndex].activo}/>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold small text-muted text-uppercase">Salida</label>
                        <input type="time" className="form-control border-0 bg-light shadow-sm fw-bold" value={employeeData.horario[selectedDayIndex].salida} onChange={(e) => updateDayData('salida', e.target.value)} disabled={!employeeData.horario[selectedDayIndex].activo}/>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PIE DEL MODAL (BOTONES DE ACCIÓN) */}
            <div className="modal-footer border-0 p-4 pt-0 bg-light-custom">
              {employeeStep === 1 ? (
                <button className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold ms-auto" onClick={handleNextEmployeeStep}>
                  Continuar <i className="fas fa-arrow-right ms-2"></i>
                </button>
              ) : (
                <>
                  <button className="btn btn-light rounded-pill px-4 fw-bold border shadow-sm" onClick={() => setEmployeeStep(1)}>
                    <i className="fas fa-arrow-left me-2"></i> Atrás
                  </button>
                  <button className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold ms-auto" onClick={handleCreateEmployee}>
                    <i className="fas fa-save me-2"></i> Confirmar y Guardar
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ================= MODAL: NUEVO POST ================= */}
      <div className="modal fade" id="newPostModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-info text-white rounded-top-4 border-0 p-4"><h5 className="modal-title fw-bold font-playfair"><i className="fas fa-bullhorn me-2"></i>Publicar Novedad</h5><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
            <div className="modal-body p-4 font-dm">
              {postError && <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-exclamation-circle me-2"></i><div className="small fw-bold">{postError}</div></div>}
              {postSuccess && <div className="alert alert-success d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-check-circle me-2"></i><div className="small fw-bold">{postSuccess}</div></div>}
              <form onSubmit={handleCreatePost}>
                <div className="mb-3"><label className="form-label fw-bold small text-muted text-uppercase">Título *</label><input type="text" className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Ej. ¡Promoción de Verano!" value={newPost.titulo_p} onChange={(e) => setNewPost({...newPost, titulo_p: e.target.value})} required/></div>
                <div className="mb-4"><label className="form-label fw-bold small text-muted text-uppercase">Contenido *</label><textarea className="form-control bg-light border-0 shadow-sm" rows="4" placeholder="Escribe aquí lo que verán tus clientes..." value={newPost.contenido} onChange={(e) => setNewPost({...newPost, contenido: e.target.value})} required></textarea></div>
                <div className="mb-4"><label className="form-label fw-bold small text-muted text-uppercase">Multimedia (.JPG o .PNG)</label><input type="file" className="form-control bg-light border-0 shadow-sm" accept=".jpg,.jpeg,.png" onChange={handlePostImage} /></div>
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top"><button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" data-bs-dismiss="modal">Cancelar</button><button type="submit" className="btn btn-info text-white rounded-pill px-4 shadow-sm fw-bold"><i className="fas fa-paper-plane me-2"></i>Publicar Ahora</button></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: BLOQUEAR FECHA ================= */}
      <div className="modal fade" id="blockDateModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-danger text-white rounded-top-4 border-0 p-4"><h5 className="modal-title fw-bold font-playfair"><i className="fas fa-ban me-2"></i>Bloquear Fecha Especial</h5><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
            <div className="modal-body p-4 font-dm">
              {blockDateError && <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-exclamation-circle me-2"></i><div className="small fw-bold">{blockDateError}</div></div>}
              {blockDateSuccess && <div className="alert alert-success d-flex align-items-center rounded-3 shadow-sm py-2 px-3 mb-4"><i className="fas fa-check-circle me-2"></i><div className="small fw-bold">{blockDateSuccess}</div></div>}
              <div className="alert alert-warning small border-0 bg-warning-subtle text-dark-emphasis mb-4 rounded-3 p-3"><i className="fas fa-info-circle me-2"></i> Usa esta opción para días festivos o remodelaciones.</div>
              <form onSubmit={handleBlockDate}>
                <div className="mb-4"><label className="form-label fw-bold small text-muted text-uppercase">Fecha a bloquear *</label><input type="date" className="form-control form-control-lg bg-light border-0 shadow-sm" min={new Date().toISOString().split('T')[0]} value={blockDate.fecha_f} onChange={(e) => setBlockDate({...blockDate, fecha_f: e.target.value})} required /></div>
                <div className="mb-4"><label className="form-label fw-bold small text-muted text-uppercase">Motivo del cierre *</label><input type="text" className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Ej. Día de asueto..." value={blockDate.razon_f} onChange={(e) => setBlockDate({...blockDate, razon_f: e.target.value})} required /></div>
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top"><button type="button" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" data-bs-dismiss="modal">Cancelar</button><button type="submit" className="btn btn-danger text-white rounded-pill px-4 shadow-sm fw-bold"><i className="fas fa-lock me-2"></i>Cerrar Fecha</button></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: RECHAZAR CITA ================= */}
      <div className="modal fade" id="rejectApptModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-danger text-white rounded-top-4 border-0 p-4"><h5 className="modal-title fw-bold font-playfair"><i className="fas fa-times-circle me-2"></i>Rechazar Solicitud</h5><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
            <div className="modal-body p-4 font-dm">
              <p className="text-muted small mb-4">El cliente recibirá el motivo del rechazo en su perfil. Por favor, sé claro.</p>
              <textarea className="form-control bg-light border-0 shadow-sm mb-4" rows="3" placeholder="Ej. El horario ya no está disponible..." value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)}></textarea>
              <div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button><button type="button" className="btn btn-danger rounded-pill px-4 fw-bold" onClick={handleRechazarCita}>Confirmar Rechazo</button></div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: EDITAR NEGOCIO ================= */}
      <div className="modal fade" id="editBusinessModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header bg-dark text-white rounded-top-4">
              <h5 className="modal-title fw-bold font-playfair"><i className="fas fa-store me-2"></i>Ajustes del Negocio</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 p-md-5 font-dm">
              <form onSubmit={handleUpdateBusiness}>
                {/* Sección 1: Información Básica */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2">Información Principal</h6>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Nombre del Negocio</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" value={editBusiness.nombre || ''} onChange={e => setEditBusiness({...editBusiness, nombre: e.target.value})} required/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Eslogan</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" value={editBusiness.eslogan || ''} onChange={e => setEditBusiness({...editBusiness, eslogan: e.target.value})} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Descripción Corta</label>
                  <textarea className="form-control bg-light border-0 shadow-sm" rows="2" value={editBusiness.descripcion || ''} onChange={e => setEditBusiness({...editBusiness, descripcion: e.target.value})} required></textarea>
                </div>

                {/* Sección 2: Contacto */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-4">Contacto y Ubicación</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Celular / Teléfono</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-light border-0"><i className="fas fa-phone text-muted"></i></span>
                      <input type="text" className="form-control bg-light border-0" value={editBusiness.celular || ''} onChange={e => setEditBusiness({...editBusiness, celular: e.target.value})} required/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Dirección Completa</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-light border-0"><i className="fas fa-map-marker-alt text-muted"></i></span>
                      <input type="text" className="form-control bg-light border-0" value={editBusiness.ubicacion || ''} onChange={e => setEditBusiness({...editBusiness, ubicacion: e.target.value})} required/>
                    </div>
                  </div>
                </div>

                {/* Sección 3: Redes y Multimedia */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-4">Identidad y Redes Sociales</h6>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Instagram</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" value={editBusiness.instagram || ''} onChange={e => setEditBusiness({...editBusiness, instagram: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Facebook</label>
                    <input type="text" className="form-control bg-light border-0 shadow-sm" value={editBusiness.facebook || ''} onChange={e => setEditBusiness({...editBusiness, facebook: e.target.value})} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Banner de Portada (URL)</label>
                  <input type="url" className="form-control bg-light border-0 shadow-sm" value={editBusiness.banner || ''} onChange={e => setEditBusiness({...editBusiness, banner: e.target.value})} />
                </div>

                {/* Sección 4: Colores y Pagos */}
                <h6 className="text-primary-custom fw-bold text-uppercase small mb-3 border-bottom pb-2 mt-4">Configuración del Sistema</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Color Primario</label>
                    <div className="d-flex align-items-center gap-2">
                      <input type="color" className="form-control form-control-color border-0 p-0 shadow-sm" value={editBusiness.primaryColor || '#4A0E4E'} onChange={e => setEditBusiness({...editBusiness, primaryColor: e.target.value})} style={{ width: '40px', height: '40px' }} />
                      <span className="small text-muted font-monospace">{editBusiness.primaryColor || '#4A0E4E'}</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Color Secundario</label>
                    <div className="d-flex align-items-center gap-2">
                      <input type="color" className="form-control form-control-color border-0 p-0 shadow-sm" value={editBusiness.secondaryColor || '#CFB53B'} onChange={e => setEditBusiness({...editBusiness, secondaryColor: e.target.value})} style={{ width: '40px', height: '40px' }} />
                      <span className="small text-muted font-monospace">{editBusiness.secondaryColor || '#CFB53B'}</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Anticipo Citas (%)</label>
                    <div className="input-group shadow-sm rounded-3">
                      <input type="number" className="form-control bg-light border-0" value={editBusiness.anticipo || 15} onChange={e => setEditBusiness({...editBusiness, anticipo: e.target.value})} min="0" max="100" />
                      <span className="input-group-text bg-light border-0">%</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-5">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" className="btn btn-dark rounded-pill px-4 shadow-sm fw-bold"><i className="fas fa-save me-2"></i>Guardar Negocio</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}