import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAdministrador from "./features/auth/pages/loginAdministrador";
import RecuperarContrasena from "./features/auth/pages/RecuperarContrasena";
import VerificarCodigo from "./features/auth/pages/VerificarCodigo";
import RestablecerContrasena from "./features/auth/pages/RestablecerContrasena";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginAdministrador />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
        <Route path="*" element={<LoginAdministrador />} />
      </Routes>
    </Router>
  );
}

export default App;
