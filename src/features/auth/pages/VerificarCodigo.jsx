import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleVerificar = (e) => {
    e.preventDefault();
    if (codigo.trim() === "123456") { // Ejemplo de validación
      navigate("/restablecer-contrasena");
    } else {
      alert("Código inválido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/images/NBlogo.png" alt="Logo" className="w-28 h-28 mb-4 rounded-full shadow-lg" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">Verificar Código</h2>
        <p className="text-gray-400 text-center mb-6">
          Ingresa el código de verificación que enviamos a tu correo.
        </p>

        <form onSubmit={handleVerificar}>
          <label className="block mb-2 text-sm">Código</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none mb-4"
            placeholder="Código de verificación"
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerificarCodigo;
