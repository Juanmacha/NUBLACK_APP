import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserForm = ({ user, onSave, onClose, mode }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "",
    documentNumber: "",
    phone: "",
    email: "",
    password: "",
    role: "Cliente",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        documentType: user.documentType || "",
        documentNumber: user.documentNumber || "",
        phone: user.phone || "",
        email: user.email || "",
        password: "", // No pre-llenar la contraseña
        role: user.role || "Cliente",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "El primer nombre es requerido.";
    if (!formData.lastName) newErrors.lastName = "El primer apellido es requerido.";
    if (!formData.documentType) newErrors.documentType = "El tipo de documento es requerido.";
    if (!formData.documentNumber) newErrors.documentNumber = "El número de documento es requerido.";
    if (!formData.phone) newErrors.phone = "El teléfono es requerido.";
    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido.";
    }
    if (mode === 'create' || formData.password) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida.";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      }
      if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    }
    if (!formData.role) newErrors.role = "El rol es requerido.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    
    const submitData = { ...formData };
    if (mode === 'edit' && !submitData.password) {
      delete submitData.password;
    }
    onSave(submitData);
    onClose();
  };

  const isViewMode = mode === "view";

  const Required = () => <span className="text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Primer Nombre <Required />
          </label>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Primer Apellido <Required />
          </label>
          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
            Tipo de Documento <Required />
          </label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="PP">Pasaporte</option>
          </select>
          {errors.documentType && <p className="text-xs text-red-500">{errors.documentType}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="documentNumber" className="text-sm font-medium text-gray-700">
            Número de Documento <Required />
          </label>
          <input
            id="documentNumber"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.documentNumber && <p className="text-xs text-red-500">{errors.documentNumber}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Teléfono <Required />
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Correo Electrónico <Required />
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          {mode === 'edit' ? 'Nueva Contraseña (opcional)' : <>Contraseña <Required /></>}
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder={mode === 'edit' ? 'Dejar vacío para no cambiar' : ''}
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          {!isViewMode && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {(mode === 'create' || formData.password) && (
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirmar Contraseña <Required />
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isViewMode}
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {!isViewMode && (
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="role" className="text-sm font-medium text-gray-700">
          Rol <Required />
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Cliente">Cliente</option>
          <option value="Administrador">Administrador</option>
        </select>
        {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {isViewMode ? "Cerrar" : "Cancelar"}
        </button>
        {!isViewMode && (
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;