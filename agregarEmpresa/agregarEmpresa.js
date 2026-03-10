
let businessData = {
    businessType:    '',
    businessId:      generateId(),
    info: {
        name:        '',
        slogan:      '',
        description: '',
        icon:        '',
        banner:      '',
        phone:       '',
        email:       '',
        instagram:   '',
        facebook:    '',
        address:     '',
        city:        '',
        state:       ''
    },
    admin:      null,
    services:   [],
    employees:  [],
    colors: {
        primary:   '#7F055F',   
        secondary: '#E5A4CB'    
    }
};

let currentStep = 1;
const TOTAL_STEPS = 6;

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function showToast(message, type = 'success') {
    const toast        = document.getElementById('toast');
    const toastIcon    = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

  
    toast.className = 'toast';

    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle text-2xl';
        toastIcon.style.color = '#7F055F';  
        toast.classList.add('toast-success');
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle text-red-600 text-2xl';
        toast.classList.add('toast-error');
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle text-yellow-500 text-2xl';
        toast.classList.add('toast-warning');
    }

    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function hideError(errorId) {
    const el = document.getElementById(errorId);
    if (el) el.classList.add('hidden');
}

function showError(errorId, message = null) {
    const el = document.getElementById(errorId);
    if (el) {
        if (message) el.textContent = message;
        el.classList.remove('hidden');
    }
}


function updateProgress(step) {
    const progressBar  = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const percentage   = (step / TOTAL_STEPS) * 100;

    progressBar.style.width   = percentage + '%';
    progressText.textContent  = `Paso ${step} de ${TOTAL_STEPS}`;
}

function showStep(step) {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const el = document.getElementById(`step${i}`);
        if (el) el.classList.add('hidden');
    }
    const target = document.getElementById(`step${step}`);
    if (target) target.classList.remove('hidden');

    currentStep = step;
    updateProgress(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectBusinessType(type) {
    businessData.businessType = type;
    // Actualiza el texto del subtítulo en el paso 2
    document.getElementById('businessTypeText').textContent = type.toLowerCase();
    showToast(`Seleccionaste: ${type}`, 'success');
    showStep(2);
}

let bannerBase64 = null;

const BANNER_DEFAULT = 'linear-gradient(135deg, #45062E 0%, #7F055F 40%, #E5A4CB 100%)';

function previewBanner(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        bannerBase64 = e.target.result; 

        const preview     = document.getElementById('bannerPreview');
        const placeholder = document.getElementById('bannerPlaceholder');
        const dropZone    = document.getElementById('bannerDropZone');
        const removeBtn   = document.getElementById('bannerRemoveBtn');

        preview.src = bannerBase64;
        preview.classList.remove('hidden');
        placeholder.classList.add('hidden');
        dropZone.classList.add('has-image');
        removeBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeBanner() {
    bannerBase64 = null;

    const preview     = document.getElementById('bannerPreview');
    const placeholder = document.getElementById('bannerPlaceholder');
    const dropZone    = document.getElementById('bannerDropZone');
    const removeBtn   = document.getElementById('bannerRemoveBtn');
    const input       = document.getElementById('businessBanner');

    preview.src = '';
    preview.classList.add('hidden');
    placeholder.classList.remove('hidden');
    dropZone.classList.remove('has-image');
    removeBtn.classList.add('hidden');
    input.value = ''; 
}

function initializeBusinessSchedule() {
    const container = document.getElementById('businessScheduleContainer');

    container.innerHTML = daysOfWeek.map(day => `
        <div class="schedule-day">
            <div class="flex items-center gap-2 w-32">
                <input type="checkbox" id="biz-schedule-${day}-enabled"
                       onchange="toggleBizScheduleDay('${day}')">
                <label class="font-semibold text-sm" style="color: var(--velvet-dark)">${day}</label>
            </div>
            <div class="flex-1 flex gap-2 items-center">
                <input type="time" id="biz-schedule-${day}-start" value="09:00" disabled
                       class="px-3 py-2 border-2 rounded-lg focus:outline-none transition disabled:bg-gray-100"
                       style="border-color: var(--velvet-blush)">
                <span style="color: var(--velvet-plum)">a</span>
                <input type="time" id="biz-schedule-${day}-end" value="18:00" disabled
                       class="px-3 py-2 border-2 rounded-lg focus:outline-none transition disabled:bg-gray-100"
                       style="border-color: var(--velvet-blush)">
            </div>
        </div>`).join('');
}

function toggleBizScheduleDay(day) {
    const checkbox  = document.getElementById(`biz-schedule-${day}-enabled`);
    const startTime = document.getElementById(`biz-schedule-${day}-start`);
    const endTime   = document.getElementById(`biz-schedule-${day}-end`);
    startTime.disabled = !checkbox.checked;
    endTime.disabled   = !checkbox.checked;
}

function goToStep3() {
    const name = document.getElementById('businessName').value.trim();
    hideError('businessNameError');

    if (!name) {
        showError('businessNameError', 'El nombre del negocio es obligatorio');
        return;
    }
    if (name.length < 3) {
        showError('businessNameError', 'El nombre debe tener al menos 3 caracteres');
        return;
    }

    const businessSchedule = [];
    daysOfWeek.forEach(day => {
        const checkbox  = document.getElementById(`biz-schedule-${day}-enabled`);
        const startTime = document.getElementById(`biz-schedule-${day}-start`);
        const endTime   = document.getElementById(`biz-schedule-${day}-end`);
        if (checkbox && checkbox.checked) {
            businessSchedule.push({
                day,
                start_time: startTime.value,
                end_time:   endTime.value
            });
        }
    });

    businessData.info = {
        name:        name,
        slogan:      document.getElementById('businessSlogan').value.trim(),
        description: document.getElementById('businessDescription').value.trim(),
        icon:        document.getElementById('businessIcon').value.trim(),
        banner:      bannerBase64 || BANNER_DEFAULT,  
        phone:       document.getElementById('businessPhone').value.trim(),
        email:       document.getElementById('businessEmail').value.trim(),
        instagram:   document.getElementById('businessInstagram').value.trim(),
        facebook:    document.getElementById('businessFacebook').value.trim(),
        address:     document.getElementById('businessAddress').value.trim(),
        city:        document.getElementById('businessCity').value.trim(),
        state:       document.getElementById('businessState').value.trim(),
        schedule:    businessSchedule   
    };

    showToast('Información del negocio guardada', 'success');
    showStep(3);
}


function registerAdmin() {
    const firstName = document.getElementById('adminFirstName').value.trim();
    const lastName  = document.getElementById('adminLastName').value.trim();
    const email     = document.getElementById('adminEmail').value.trim();
    const password  = document.getElementById('adminPassword').value;
    const birthdate = document.getElementById('adminBirthdate').value;
    const profilePicture = document.getElementById('adminProfilePicture').value.trim();

    hideError('adminFirstNameError');
    hideError('adminLastNameError');
    hideError('adminEmailError');
    hideError('adminPasswordError');
    hideError('adminBirthdateError');

    let hasError = false;

    if (!firstName)              { showError('adminFirstNameError', 'El nombre es obligatorio');           hasError = true; }
    if (!lastName)               { showError('adminLastNameError', 'El apellido es obligatorio');          hasError = true; }
    if (!email)                  { showError('adminEmailError', 'El email es obligatorio');                hasError = true; }
    else if (!isValidEmail(email)) { showError('adminEmailError', 'Email inválido');                       hasError = true; }
    if (!password)               { showError('adminPasswordError', 'La contraseña es obligatoria');        hasError = true; }
    else if (password.length < 8){ showError('adminPasswordError', 'Mínimo 8 caracteres');                hasError = true; }
    if (!birthdate)              { showError('adminBirthdateError', 'La fecha de nacimiento es obligatoria'); hasError = true; }

    if (hasError) return;

    businessData.admin = {
        username:  email.split('@')[0],
        email,
        password,
        birthdate,
        is_active: true,
        rol:       'admin',
        createdAt: new Date().toISOString(),
        profile: {
            first_name:      firstName,
            last_name:       lastName,
            profile_picture: profilePicture ||
                `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=7F055F&color=fff`
        },
        is_employee: true,
        works_at:    businessData.businessId
    };

    showToast('Administrador registrado exitosamente', 'success');
    showStep(4);
    initializeScheduleInputs();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function openServiceModal() {
    document.getElementById('serviceModal').classList.remove('hidden');
    clearServiceForm();
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.add('hidden');
    clearServiceForm();
}

function clearServiceForm() {
    ['serviceName','serviceDescription','serviceImages','serviceVideos','serviceDuration','servicePrice']
        .forEach(id => { document.getElementById(id).value = ''; });
    ['serviceNameError','serviceDescriptionError','serviceDurationError','servicePriceError']
        .forEach(id => hideError(id));
}

function addService() {
    const name        = document.getElementById('serviceName').value.trim();
    const description = document.getElementById('serviceDescription').value.trim();
    const images      = document.getElementById('serviceImages').value.trim();
    const videos      = document.getElementById('serviceVideos').value.trim();
    const duration    = document.getElementById('serviceDuration').value;
    const price       = document.getElementById('servicePrice').value;

    // Limpiar errores
    ['serviceNameError','serviceDescriptionError','serviceDurationError','servicePriceError']
        .forEach(id => hideError(id));

    let hasError = false;
    if (!name)              { showError('serviceNameError', 'El nombre es obligatorio');           hasError = true; }
    if (!description)       { showError('serviceDescriptionError', 'La descripción es obligatoria'); hasError = true; }
    if (!duration || duration <= 0) { showError('serviceDurationError', 'La duración debe ser mayor a 0'); hasError = true; }
    if (!price || price < 0) { showError('servicePriceError', 'El precio debe ser mayor o igual a 0');    hasError = true; }
    if (hasError) return;

    const service = {
        service_id:  generateId(),
        business_id: businessData.businessId,
        name,
        description,
        image_url:   images ? images.split(',').map(u => u.trim()) : [],
        video_url:   videos ? videos.split(',').map(u => u.trim()) : [],
        duration:    parseInt(duration),
        price:       parseFloat(price),
        createdAt:   new Date().toISOString()
    };

    businessData.services.push(service);
    renderServices();
    updateEmployeeServicesCheckboxes();
    closeServiceModal();
    showToast('Servicio agregado exitosamente', 'success');
}

function renderServices() {
    const servicesList = document.getElementById('servicesList');

    if (businessData.services.length === 0) {
        servicesList.innerHTML = `
            <div class="border-2 border-dashed border-velvet-blush rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] hover:border-velvet-pink cursor-pointer transition"
                 onclick="openServiceModal()">
                <i class="fas fa-plus text-4xl mb-2" style="color: var(--velvet-blush)"></i>
                <p class="font-semibold" style="color: var(--velvet-plum)">Agregar primer servicio</p>
            </div>`;
        return;
    }

    servicesList.innerHTML = businessData.services.map((service, index) => `
        <div class="service-card">
            <div class="p-6">
                <h4 class="text-xl font-bold mb-2" style="color: var(--velvet-dark)">${service.name}</h4>
                <p class="text-gray-500 text-sm mb-4">${service.description}</p>
                <div class="flex justify-between items-center mb-4">
                    <div class="duration-display">
                        <i class="fas fa-clock"></i>
                        <span>${service.duration} min</span>
                    </div>
                    <div class="price-display">$${service.price.toFixed(2)}</div>
                </div>
                ${service.image_url.length > 0 ? `<p class="text-xs text-gray-400">${service.image_url.length} imagen(es)</p>` : ''}
                ${service.video_url.length > 0 ? `<p class="text-xs text-gray-400">${service.video_url.length} video(s)</p>` : ''}
                <div class="card-actions">
                    <button onclick="deleteService(${index})" class="delete-btn">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function deleteService(index) {
    if (confirm('¿Eliminar este servicio?')) {
        businessData.services.splice(index, 1);
        renderServices();
        updateEmployeeServicesCheckboxes();
        showToast('Servicio eliminado', 'warning');
    }
}

function openEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('hidden');
    clearEmployeeForm();
    updateEmployeeServicesCheckboxes();
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.add('hidden');
    clearEmployeeForm();
}

function clearEmployeeForm() {
    ['employeeFirstName','employeeLastName','employeeBirthYear','employeeProfilePicture']
        .forEach(id => { document.getElementById(id).value = ''; });
    ['employeeFirstNameError','employeeLastNameError','employeeBirthYearError']
        .forEach(id => hideError(id));

    // Limpiar horarios
    daysOfWeek.forEach(day => {
        const checkbox  = document.getElementById(`schedule-${day}-enabled`);
        const startTime = document.getElementById(`schedule-${day}-start`);
        const endTime   = document.getElementById(`schedule-${day}-end`);
        if (checkbox)  checkbox.checked = false;
        if (startTime) { startTime.value = '09:00'; startTime.disabled = true; }
        if (endTime)   { endTime.value   = '18:00'; endTime.disabled   = true; }
    });

    updateEmployeeServicesCheckboxes();
}

function initializeScheduleInputs() {
    const container = document.getElementById('scheduleContainer');

    container.innerHTML = daysOfWeek.map(day => `
        <div class="schedule-day">
            <div class="flex items-center gap-2 w-32">
                <input type="checkbox" id="schedule-${day}-enabled"
                       onchange="toggleScheduleDay('${day}')">
                <label class="font-semibold text-sm" style="color: var(--velvet-dark)">${day}</label>
            </div>
            <div class="flex-1 flex gap-2 items-center">
                <input type="time" id="schedule-${day}-start" value="09:00" disabled
                       class="px-3 py-2 border-2 rounded-lg focus:outline-none transition disabled:bg-gray-100"
                       style="border-color: var(--velvet-blush)">
                <span style="color: var(--velvet-plum)">a</span>
                <input type="time" id="schedule-${day}-end" value="18:00" disabled
                       class="px-3 py-2 border-2 rounded-lg focus:outline-none transition disabled:bg-gray-100"
                       style="border-color: var(--velvet-blush)">
            </div>
        </div>`).join('');
}

function toggleScheduleDay(day) {
    const checkbox  = document.getElementById(`schedule-${day}-enabled`);
    const startTime = document.getElementById(`schedule-${day}-start`);
    const endTime   = document.getElementById(`schedule-${day}-end`);
    startTime.disabled = !checkbox.checked;
    endTime.disabled   = !checkbox.checked;
}

function updateEmployeeServicesCheckboxes() {
    const container = document.getElementById('employeeServicesCheckboxes');
    if (businessData.services.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-sm">No hay servicios. Agrega servicios primero.</p>';
        return;
    }
    container.innerHTML = businessData.services.map(service => `
        <div class="flex items-center gap-2">
            <input type="checkbox" id="service-checkbox-${service.service_id}" value="${service.service_id}">
            <label for="service-checkbox-${service.service_id}" class="text-sm" style="color: var(--velvet-dark)">
                ${service.name} (<span style="color:var(--velvet-plum)">$${service.price.toFixed(2)}</span>)
            </label>
        </div>`).join('');
}

function addEmployee() {
    const firstName    = document.getElementById('employeeFirstName').value.trim();
    const lastName     = document.getElementById('employeeLastName').value.trim();
    const birthYear    = document.getElementById('employeeBirthYear').value;
    const profilePicture = document.getElementById('employeeProfilePicture').value.trim();

    ['employeeFirstNameError','employeeLastNameError','employeeBirthYearError']
        .forEach(id => hideError(id));

    let hasError = false;
    if (!firstName) { showError('employeeFirstNameError', 'El nombre es obligatorio');       hasError = true; }
    if (!lastName)  { showError('employeeLastNameError', 'El apellido es obligatorio');      hasError = true; }
    if (!birthYear) { showError('employeeBirthYearError', 'El año de nacimiento es requerido'); hasError = true; }
    else if (birthYear < 1940 || birthYear > 2010) { showError('employeeBirthYearError', 'Año inválido'); hasError = true; }
    if (hasError) return;

    const selectedServices = businessData.services
        .filter(s => {
            const cb = document.getElementById(`service-checkbox-${s.service_id}`);
            return cb && cb.checked;
        })
        .map(s => s.service_id);

    const schedule = [];
    daysOfWeek.forEach(day => {
        const checkbox  = document.getElementById(`schedule-${day}-enabled`);
        const startTime = document.getElementById(`schedule-${day}-start`);
        const endTime   = document.getElementById(`schedule-${day}-end`);
        if (checkbox && checkbox.checked) {
            schedule.push({ day, start_time: startTime.value, end_time: endTime.value });
        }
    });

    if (schedule.length === 0) {
        showToast('Debes agregar al menos un día de trabajo', 'error');
        return;
    }

    const employee = {
        employee_id: generateId(),
        username:    (firstName + lastName).toLowerCase().replace(/\s/g, ''),
        email:       `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${businessData.info.name.toLowerCase().replace(/\s/g, '')}.com`,
        birthdate:   `${birthYear}-01-01`,
        is_active:   true,
        rol:         'employee',
        createdAt:   new Date().toISOString(),
        profile: {
            first_name:      firstName,
            last_name:       lastName,
            profile_picture: profilePicture ||
                `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=E5A4CB&color=45062E`
        },
        is_employee:       true,
        works_at:          businessData.businessId,
        services_provided: selectedServices,
        schedule
    };

    businessData.employees.push(employee);
    renderEmployees();
    closeEmployeeModal();
    showToast('Empleado agregado exitosamente', 'success');
}

function renderEmployees() {
    const employeesList = document.getElementById('employeesList');

    if (businessData.employees.length === 0) {
        employeesList.innerHTML = `
            <div class="border-2 border-dashed border-velvet-blush rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition"
                 onclick="openEmployeeModal()">
                <i class="fas fa-plus text-4xl mb-2" style="color: var(--velvet-blush)"></i>
                <p class="font-semibold" style="color: var(--velvet-plum)">Agregar empleado</p>
            </div>`;
        return;
    }

    employeesList.innerHTML = businessData.employees.map((employee, index) => `
        <div class="employee-card">
            <div class="p-6">
                <div class="flex items-center gap-4 mb-4">
                    <img src="${employee.profile.profile_picture}"
                         alt="${employee.profile.first_name}"
                         class="w-16 h-16 rounded-full object-cover border-2"
                         style="border-color: var(--velvet-blush)">
                    <div>
                        <h4 class="text-xl font-bold" style="color: var(--velvet-dark)">
                            ${employee.profile.first_name} ${employee.profile.last_name}
                        </h4>
                        <p class="text-sm text-gray-400">${employee.email}</p>
                    </div>
                </div>

                ${employee.services_provided.length > 0 ? `
                    <div class="mb-3">
                        <p class="text-sm font-semibold mb-1" style="color: var(--velvet-dark)">Servicios:</p>
                        <div class="flex flex-wrap gap-1">
                            ${employee.services_provided.map(sid => {
                                const s = businessData.services.find(sv => sv.service_id === sid);
                                return s ? `<span class="service-badge">${s.name}</span>` : '';
                            }).join('')}
                        </div>
                    </div>` : ''}

                <p class="text-xs text-gray-400 mb-3">${employee.schedule.length} día(s) laborales</p>

                <div class="card-actions">
                    <button onclick="deleteEmployee(${index})" class="delete-btn">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function deleteEmployee(index) {
    if (confirm('¿Eliminar este empleado?')) {
        businessData.employees.splice(index, 1);
        renderEmployees();
        showToast('Empleado eliminado', 'warning');
    }
}

function goToStep5() {
    if (businessData.services.length === 0) {
        showToast('Agrega al menos un servicio antes de continuar', 'error');
        return;
    }
    showStep(5);
}


function setupColorPickers() {
    const primaryColor        = document.getElementById('primaryColor');
    const primaryColorText    = document.getElementById('primaryColorText');
    const secondaryColor      = document.getElementById('secondaryColor');
    const secondaryColorText  = document.getElementById('secondaryColorText');

    primaryColor.addEventListener('input', function () {
        primaryColorText.value = this.value;
        updateColorPreview();
    });
    secondaryColor.addEventListener('input', function () {
        secondaryColorText.value = this.value;
        updateColorPreview();
    });
}

function updateColorPreview() {
    const primary   = document.getElementById('primaryColor').value;
    const secondary = document.getElementById('secondaryColor').value;
    document.getElementById('colorPreview').style.background =
        `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
}


function finishSetup() {
    businessData.colors.primary   = document.getElementById('primaryColor').value;
    businessData.colors.secondary = document.getElementById('secondaryColor').value;

    showToast('¡Página creada exitosamente! 🎉', 'success');

    const summary = document.getElementById('summaryContent');
    summary.innerHTML = `
        <p><strong>Tipo:</strong> ${businessData.businessType}</p>
        <p><strong>Nombre:</strong> ${businessData.info.name}</p>
        ${businessData.info.slogan      ? `<p><strong>Eslogan:</strong> ${businessData.info.slogan}</p>` : ''}
        ${businessData.info.phone       ? `<p><strong>Teléfono:</strong> ${businessData.info.phone}</p>` : ''}
        ${businessData.info.city        ? `<p><strong>Ciudad:</strong> ${businessData.info.city}, ${businessData.info.state}</p>` : ''}
        ${businessData.info.schedule && businessData.info.schedule.length > 0 ? `
        <p><strong>Horario:</strong> ${businessData.info.schedule.map(d =>
            `${d.day} ${d.start_time}–${d.end_time}`).join(' · ')}</p>` : ''}
        <p><strong>Servicios:</strong> ${businessData.services.length}</p>
        <p><strong>Empleados:</strong> ${businessData.employees.length}</p>
        <p><strong>Color principal:</strong>
            <span style="background:${businessData.colors.primary}; color:white; padding: 2px 8px; border-radius:4px">
                ${businessData.colors.primary}
            </span>
        </p>
        <p><strong>Color secundario:</strong>
            <span style="background:${businessData.colors.secondary}; color:white; padding: 2px 8px; border-radius:4px">
                ${businessData.colors.secondary}
            </span>
        </p>`;

    localStorage.setItem('velvetMatchBusiness', JSON.stringify(businessData));
    console.log('✅ Business Data guardada:', businessData);

    showStep(6);
}

function resetApp() {
    location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    initializeBusinessSchedule();

    initializeScheduleInputs();

    setupColorPickers();

    document.getElementById('serviceModal').addEventListener('click', function (e) {
        if (e.target === this) closeServiceModal();
    });
    document.getElementById('employeeModal').addEventListener('click', function (e) {
        if (e.target === this) closeEmployeeModal();
    });
});