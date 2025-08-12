import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importa el hook
import logo from "/NUBLACK.png";

function LoginAdministrador() {
  const navigate = useNavigate(); // 👈 Inicializa navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ejemplo simple de validación
    if (email !== "admin@modastyle.com" || password !== "admin123") {
      setError("Credenciales incorrectas, Intenta de nuevo.");
    } else {
      setError("");
      alert("Inicio de sesión correcto!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
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
            placeholder="admin@modastyle.com"
          />

          <label className="block mb-2 text-sm">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none mb-4"
            placeholder="••••••••"
          />

          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-yellow-500" /> Recordar sesión
            </label>
            <button
              type="button"
              onClick={() => navigate("/recuperar")} // 👈 Redirige a recuperar contraseña
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
