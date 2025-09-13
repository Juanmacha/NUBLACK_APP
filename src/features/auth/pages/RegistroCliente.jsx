import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../hooks/useAuthClient.jsx";
import { Eye, EyeSlash } from "react-bootstrap-icons";

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuthClient();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNumberInputKeyDown = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.documentType) newErrors.documentType = "El tipo de documento es requerido.";

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = "El número de documento es requerido.";
    } else if (!/^\d+$/.test(formData.documentNumber.trim())) {
      newErrors.documentNumber = "El número de documento solo debe contener dígitos.";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El primer nombre es requerido.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "El nombre solo debe contener letras y espacios.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El primer apellido es requerido.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "El apellido solo debe contener letras y espacios.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "El teléfono debe contener exactamente 10 dígitos.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (/,/.test(formData.email)) {
      newErrors.email = "El correo electrónico no puede contener comas.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':\"|,.<>\/?]).{7,}$/;
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 7 caracteres, una mayúscula y un caracter especial.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setErrors({ form: err.message });
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
              src="/images/NBlogo.png"
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
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
                {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
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
                  type="number"
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  onKeyDown={handleNumberInputKeyDown}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="12345678"
                />
                {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
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
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="Juan"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="Pérez"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                  type="number"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={handleNumberInputKeyDown}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="3001234567"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all"
                  placeholder="registrack@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all pr-10"
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
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#e5e5e5] mb-2"
                >
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#444] rounded-lg text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Error message */}
            {errors.form && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mt-6">
                {errors.form}
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
