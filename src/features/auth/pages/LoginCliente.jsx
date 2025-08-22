import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../hooks/useAuthClient.jsx";

const LoginCliente = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthClient();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await login(formData.email, formData.password);
      
      // Redirigir basado en el rol
      if (session.user.role === "Administrador") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ffcc00] rounded-full mb-4">
            <span className="text-2xl font-bold text-[#0a0a0a]">NB</span>
          </div>
          <h1 className="text-4xl font-bold text-[#ffcc00] mb-2">NUBLACK</h1>
          <p className="text-[#e5e5e5]">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-[#111111] rounded-2xl shadow-2xl p-8 border border-[#333]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4B1E1E] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6a2b2b] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:ring-offset-2 focus:ring-offset-[#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => navigate("/registro")}
                className="text-[#ffcc00] hover:text-[#e6b800] font-medium transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>

          {/* Credenciales demo */}
          <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h3 className="text-sm font-medium text-[#e5e5e5] mb-2">Credenciales Demo:</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p><strong>Admin:</strong> admin@nublack.com / admin123</p>
              <p><strong>Cliente:</strong> Registra una nueva cuenta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCliente;
