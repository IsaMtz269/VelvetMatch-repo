const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

async function crearSuperAdmin() {
  await mongoose.connect('mongodb://localhost:27017/velvet_match_db');
  
  const existe = await Usuario.findOne({ email: 'superadmin@velvetmatch.com' });
  if (existe) {
    console.log('Ya existe, eliminando...');
    await Usuario.deleteOne({ email: 'superadmin@velvetmatch.com' });
  }

  const superAdmin = new Usuario({
    nombre: 'Super',
    apellido: 'Admin',
    email: 'superadmin@velvetmatch.com',
    password: 'Admin123456',
    fechNacimiento: new Date('1990-01-01'),
    roles: 'superadmin',
    es_activo: true,
    is_empleado: false
  });

  await superAdmin.save();
  console.log('Superadmin creado exitosamente');
  mongoose.disconnect();
}

crearSuperAdmin();