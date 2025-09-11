import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEnviarCodigo = (e) => {
    e.preventDefault();
    alert(`Código enviado al correo: ${email}`);
    navigate("/verificar-codigo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/images/NBlogo.png" alt="Logo" className="w-28 h-28 mb-4 rounded-full shadow-lg" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">Recuperar Contraseña</h2>
        <p className="text-gray-400 text-center mb-6">
          Ingresa tu correo electrónico y te enviaremos un código de verificación.
        </p>

        <form onSubmit={handleEnviarCodigo}>
          <label className="block mb-2 text-sm">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none mb-4"
            placeholder="ejemplo@correo.com"
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold"
          >
            Enviar Código
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full mt-3 text-sm text-gray-400 hover:underline"
          >
            ← Volver al inicio de sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarContrasena;
