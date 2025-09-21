import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserForm = ({ user, onSave, onClose, mode, isProfileEdit = false, users }) => {
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

  const handleNumberInputKeyDown = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name and Last Name validation
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

    // Document Type validation
    if (!formData.documentType) newErrors.documentType = "El tipo de documento es requerido.";

    // Document Number validation
    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = "El número de documento es requerido.";
    } else if (!/^\d+$/.test(formData.documentNumber.trim())) {
      newErrors.documentNumber = "El número de documento solo debe contener dígitos.";
    } else if (users && (mode === 'create' || (mode === 'edit' && formData.documentNumber !== user.documentNumber))) {
      if (users.some(u => u.documentNumber === formData.documentNumber.trim())) {
        newErrors.documentNumber = "Este número de documento ya está registrado.";
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "El teléfono debe contener exactamente 10 dígitos.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (/,/.test(formData.email)) {
      newErrors.email = "El correo electrónico no puede contener comas.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido.";
    } else if (users && (mode === 'create' || (mode === 'edit' && formData.email !== user.email))) {
      if (users.some(u => u.email === formData.email.trim())) {
        newErrors.email = "Este correo electrónico ya está registrado.";
      }
    }

    // Password validation
    if (mode === 'create' || formData.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida.";
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = "La contraseña debe tener al menos 7 caracteres, una mayúscula y un caracter especial.";
      }
      if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    }

    // Role validation
    if (!formData.role && !isProfileEdit) newErrors.role = "El rol es requerido.";
    
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
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Información Personal */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Información Personal
          </h3>
        </div>
        
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Primer Nombre <Required />
          </label>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isViewMode}
              placeholder="Ingresa el primer nombre"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Primer Apellido <Required />
          </label>
          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isViewMode}
              placeholder="Ingresa el primer apellido"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>
      </div>

      {/* Documento de Identidad */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Documento de Identidad
          </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
            Tipo de Documento <Required />
          </label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            disabled={isViewMode}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
              <option value="">Selecciona un tipo</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="PP">Pasaporte</option>
          </select>
            {errors.documentType && <p className="text-xs text-red-500 mt-1">{errors.documentType}</p>}
        </div>
          
          <div className="space-y-2">
            <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">
            Número de Documento <Required />
          </label>
          <input
            id="documentNumber"
            name="documentNumber"
            type="number"
            onKeyDown={handleNumberInputKeyDown}
            value={formData.documentNumber}
            onChange={handleChange}
            disabled={isViewMode}
              placeholder="12345678"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
            {errors.documentNumber && <p className="text-xs text-red-500 mt-1">{errors.documentNumber}</p>}
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Información de Contacto
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono <Required />
        </label>
        <input
          id="phone"
          name="phone"
          type="number"
          onKeyDown={handleNumberInputKeyDown}
          value={formData.phone}
          onChange={handleChange}
          disabled={isViewMode}
              placeholder="3001234567"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico <Required />
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isViewMode}
              placeholder="correo@ejemplo.com"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
        </div>
      </div>

      {!isProfileEdit && (
        <>
          {/* Seguridad y Acceso */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Seguridad y Acceso
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {mode === 'edit' ? 'Nueva Contraseña (opcional)' : <>Contraseña <Required /></>}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                    placeholder={mode === 'edit' ? 'Dejar vacío para no cambiar' : 'Ingresa una contraseña segura'}
                disabled={isViewMode}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
              />
              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                {mode === 'create' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 7 caracteres, una mayúscula y un caracter especial
                  </p>
                )}
          </div>

          {(mode === 'create' || formData.password) && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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
                      placeholder="Confirma tu contraseña"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
            </div>
          </div>

          {/* Rol del Usuario */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Permisos del Usuario
              </h3>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rol del Usuario <Required />
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isViewMode}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Cliente">Cliente</option>
            <option value="Administrador">Administrador</option>
          </select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Los administradores tienen acceso completo al sistema, los clientes solo pueden ver y gestionar sus propios datos.
              </p>
            </div>
        </div>
        </>
      )}

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
        >
          {isViewMode ? "Cerrar" : "Cancelar"}
        </button>
        {!isViewMode && (
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            {mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
