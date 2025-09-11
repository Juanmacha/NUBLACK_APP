import React, { useState, useEffect } from "react";
import { X } from "react-bootstrap-icons";
import { formatCOPCustom } from "../../../shared/utils/currency";

const SolicitudModal = ({ isOpen, onClose, onConfirm, cart, subtotal, user }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "",
    documentNumber: "",
    phone: "",
    email: "",
    direccionEntrega: "",
    referenciaDireccion: "",
    metodoPago: "contraEntrega",
  });

  useEffect(() => {
    if (isOpen) {
      const numeroPedido = `PED-${Date.now().toString(36).toUpperCase()}`;
      if (user) {
        const nameParts = user.name ? user.name.split(' ') : [''];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        setFormData(prev => ({
          ...prev,
          ...user,
          firstName: firstName || '',
          lastName: lastName || '',
          numeroPedido,
          fechaSolicitud: new Date().toISOString()
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          numeroPedido,
          fechaSolicitud: new Date().toISOString()
        }));
      }
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.direccionEntrega || !formData.referenciaDireccion) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const solicitudData = {
      ...formData,
      nombreCompleto: `${formData.firstName} ${formData.lastName}`,
      telefonoContacto: formData.phone,
      documentoIdentificacion: `${formData.documentType} ${formData.documentNumber}`,
      correoElectronico: formData.email,
      numeroPedido: formData.numeroPedido,
      fechaSolicitud: formData.fechaSolicitud,
      productos: cart,
      subtotal: subtotal,
      total: subtotal, // Asumiendo que el total es igual al subtotal por ahora
      tiempoEstimadoEntrega: "24-48 horas",
      prioridad: "normal",
      notasInternas: `Cliente: ${formData.firstName} ${formData.lastName} | Tel: ${formData.phone} | Dirección: ${formData.direccionEntrega}`,
    };

    onConfirm(solicitudData);
  };

  if (!isOpen) return null;

  const Required = () => <span className="text-red-500">*</span>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] text-[#e5e5e5] rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#333]">
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
          <h2 className="text-2xl font-bold">
            Solicitud de Domicilio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 border-b border-[#333] pb-2">
                Información Personal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Primer Nombre <Required />
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Primer Apellido <Required />
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Tipo de Documento <Required />
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Número de Documento <Required />
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Teléfono de Contacto <Required />
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Correo Electrónico <Required />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información de Entrega */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 border-b border-[#333] pb-2">
                Información de Entrega
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Dirección de Entrega <Required />
                  </label>
                  <textarea
                    name="direccionEntrega"
                    value={formData.direccionEntrega}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Referencia de Dirección <Required />
                  </label>
                  <input
                    type="text"
                    name="referenciaDireccion"
                    value={formData.referenciaDireccion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preferencias y Método de Pago */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 border-b border-[#333] pb-2">
                Preferencias y Pago
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Método de Pago
                  </label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
                  >
                    <option value="contraEntrega">Contra Entrega</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="mt-8 border-t border-[#333] pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Resumen del Pedido
            </h3>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="space-y-2 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-400">
                      {item.nombre} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatCOPCustom(item.precio * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#333] pt-2">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-[#ffcc00]">{formatCOPCustom(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información para Domiciliario */}
          <div className="mt-6 bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
            <h4 className="font-semibold text-[#e5e5e5] mb-2">Información para Domiciliario:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Cliente:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Teléfono:</strong> {formData.phone}</p>
                <p><strong>Dirección:</strong> {formData.direccionEntrega}</p>
                {formData.referenciaDireccion && (
                  <p><strong>Referencia:</strong> {formData.referenciaDireccion}</p>
                )}
              </div>
              <div>
                <p><strong>Monto a cobrar:</strong> {formatCOPCustom(subtotal)}</p>
                <p><strong>Forma de pago:</strong> {formData.metodoPago === 'contraEntrega' ? 'Contra Entrega' : formData.metodoPago}</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[#333] text-gray-400 rounded-md hover:bg-[#1a1a1a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#4B1E1E] text-white rounded-md hover:bg-[#6a2b2b] transition-colors font-semibold"
            >
              Confirmar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudModal;