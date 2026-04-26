import { BrowserRouter, Routes, Route } from "react-router-dom";
import PantallaPrincipal from "./paginas/PantallaPrincipal/PantallaPrincipal";
// Descomenta conforme vayas creando cada página:
import Login from "./paginas/login/login";
import Register from "./paginas/Registro/registro";
import AgregarEmpresa from "./paginas/AgregarEmpresa/Agregarempresa";
import Dashboard from "./paginas/Superadmin/Dashboard";
import Negocios from "./paginas/Superadmin/Negocios";
import Usuarios from "./paginas/Superadmin/Usuarios";
import Analytics from "./paginas/Superadmin/Analytics";


 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PantallaPrincipal />} />
        <Route path="/login" element={<Login />} />
        {<Route path="/register" element={<Register />} /> }
        { <Route path="/agregar-empresa" element={<AgregarEmpresa />} />}
        {<Route path="/dashboard" element={<Dashboard />} /> }
        {<Route path="/negocios" element={<Negocios />} /> }
        {<Route path="/usuarios" element={<Usuarios />} /> }
        {<Route path="/analytics" element={<Analytics />} /> }
        
      </Routes>
    </BrowserRouter>
  );
}
 