import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PersonCircle, BoxArrowRight, HouseDoor, People, Folder, Basket3, Clipboard, Search } from "react-bootstrap-icons";
import { useAuthClient } from '../../auth/hooks/useAuthClient';
import Swal from 'sweetalert2';

const selections = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HouseDoor },
    { name: 'Usuarios', href: '/admin/dashboard/usuarios', icon: People },
    { name: 'Categorías', href: '/admin/dashboard/categorias', icon: Folder },
    { name: 'Productos', href: '/admin/dashboard/productos', icon: Basket3 },
    { name: 'Solicitudes', href: '/admin/dashboard/solicitudes', icon: Clipboard }
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthClient();
    
    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se cerrará tu sesión actual.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
            }
        });
    };

    return (
        <div className='flex h-full w-64 flex-col bg-[#0a0a0a] border-r border-gray-800'>
            {/* Encabezado */}
            <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
                <h1 className='text-xl font-bold text-[#e5e5e5]'>Panel Administrativo</h1>
            </div>

            {/* Navegación */}
            <nav className="flex-1 space-y-1 p-4">
                {selections.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                                transition-colors duration-200 ease-in-out ${
                                isActive 
                                    ? 'bg-[#1a1a1a] text-white' 
                                    : 'text-[#cfcfcf] hover:bg-[#1a1a1a] hover:text-white'
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Usuario */}
            <div className="border-t border-gray-800 p-4">
                <div 
                    className="flex items-center gap-3 mb-4 cursor-pointer"
                    onClick={() => navigate('/admin/dashboard/perfil')}
                >
                    <PersonCircle size={32} className="text-gray-500" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#e5e5e5] truncate">Administrador</p>
                        <p className="text-xs text-[#e5e5e5] truncate">admin@empresa.com</p>
                    </div>
                </div>


                {/* Cerrar Sesión */}
                <button
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                        text-red-500 hover:bg-[#1a1a1a] hover:text-red-400 
                        transition-colors duration-200 ease-in-out w-full text-left"
                    onClick={handleLogout}
                >
                    <BoxArrowRight className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Sidebar;