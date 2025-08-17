import React from 'react';
import {
    BsHouseDoor,
    BsPeople,
    BsFolder,
    BsBasket3,
    BsClipboard,
    BsSearch
} from 'react-icons/bs';
import { PersonCircle, GearFill, BoxArrowRight } from "react-bootstrap-icons";

const selections = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BsHouseDoor },
    { name: 'Usuarios', href: '#', icon: BsPeople },
    { name: 'Categorías', href: '/admin/categorias', icon: BsFolder },
    { name: 'Productos', href: '#', icon: BsBasket3 },
    { name: 'Solicitudes', href: '#', icon: BsClipboard },
    { name: 'Detalles de solicitud', href: '#', icon: BsSearch }
];

function Sidebar() {
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
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                                text-[#cfcfcf] hover:bg-[#1a1a1a] hover:text-white 
                                transition-colors duration-200 ease-in-out"
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </a>
                    );
                })}
            </nav>

            {/* Usuario */}
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center gap-3 mb-4">
                    <PersonCircle size={32} className="text-gray-500" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#e5e5e5] truncate">Administrador</p>
                        <p className="text-xs text-[#e5e5e5] truncate">admin@empresa.com</p>
                    </div>
                </div>

                {/* Configuración */}
                <button
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                        text-[#cfcfcf] hover:bg-[#1a1a1a] hover:text-white 
                        transition-colors duration-200 ease-in-out w-full text-left"
                    onClick={() => {
                        console.log("Configuración clickeada");
                        alert("Abriendo configuración...");
                    }}
                >
                    <GearFill className="h-5 w-5" />
                    Configuración
                </button>

                {/* Cerrar Sesión */}
                <button
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                        text-red-500 hover:bg-[#1a1a1a] hover:text-red-400 
                        transition-colors duration-200 ease-in-out w-full text-left"
                    onClick={() => {
                        console.log("Cerrar sesión clickeado");
                        alert("Sesión cerrada");
                        window.location.href = "/admin";
                    }}
                >
                    <BoxArrowRight className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
