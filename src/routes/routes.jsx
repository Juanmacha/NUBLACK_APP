import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Landing from "../features/landing/components/landing";
import LoginCliente from "../features/auth/pages/LoginCliente";
import RegistroCliente from "../features/auth/pages/RegistroCliente";
import PerfilCliente from "../features/landing/pages/PerfilCliente";
import CarritoPage from "../features/landing/pages/CarritoPage";
import LoginAdministrador from "../features/auth/pages/loginAdministrador";
import RecuperarContrasena from "../features/auth/pages/recuperarcontrasena";
import VerificarCodigo from "../features/auth/pages/VerificarCodigo";
import RestablecerContrasena from "../features/auth/pages/RestablecerContrasena";
import Dashboard from "../features/dashboard/dashboard";
import DashboardHome from "../features/dashboard/pages/DashboardHome";
import Category from "../features/dashboard/pages/categoryManagement/category";
import Product from "../features/dashboard/pages/productManagement/product";
import User from "../features/dashboard/pages/userManagement/user";
import Solicitudes from "../features/dashboard/pages/solicitudes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginCliente />} />
            <Route path="/registro" element={<RegistroCliente />} />
            <Route path="/perfil" element={<PerfilCliente />} />
            <Route path="/carrito" element={<CarritoPage />} />
            <Route path="/admin" element={<LoginAdministrador />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/verificar-codigo" element={<VerificarCodigo />} />
            <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
            
            {/* Rutas del Admin con Sidebar */}
            <Route path="/admin/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="categorias" element={<Category />} />
                <Route path="productos" element={<Product />} />
                <Route path="usuarios" element={<User />} />
                <Route path="solicitudes" element={<Solicitudes />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;