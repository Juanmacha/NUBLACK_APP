import React, { useState, useEffect } from "react";
import { useAuthClient } from "../../auth/hooks/useAuthClient.jsx";
import { useOrders } from "../hooks/useOrders";
import { formatCOPCustom } from "../../../shared/utils/currency";

const PerfilCliente = () => {
  const { user } = useAuthClient();
  const { getSolicitudesCompletas } = useOrders();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      cargarSolicitudes();
    }
  }, [user]);

  const cargarSolicitudes = () => {
    try {
      const solicitudesCompletas = getSolicitudesCompletas();
      setSolicitudes(solicitudesCompletas);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e5e5e5] mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">Debes iniciar sesión para ver tu perfil</p>
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
        {/* Header del perfil */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e5e5e5] mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Bienvenido, {user.name}</p>
        </div>

        {/* Información del usuario */}
        <div className="bg-[#111111] rounded-lg shadow-md p-6 mb-6 border border-[#333]">
          <h2 className="text-2xl font-bold text-[#e5e5e5] mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400"><strong>Nombre:</strong> <span className="text-[#e5e5e5]">{user.name}</span></p>
              <p className="text-gray-400"><strong>Email:</strong> <span className="text-[#e5e5e5]">{user.email}</span></p>
            </div>
            <div>
              <p className="text-gray-400"><strong>Documento:</strong> <span className="text-[#e5e5e5]">{user.documentType} {user.documentNumber}</span></p>
              <p className="text-gray-400"><strong>Teléfono:</strong> <span className="text-[#e5e5e5]">{user.phone}</span></p>
            </div>
          </div>
        </div>

        {/* Solicitudes */}
        <div className="bg-[#111111] rounded-lg shadow-md p-6 mb-6 border border-[#333]">
          <h2 className="text-2xl font-bold text-[#e5e5e5] mb-4">Mis Solicitudes</h2>
          {solicitudes.length === 0 ? (
            <p className="text-gray-400">No tienes solicitudes realizadas.</p>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <div key={solicitud.id} className="border border-[#333] rounded-lg p-4 bg-[#0f0f0f]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-[#e5e5e5]">Solicitud #{solicitud.numeroPedido || solicitud.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(solicitud.fechaSolicitud || solicitud.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      solicitud.estado === 'pendiente' ? 'bg-yellow-900 text-yellow-200' :
                      solicitud.estado === 'aprobada' ? 'bg-green-900 text-green-200' :
                      solicitud.estado === 'en_camino' ? 'bg-blue-900 text-blue-200' :
                      solicitud.estado === 'entregada' ? 'bg-purple-900 text-purple-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {solicitud.estado}
                    </span>
                  </div>

                  {/* Información del Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400"><strong>Cliente:</strong> <span className="text-[#e5e5e5]">{solicitud.nombreCompleto}</span></p>
                      <p className="text-gray-400"><strong>Documento:</strong> <span className="text-[#e5e5e5]">{solicitud.documentoIdentificacion}</span></p>
                      <p className="text-gray-400"><strong>Teléfono:</strong> <span className="text-[#e5e5e5]">{solicitud.telefonoContacto}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-400"><strong>Dirección:</strong> <span className="text-[#e5e5e5]">{solicitud.direccionEntrega}</span></p>
                      <p className="text-gray-400"><strong>Método de Pago:</strong> <span className="text-[#e5e5e5]">{solicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : solicitud.metodoPago}</span></p>
                      <p className="text-gray-400"><strong>Tiempo Estimado:</strong> <span className="text-[#e5e5e5]">{solicitud.tiempoEstimadoEntrega || '24-48 horas'}</span></p>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  {(solicitud.referenciaDireccion || solicitud.horarioPreferido || solicitud.instruccionesEspeciales) && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#e5e5e5] mb-2">Información Adicional:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {solicitud.referenciaDireccion && (
                          <p className="text-gray-400"><strong>Referencia:</strong> <span className="text-[#e5e5e5]">{solicitud.referenciaDireccion}</span></p>
                        )}
                        {solicitud.horarioPreferido && (
                          <p className="text-gray-400"><strong>Horario Preferido:</strong> <span className="text-[#e5e5e5]">
                            {solicitud.horarioPreferido === 'manana' ? 'Mañana (8:00 AM - 12:00 PM)' :
                             solicitud.horarioPreferido === 'tarde' ? 'Tarde (12:00 PM - 6:00 PM)' :
                             solicitud.horarioPreferido === 'noche' ? 'Noche (6:00 PM - 9:00 PM)' :
                             'Cualquier horario'}
                          </span></p>
                        )}
                        {solicitud.instruccionesEspeciales && (
                          <p className="text-gray-400"><strong>Instrucciones Especiales:</strong> <span className="text-[#e5e5e5]">{solicitud.instruccionesEspeciales}</span></p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Productos con nueva estructura */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#e5e5e5] mb-2">Productos Solicitados:</h4>
                    <div className="space-y-2">
                      {solicitud.detalles && solicitud.detalles.map((detalle, index) => (
                        <div key={detalle.id} className="flex justify-between text-sm bg-[#1a1a1a] p-2 rounded border border-[#333]">
                          <div className="flex items-center">
                            <img
                              src={detalle.imagenProducto || '/images/placeholder.png'}
                              alt={detalle.nombreProducto}
                              className="w-6 h-6 rounded object-cover mr-2"
                            />
                            <span className="text-[#e5e5e5]">{detalle.nombreProducto} x{detalle.cantidad}</span>
                          </div>
                                                     <span className="text-[#ffcc00]">{formatCOPCustom(detalle.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-[#333] pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#e5e5e5]">Total:</span>
                                             <span className="text-[#ffcc00]">{formatCOPCustom(solicitud.total)}</span>
                    </div>
                  </div>

                  {/* Estado de la solicitud */}
                  {solicitud.estado === 'aprobada' && solicitud.domiciliario && (
                    <div className="mt-4 p-3 bg-green-900 bg-opacity-20 border border-green-700 rounded">
                      <h5 className="font-semibold text-green-400 mb-2">Domiciliario Asignado:</h5>
                      <p className="text-sm text-green-300">
                        <strong>Nombre:</strong> {solicitud.domiciliario.nombre}
                      </p>
                      <p className="text-sm text-green-300">
                        <strong>Teléfono:</strong> {solicitud.domiciliario.telefono}
                      </p>
                      <p className="text-sm text-green-300">
                        <strong>Fecha de asignación:</strong> {new Date(solicitud.domiciliario.fechaAsignacion).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón de actualizar */}
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

