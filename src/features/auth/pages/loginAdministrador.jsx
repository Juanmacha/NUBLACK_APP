import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../context/AuthClientContext";
import Swal from 'sweetalert2';
import { Eye, EyeSlash, ArrowLeft } from "react-bootstrap-icons";

function LoginAdministrador() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthClient();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const session = await login(email, password);
      if (session.user.role === "Administrador") {
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de Sesión Exitoso!',
          text: 'Redirigiendo al Dashboard...',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate("/admin/dashboard");
        });
      } else {
        setError("Acceso denegado: Solo administradores pueden iniciar sesión aquí.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      {/* Botón Atrás */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-[#111111] hover:bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#333] transition-all duration-200 shadow-lg"
        aria-label="Volver a la página principal"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Atrás</span>
      </button>
      
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/NBlogo.png"
            alt="Logo"
            className="w-28 h-28 mb-4 rounded-full shadow-lg"
          />
          <h1 className="text-4xl font-bold text-yellow-500">NUBLACK</h1>
          <p className="text-base text-gray-400">Panel de Administración</p>
        </div>

        {/* Bienvenida */}
        <h2 className="text-2xl font-bold mb-2 text-center">
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Ingresa tus credenciales para acceder al panel
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none mb-4"
            placeholder="admin@nublack.com"
          />

          <label className="block mb-2 text-sm">Contraseña</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-yellow-500" /> Recordar sesión
            </label>
            <button
              type="button"
              onClick={() => navigate("/recuperar-contrasena")} // 👈 Redirige a recuperar contraseña
              className="text-yellow-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && (
            <p className="bg-red-500 text-white text-sm p-2 rounded mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAdministrador;
