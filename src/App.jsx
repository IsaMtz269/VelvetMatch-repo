import { BrowserRouter, Routes, Route } from "react-router-dom";
import PantallaPrincipal from "./paginas/PantallaPrincipal/PantallaPrincipal";
import Login from "./paginas/login/login";
import Register from "./paginas/Registro/registro";
import AgregarEmpresa from "./paginas/AgregarEmpresa/Agregarempresa";
import Dashboard from "./paginas/Superadmin/Dashboard";
import Negocios from "./paginas/Superadmin/Negocios";
import Usuarios from "./paginas/Superadmin/Usuarios";
import Analytics from "./paginas/Superadmin/Analytics";
import Admin from "./paginas/Empresa/Admin"; 
import EmpresaLanding from "./paginas/Empresa/Empresa"; 
import Empleado from "./paginas/Empresa/Empleado"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PantallaPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} /> 
        <Route path="/agregar-empresa" element={<AgregarEmpresa />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/negocios" element={<Negocios />} /> 
        <Route path="/usuarios" element={<Usuarios />} /> 
        <Route path="/analytics" element={<Analytics />} /> 
        <Route path="/admin" element={<Admin />} />
        <Route path="/empresa/:id" element={<EmpresaLanding />} />
        <Route path="/empleado" element={<Empleado />} />

      </Routes>
    </BrowserRouter>
  );
}