import { BrowserRouter, Routes, Route } from "react-router-dom";
import PantallaPrincipal from "./paginas/PantallaPrincipal/PantallaPrincipal";
// Descomenta conforme vayas creando cada página:
// import Login from "./paginas/Login";
// import Register from "./paginas/Register";
// import AgregarEmpresa from "./paginas/AgregarEmpresa";
// import Dashboard from "./paginas/Dashboard";
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PantallaPrincipal />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/agregar-empresa" element={<AgregarEmpresa />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
 