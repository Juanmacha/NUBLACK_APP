import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../../auth/hooks/useAuthClient";
import { useCart } from "../hooks/useCart";
import SearchResults from "./SearchResults";
import Swal from 'sweetalert2';

function LandingNavbar({ searchTerm, onSearchChange, products }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthClient();
  const { getCartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // New state for mobile menu
  const searchRef = useRef(null);

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.categoria &&
            product.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

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
            setShowUserMenu(false);
        }
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-16 border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-black/90 border-gray-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <img src="/images/NBlogo.png" alt="NB Logo" className="h-12 w-auto" />
      </div>

      {/* Hamburger menu button for mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 text-white font-semibold">
        <li><a href="#inicio" className="hover:text-gray-300">Inicio</a></li>
        <li><a href="#productos" className="hover:text-gray-300">Productos</a></li>
        <li><a href="#categorias" className="hover:text-gray-300">Categorías</a></li>
        <li><a href="#nosotros" className="hover:text-gray-300">Sobre Nosotros</a></li>
        <li><a href="#footer" className="hover:text-gray-300">Contacto</a></li>
      </ul>

      <div className="hidden md:flex items-center">
        <div className="relative" ref={searchRef}>
          <div className="flex items-center bg-[#1a1a1a] rounded-md ml-5 px-3 py-2 w-72">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500"
            />
            <button className="text-gray-500 hover:text-gray-300 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 5.65a7.5 7.5 0 016.36 10.36z"
                />
              </svg>
            </button>
          </div>
          {showSearchResults && <SearchResults results={filteredProducts} searchTerm={searchTerm} />}
        </div>
        {user ? (
          <>
            <button
              onClick={() => navigate("/carrito")}
              className="flex items-center gap-2 bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md ml-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m8.25-13.5l-8.25 4.5m0 0L3.75 7.5m8.25 4.5v9"
                />
              </svg>
              Carrito ({getCartCount()})
            </button>

            <div className="relative ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-white hover:text-gray-300"
              >
                <svg
                  className="h-8 w-8 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ver Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md hover:bg-[#6a2b2b]"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="bg-transparent border border-[#7A6240] text-[#7A6240] font-bold px-4 py-2 rounded-md hover:bg-[#7A6240] hover:text-white"
            >
              Registrarse
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-gray-800 py-4 z-40">
          <ul className="flex flex-col items-center space-y-4 text-white font-semibold mb-4">
            <li><a href="#inicio" className="hover:text-gray-300" onClick={() => setShowMobileMenu(false)}>Inicio</a></li>
            <li><a href="#productos" className="hover:text-gray-300" onClick={() => setShowMobileMenu(false)}>Productos</a></li>
            <li><a href="#categorias" className="hover:text-gray-300" onClick={() => setShowMobileMenu(false)}>Categorías</a></li>
            <li><a href="#nosotros" className="hover:text-gray-300" onClick={() => setShowMobileMenu(false)}>Sobre Nosotros</a></li>
            <li><a href="#footer" className="hover:text-gray-300" onClick={() => setShowMobileMenu(false)}>Contacto</a></li>
          </ul>
          <div className="relative px-4 mb-4" ref={searchRef}>
            <div className="flex items-center bg-[#1a1a1a] rounded-md px-3 py-2 w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500"
              />
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 5.65a7.5 7.5 0 016.36 10.36z"
                  />
                </svg>
              </button>
            </div>
            {showSearchResults && <SearchResults results={filteredProducts} searchTerm={searchTerm} />}
          </div>
          {user ? (
            <div className="flex flex-col items-center gap-4 px-4">
              <button
                onClick={() => {
                  navigate("/carrito");
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md w-full justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m8.25-13.5l-8.25 4.5m0 0L3.75 7.5m8.25 4.5v9"
                  />
                </svg>
                Carrito ({getCartCount()})
              </button>

              <div className="relative w-full">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-gray-300 w-full justify-center"
                >
                  <svg
                    className="h-8 w-8 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {user.email} {/* Assuming user object has an email property */}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        navigate("/perfil");
                        setShowUserMenu(false);
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Ver Perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 px-4">
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMobileMenu(false);
                }}
                className="bg-[#7A6240] text-white font-bold px-4 py-2 rounded-md hover:bg-[#6a2b2b] w-full"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  navigate("/registro");
                  setShowMobileMenu(false);
                }}
                className="bg-transparent border border-[#7A6240] text-[#7A6240] font-bold px-4 py-2 rounded-md hover:bg-[#7A6240] hover:text-white w-full"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default LandingNavbar;