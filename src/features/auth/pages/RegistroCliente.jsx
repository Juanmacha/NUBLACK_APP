import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../hooks/useAuthClient.jsx";
import NBlogo from ".//..//..//..//../public/images/NBlogo.png";

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuthClient();
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

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 mb-4">
            <img
              src={NBlogo}
              alt="NUBLACK Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#ffffff] mb-2">NUBLACK</h1>
          <p className="text-[#e5e5e5]">Crea tu cuenta de cliente</p>
        </div>

        {/* Formulario */}
        <div className="bg-[#111111] rounded-2xl shadow-2xl p-8 border border-[#333]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de Documento */}
              <div>
                <label
                  htmlFor="documentType"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Tipo de Documento *
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>

              {/* Número de Documento */}
              <div>
                <label
                  htmlFor="documentNumber"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Número de Documento *
                </label>
                <input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="12345678"
                />
              </div>

              {/* Primer Nombre */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Primer Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="Juan"
                />
              </div>

              {/* Primer Apellido */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Primer Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="Pérez"
                />
              </div>

              {/* Número de Teléfono */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Número de Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="3001234567"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="registrack@email.com"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Contraseña *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mt-6">
                {error}
              </div>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4B1E1E] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6a2b2b] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:ring-offset-2 focus:ring-offset-[#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#ffffff] hover:text-[#e5e5e5] font-medium transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;
