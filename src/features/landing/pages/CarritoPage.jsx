import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthClient } from '../../auth/hooks/useAuthClient.jsx';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';

const CarritoPage = () => {
  const { user } = useAuthClient();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createSolicitud } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const subtotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);

  const handleRealizarSolicitud = async () => {
    try {
      await createSolicitud(cart, subtotal);
      clearCart();
      alert('Solicitud realizada exitosamente');
      navigate('/');
    } catch (error) {
      alert('Error al realizar la solicitud: ' + error.message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#e5e5e5] hover:text-[#ffcc00] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Seguir Comprando
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-[#ffcc00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <h1 className="text-2xl font-bold text-[#e5e5e5]">Mi Carrito</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-[#111111] rounded-lg shadow-md p-6 border border-[#333]">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-[#4B1E1E] text-white px-6 py-2 rounded-lg hover:bg-[#6a2b2b] transition-colors"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-[#333] rounded-lg hover:bg-[#1a1a1a] transition-all bg-[#0f0f0f]">
                      <img
                        src={item.imagen || '/images/placeholder.png'}
                        alt={item.nombre}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#e5e5e5]">{item.nombre}</h3>
                        <p className="text-gray-400 text-sm">{item.descripcion}</p>
                        <p className="text-gray-500 text-sm">Talla: M | Color: Blanco</p>
                      </div>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center border border-[#444] rounded hover:bg-[#333] text-[#e5e5e5]"
                        >
                          <span className="text-[#e5e5e5]">-</span>
                        </button>
                        <span className="w-8 text-center font-medium text-[#e5e5e5]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-[#444] rounded hover:bg-[#333] text-[#e5e5e5]"
                        >
                          <span className="text-[#e5e5e5]">+</span>
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-[#ffcc00]">€ {(item.precio * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-400">€ {item.precio.toFixed(2)} c/u</p>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] rounded-lg shadow-md p-6 sticky top-4 border border-[#333]">
              <h2 className="text-xl font-bold text-[#e5e5e5] mb-4">Resumen del pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-semibold text-[#e5e5e5]">€ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío:</span>
                  <span className="text-green-400 font-semibold">Gratis</span>
                </div>
                <div className="border-t border-[#333] pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-[#e5e5e5]">Total:</span>
                    <span className="text-lg font-bold text-[#ffcc00]">€ {subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={handleRealizarSolicitud}
                  className="w-full bg-[#4B1E1E] text-white py-3 px-6 rounded-lg hover:bg-[#6a2b2b] transition-colors font-semibold"
                >
                  Realizar Solicitud
                </button>
              )}

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Envios seguro | Envío 24-48h | Envios y Devoluciones gratuitas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarritoPage;
