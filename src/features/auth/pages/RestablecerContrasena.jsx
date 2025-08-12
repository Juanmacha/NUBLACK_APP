import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from  "/images/NBlogo.png";

function RestablecerContrasena() {
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const navigate = useNavigate();

  const handleRestablecer = (e) => {
    e.preventDefault();
    if (nuevaContrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert("Contraseña restablecida con éxito ✅");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-28 h-28 mb-4 rounded-full shadow-lg" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">Restablecer Contraseña</h2>
        <p className="text-gray-400 text-center mb-6">
          Ingresa tu nueva contraseña y confírmala.
        </p>

        <form onSubmit={handleRestablecer}>
          <label className="block mb-2 text-sm">Nueva Contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none mb-4"
            placeholder="••••••••"
            required
          />

          <label className="block mb-2 text-sm">Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none mb-4"
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold"
          >
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
}

export default RestablecerContrasena;
