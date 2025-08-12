import React from "react";
import { useNavigate } from "react-router-dom";


function LandingNavbar() {
  const navigate = useNavigate(); // <-- Agrega esta línea

  return (
    <nav className="sticky top-0 z-50 w-full h-16 border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-black/90 border-gray-800 flex items-center justify-around">
      <img src="/public/images/NBlogo.png" alt="" className="h-12 w-auto" />
      <ul className="flex space-x-6 text-white font-semibold">
        <li><a href="#inicio" className="hover:text-gray-300">Inicio</a></li>
        <li><a href="#productos" className="hover:text-gray-300">Productos</a></li>
        <li><a href="#categorias" className="hover:text-gray-300">Categorías</a></li>
        <li><a href="#nosotros" className="hover:text-gray-300">Sobre Nosotros</a></li>
        <li><a href="#footer" className="hover:text-gray-300">Contacto</a></li>
      </ul>
      <div className="flex items-center bg-[#1a1a1a] rounded-md ml-5 px-3 py-2 w-72">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500" // <-- Cambia class por className
        />
        <svg xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 5.65a7.5 7.5 0 016.36 10.36z" />
        </svg>
      </div>
      <button className="flex items-center gap-2 bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md">
        {/* Ícono de caja/paquete */}
        <svg xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m8.25-13.5l-8.25 4.5m0 0L3.75 7.5m8.25 4.5v9" />
        </svg>
        Carrito (0)
      </button>
      <button className="flex items-center gap-2 bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md" 
        onClick={() => navigate("/login")}>
        {/* Ícono de usuario */}
        <svg xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-1.5 6.5a6.5 6.5 0 00-13 0v1.5a1.5 1.5 0 001.5 1.5h10a1.5 1.5 0 001.5-1.5V17z" />
        </svg>
        Login Admin
      </button>
    </nav>
  );
}

export default LandingNavbar;
