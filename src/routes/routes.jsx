import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Landing from "../features/landing/components/landing";
import LoginAdministrador from "../features/auth/pages/loginAdministrador";
import RecuperarContrasena from "../features/auth/pages/recuperarcontrasena";
import VerificarCodigo from "../features/auth/pages/VerificarCodigo";
import RestablecerContrasena from "../features/auth/pages/RestablecerContrasena";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/login" element={<LoginAdministrador />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/verificar-codigo" element={<VerificarCodigo />} />
            <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
        </Routes>
    );
}

export default AppRoutes;