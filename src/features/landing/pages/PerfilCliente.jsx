import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../../auth/hooks/useAuthClient.jsx";
import { useOrders } from "../hooks/useOrders";
import { formatCOPCustom } from "../../../shared/utils/currency";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Swal from 'sweetalert2';

const PerfilCliente = () => {
  const { user, updateUser } = useAuthClient();
  const { getSolicitudesCompletas, cancelarSolicitud } = useOrders();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [periodo, setPeriodo] = useState("mes_actual");
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
    documentType: "",
    documentNumber: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const filtrarSolicitudesPorPeriodo = (solicitudes, periodo) => {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anoActual = ahora.getFullYear();

    switch (periodo) {
      case "mes_actual":
        return solicitudes.filter((s) => {
          const fechaSolicitud = new Date(s.fechaSolicitud || s.createdAt);
          return (
            fechaSolicitud.getMonth() === mesActual &&
            fechaSolicitud.getFullYear() === anoActual
          );
        });
      case "dos_meses": {
        const haceDosMeses = new Date(anoActual, mesActual - 2, 1);
        return solicitudes.filter(
          (s) => new Date(s.fechaSolicitud || s.createdAt) >= haceDosMeses
        );
      }
      case "seis_meses": {
        const haceSeisMeses = new Date(anoActual, mesActual - 6, 1);
        return solicitudes.filter(
          (s) => new Date(s.fechaSolicitud || s.createdAt) >= haceSeisMeses
        );
      }
      case "todas":
      default:
        return solicitudes;
    }
  };

  const cargarSolicitudes = useCallback(() => {
    setLoading(true);
    try {
      const solicitudesCompletas = getSolicitudesCompletas();
      const solicitudesFiltradas = filtrarSolicitudesPorPeriodo(
        solicitudesCompletas,
        periodo
      );
      setSolicitudes(solicitudesFiltradas);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar solicitudes",
        text: "Hubo un problema al cargar tus solicitudes. Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  }, [getSolicitudesCompletas, periodo]);

  useEffect(() => {
    if (user) {
      cargarSolicitudes();
      setUserData({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        documentType: user.documentType || "",
        documentNumber: user.documentNumber || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, cargarSolicitudes]);

  useEffect(() => {
    if (user) {
      cargarSolicitudes();
    }
  }, [periodo, user, cargarSolicitudes]);

  const handleCancelarSolicitud = async (solicitudId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar solicitud',
      cancelButtonText: 'No, mantener',
    });

    if (result.isConfirmed) {
      cancelarSolicitud(solicitudId, "Cancelado por el cliente"); // Puedes pasar un motivo por defecto o vacío
      cargarSolicitudes(); 
      Swal.fire(
        '¡Cancelada!',
        'La solicitud ha sido cancelada.',
        'success'
      );
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setUserData({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        documentType: user.documentType || "",
        documentNumber: user.documentNumber || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    
    // Validación de nombre
    if (!userData.name.trim()) {
      newErrors.name = "El nombre es requerido.";
    } else if (!/^[a-zA-Z\s]+$/.test(userData.name.trim())) {
      newErrors.name = "El nombre solo debe contener letras y espacios.";
    }
    
    // Validación de apellido
    if (!userData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido.";
    } else if (!/^[a-zA-Z\s]+$/.test(userData.lastName.trim())) {
      newErrors.lastName = "El apellido solo debe contener letras y espacios.";
    }
    
    // Validación de email
    if (!userData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido.";
    }
    
    // Validación de documento
    if (!userData.documentType) {
      newErrors.documentType = "El tipo de documento es requerido.";
    }
    if (!userData.documentNumber.trim()) {
      newErrors.documentNumber = "El número de documento es requerido.";
    } else if (!/^\d+$/.test(userData.documentNumber.trim())) {
      newErrors.documentNumber = "El número de documento solo debe contener dígitos.";
    }
    
    // Validación de teléfono
    if (!userData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido.";
    } else if (!/^\d{10}$/.test(userData.phone.trim())) {
      newErrors.phone = "El teléfono debe contener exactamente 10 dígitos.";
    }
    
    // Validación de contraseña (opcional, solo si se proporciona)
    if (userData.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':\"|,.<>\/?]).{7,}$/;
      if (!passwordRegex.test(userData.password)) {
        newErrors.password = "La contraseña debe tener al menos 7 caracteres, una mayúscula y un caracter especial.";
      }
      if (userData.password !== userData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      await updateUser(userData);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: '¡Perfil Actualizado!',
        text: 'Tu información de perfil ha sido actualizada correctamente.',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar perfil',
        text: 'Hubo un problema al actualizar tu perfil. Por favor, inténtalo de nuevo.',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e5e5e5] mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-400">
            Debes iniciar sesión para ver tu perfil
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffcc00] mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#e5e5e5] mb-2">
              Mi Perfil
            </h1>
            <p className="text-gray-400">Bienvenido, {user.name}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="bg-[#111111] rounded-lg shadow-md p-6 mb-6 border border-[#333]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#e5e5e5]">
              Información Personal
            </h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-[#ffcc00] text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <div>
              {/* Información Personal */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#e5e5e5] mb-4 border-b border-[#333] pb-2">
                  Información Personal
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                      className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                      placeholder="Ingresa tu nombre"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Apellido *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                      placeholder="Ingresa tu apellido"
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
                  
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                      className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                      placeholder="3001234567"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
                </div>

              {/* Documento de Identidad */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#e5e5e5] mb-4 border-b border-[#333] pb-2">
                  Documento de Identidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Documento *</label>
                  <select
                      name="documentType"
                      value={userData.documentType}
                      onChange={handleChange}
                      className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona un tipo</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="PP">Pasaporte</option>
                    </select>
                    {errors.documentType && <p className="text-xs text-red-500 mt-1">{errors.documentType}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Número de Documento *</label>
                    <input
                      type="text"
                      name="documentNumber"
                      value={userData.documentNumber}
                      onChange={handleChange}
                      className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
                      placeholder="12345678"
                    />
                    {errors.documentNumber && <p className="text-xs text-red-500 mt-1">{errors.documentNumber}</p>}
                  </div>
                  </div>
                </div>

              {/* Cambio de Contraseña */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#e5e5e5] mb-4 border-b border-[#333] pb-2">
                  Cambio de Contraseña (Opcional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all pr-10"
                        placeholder="Deja vacío para mantener la actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>
                  
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                  <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={userData.confirmPassword}
                    onChange={handleChange}
                        className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all pr-10"
                        placeholder="Confirma tu nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  La contraseña debe tener al menos 7 caracteres, una mayúscula y un caracter especial.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">
                  <strong>Nombre:</strong>{" "}
                  <span className="text-[#e5e5e5]">{user.name}</span>
                </p>
                <p className="text-gray-400">
                  <strong>Apellido:</strong>{" "}
                  <span className="text-[#e5e5e5]">{user.lastName || "No especificado"}</span>
                </p>
                <p className="text-gray-400">
                  <strong>Email:</strong>{" "}
                  <span className="text-[#e5e5e5]">{user.email}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-400">
                  <strong>Documento:</strong>{" "}
                  <span className="text-[#e5e5e5]">
                    {user.documentType} {user.documentNumber}
                  </span>
                </p>
                <p className="text-gray-400">
                  <strong>Teléfono:</strong>{" "}
                  <span className="text-[#e5e5e5]">{user.phone}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#111111] rounded-lg shadow-md p-6 mb-6 border border-[#333]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#e5e5e5]">
              Mis Solicitudes
            </h2>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-[#1f1f1f] text-white p-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
            >
              <option value="mes_actual">Este mes</option>
              <option value="dos_meses">Últimos 2 meses</option>
              <option value="seis_meses">Últimos 6 meses</option>
              <option value="todas">Todas</option>
            </select>
          </div>
          {solicitudes.length === 0 ? (
            <p className="text-gray-400">No tienes solicitudes realizadas.</p>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="border border-[#333] rounded-lg p-4 bg-[#0f0f0f]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-[#e5e5e5]">
                        Solicitud #
                        {solicitud.numeroPedido || solicitud.id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(
                          solicitud.fechaSolicitud || solicitud.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        solicitud.estado === "pendiente"
                          ? "bg-yellow-900 text-yellow-200"
                          : solicitud.estado === "aprobada"
                          ? "bg-green-900 text-green-200"
                          : solicitud.estado === "en_camino"
                          ? "bg-blue-900 text-blue-200"
                          : solicitud.estado === "entregada"
                          ? "bg-purple-900 text-purple-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {solicitud.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">
                        <strong>Cliente:</strong>{" "}
                        <span className="text-[#e5e5e5]">
                          {solicitud.nombreCompleto}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        <strong>Documento:</strong>{" "}
                        <span className="text-[#e5e5e5]">
                          {solicitud.documentoIdentificacion}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        <strong>Teléfono:</strong>{" "}
                        <span className="text-[#e5e5e5]">
                          {solicitud.telefonoContacto}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        <strong>Dirección:</strong>{" "}
                        <span className="text-[#e5e5e5]">
                          {solicitud.direccionEntrega}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        <strong>Método de Pago:</strong>{" "}
                        <span className="text-[#e5e5e5]">
                          {solicitud.metodoPago === "contraEntrega"
                            ? "Contra Entrega"
                            : solicitud.metodoPago}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        <strong>Tiempo Estimado:</strong>{" "}
                        <span className="text-[#e5e5e5]">
                          {solicitud.tiempoEstimadoEntrega || "24-48 horas"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {(solicitud.referenciaDireccion ||
                    solicitud.horarioPreferido ||
                    solicitud.instruccionesEspeciales ||
                    (solicitud.estado === 'cancelada' && solicitud.motivoCancelacion)) && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#e5e5e5] mb-2">
                        Información Adicional:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {solicitud.referenciaDireccion && (
                          <p className="text-gray-400">
                            <strong>Referencia:</strong>{" "}
                            <span className="text-[#e5e5e5]">
                              {solicitud.referenciaDireccion}
                            </span>
                          </p>
                        )}
                        {solicitud.horarioPreferido && (
                          <p className="text-gray-400">
                            <strong>Horario Preferido:</strong>{" "}
                            <span className="text-[#e5e5e5]">
                              {solicitud.horarioPreferido === "manana"
                                ? "Mañana (8:00 AM - 12:00 PM)"
                                : solicitud.horarioPreferido === "tarde"
                                ? "Tarde (12:00 PM - 6:00 PM)"
                                : solicitud.horarioPreferido === "noche"
                                ? "Noche (6:00 PM - 9:00 PM)"
                                : "Cualquier horario"}
                            </span>
                          </p>
                        )}
                        {solicitud.instruccionesEspeciales && (
                          <p className="text-gray-400">
                            <strong>Instrucciones Especiales:</strong>{" "}
                            <span className="text-[#e5e5e5]">
                              {solicitud.instruccionesEspeciales}
                            </span>
                          </p>
                        )}
                        {solicitud.estado === 'cancelada' && solicitud.motivoCancelacion && (
                          <p className="text-red-500">
                            <strong>Motivo de Cancelación:</strong>{" "}
                            {solicitud.motivoCancelacion}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold text-[#e5e5e5] mb-2">
                      Productos Solicitados:
                    </h4>
                    <div className="space-y-2">
                      {solicitud.detalles &&
                        solicitud.detalles.map((detalle) => (
                          <div
                            key={detalle.id}
                            className="flex justify-between text-sm bg-[#1a1a1a] p-2 rounded border border-[#333]"
                          >
                            <div className="flex items-center">
                              <img
                                src={
                                  detalle.imagenProducto ||
                                  "/images/placeholder.png"
                                }
                                alt={detalle.nombreProducto}
                                className="w-6 h-6 rounded object-cover mr-2"
                              />
                              <span className="text-[#e5e5e5]">
                                {detalle.nombreProducto}
                                {detalle.size && ` (Talla: ${detalle.size})`} x{detalle.cantidad}
                              </span>
                            </div>
                            <span className="text-[#ffcc00]">
                              {formatCOPCustom(detalle.subtotal)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="border-t border-[#333] pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#e5e5e5]">Total:</span>
                      <span className="text-[#ffcc00]">
                        {formatCOPCustom(solicitud.total)}
                      </span>
                    </div>
                  </div>

                  {solicitud.estado === "aprobada" &&
                    solicitud.domiciliario && (
                      <div className="mt-4 p-3 bg-green-900 bg-opacity-20 border border-green-700 rounded">
                        <h5 className="font-semibold text-green-400 mb-2">
                          Domiciliario Asignado:
                        </h5>
                        <p className="text-sm text-green-300">
                          <strong>Nombre:</strong>{" "}
                          {solicitud.domiciliario.nombre}
                        </p>
                        <p className="text-sm text-green-300">
                          <strong>Teléfono:</strong>{" "}
                          {solicitud.domiciliario.telefono}
                        </p>
                        <p className="text-sm text-green-300">
                          <strong>Fecha de asignación:</strong>{" "}
                          {new Date(
                            solicitud.domiciliario.fechaAsignacion
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                  {['pendiente', 'aprobada'].includes(solicitud.estado) && (
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => handleCancelarSolicitud(solicitud.id)}
                        className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancelar Solicitud
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={cargarSolicitudes}
            className="bg-[#4B1E1E] text-white px-6 py-3 rounded-lg hover:bg-[#6a2b2b] transition-colors font-semibold"
          >
            Actualizar Solicitudes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;
