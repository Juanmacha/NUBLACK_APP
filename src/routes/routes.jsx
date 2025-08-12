// src/routes/routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import loginAdministrador from "../features/auth/pages/loginAdministrador";
import RecuperarContrasena from "../features/auth/pages/RecuperarContrasena";
import VerificarCodigo from "../features/auth/pages/VerificarCodigo";
import RestablecerContrasena from "../features/auth/pages/RestablecerContrasena";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<loginAdministrador />} />
      <Route path="/recuperar" element={<RecuperarContrasena />} />
      <Route path="/verificar-codigo" element={<VerificarCodigo />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />

      {/* Redirigir cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
