import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../../auth/hooks/useAuthClient";
import { useCart } from "../hooks/useCart";


function LandingNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthClient();
  const { getCartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navegar a la sección de productos con el término de búsqueda
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && searchTerm.trim()) {
              handleSearch();
            }
          }}
          className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 5.65a7.5 7.5 0 016.36 10.36z" />
          </svg>
        </button>
      </div>
      {user ? (
        <>
          <button 
            onClick={() => navigate('/carrito')}
            className="flex items-center gap-2 bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m8.25-13.5l-8.25 4.5m0 0L3.75 7.5m8.25 4.5v9" />
            </svg>
            Carrito ({getCartCount()})
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-white hover:text-gray-300"
            >
              <svg className="h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    navigate('/perfil');
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/login')}
            className="bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md hover:bg-[#6a2b2b]"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/registro')}
            className="bg-transparent border border-[#7A6240] text-[#7A6240] font-bold px-4 py-2 rounded-md hover:bg-[#7A6240] hover:text-white"
          >
            Registrarse
          </button>
        </div>
      )}
      
    </nav>
  );
}

export default LandingNavbar;
