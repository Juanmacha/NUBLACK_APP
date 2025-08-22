import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthClient } from '../../auth/hooks/useAuthClient.jsx';
import { useOrders } from '../hooks/useOrders';

const PerfilCliente = () => {
  const { user, logout } = useAuthClient();
  const { getSolicitudes, getCompras } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const solicitudes = getSolicitudes();
  const compras = getCompras();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#111111] rounded-lg shadow-md p-6 mb-6 border border-[#333]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#e5e5e5]">Mi Perfil</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-[#4B1E1E] text-white px-4 py-2 rounded-lg hover:bg-[#6a2b2b] transition-colors"
              >
                Volver a la Tienda
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-[#e5e5e5] mb-4">Información Personal</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Nombre Completo</label>
                  <p className="text-[#e5e5e5]">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Correo Electrónico</label>
                  <p className="text-[#e5e5e5]">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Tipo de Documento</label>
                  <p className="text-[#e5e5e5]">{user.documentType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Número de Documento</label>
                  <p className="text-[#e5e5e5]">{user.documentNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Teléfono</label>
                  <p className="text-[#e5e5e5]">{user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Rol</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'Administrador' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#e5e5e5] mb-4">Resumen de Actividad</h2>
              <div className="space-y-4">
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <h3 className="font-semibold text-[#e5e5e5]">Solicitudes Realizadas</h3>
                  <p className="text-2xl font-bold text-[#ffcc00]">{solicitudes.length}</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                  <h3 className="font-semibold text-[#e5e5e5]">Compras Realizadas</h3>
                  <p className="text-2xl font-bold text-[#ffcc00]">{compras.length}</p>
                </div>
              </div>
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
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#e5e5e5]">Solicitud #{solicitud.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(solicitud.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      solicitud.status === 'pendiente' ? 'bg-yellow-900 text-yellow-200' :
                      solicitud.status === 'aprobada' ? 'bg-green-900 text-green-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {solicitud.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {solicitud.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-[#e5e5e5]">{item.name} x{item.quantity}</span>
                        <span className="text-[#ffcc00]">€{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#333] pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#e5e5e5]">Total:</span>
                      <span className="text-[#ffcc00]">€{solicitud.subtotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de Compras */}
        <div className="bg-[#111111] rounded-lg shadow-md p-6 border border-[#333]">
          <h2 className="text-2xl font-bold text-[#e5e5e5] mb-4">Historial de Compras</h2>
          {compras.length === 0 ? (
            <p className="text-gray-400">No tienes compras realizadas.</p>
          ) : (
            <div className="space-y-4">
              {compras.map((compra) => (
                <div key={compra.id} className="border border-[#333] rounded-lg p-4 bg-[#0f0f0f]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#e5e5e5]">Compra #{compra.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(compra.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-200">
                      {compra.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {compra.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-[#e5e5e5]">{item.name} x{item.quantity}</span>
                        <span className="text-[#ffcc00]">€{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#333] pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#e5e5e5]">Total:</span>
                      <span className="text-[#ffcc00]">€{compra.subtotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;
