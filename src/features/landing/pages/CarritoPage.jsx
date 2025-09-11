import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../../auth/hooks/useAuthClient.jsx";
import { useCart } from "../hooks/useCart";
import SolicitudModal from "../components/SolicitudModal";
import { useOrders } from "../hooks/useOrders";
import { formatCOPCustom } from "../../../shared/utils/currency";
import Swal from 'sweetalert2';

const CarritoPage = () => {
  const { user } = useAuthClient();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createSolicitud } = useOrders();
  const navigate = useNavigate();
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const subtotal = cart.reduce(
    (total, item) => total + item.precio * item.quantity,
    0
  );

  const handleRealizarSolicitud = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito Vacío',
        text: 'Tu carrito está vacío. Agrega productos antes de realizar una solicitud.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    setShowSolicitudModal(true);
  };

  const handleConfirmarSolicitud = async (solicitudData) => {
    try {
      const resultado = await createSolicitud(solicitudData);
      console.log('Solicitud creada exitosamente:', resultado);
      
      clearCart();
      setShowSolicitudModal(false);
      Swal.fire({
        icon: 'success',
        title: '¡Solicitud Enviada!',
        text: 'Tu solicitud ha sido enviada exitosamente. Te contactaremos pronto para la entrega de tu pedido.',
        showConfirmButton: false,
        timer: 3000
      });
      navigate("/perfil");
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar solicitud',
        text: 'Hubo un problema al enviar tu solicitud: ' + (error.message || 'Error desconocido'),
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#e5e5e5]">Carrito de Compras</h1>
            <p className="text-gray-400 mt-2">
              Revisa y confirma tu pedido
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors font-semibold"
          >
            Volver
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-[#e5e5e5] mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-400 mb-6">
              Agrega algunos productos para continuar
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#4B1E1E] text-white px-6 py-3 rounded-lg hover:bg-[#6a2b2b] transition-colors font-semibold"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-[#111111] rounded-lg shadow-md border border-[#333]">
                <div className="p-6 border-b border-[#333]">
                  <h2 className="text-xl font-bold text-[#e5e5e5]">
                    Productos ({cart.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-[#333]">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.imagen || "/images/placeholder.png"}
                          alt={item.nombre}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#e5e5e5] truncate">
                          {item.nombre}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {item.descripcion}
                        </p>
                        <p className="text-[#ffcc00] font-semibold mt-1">
                          {formatCOPCustom(item.precio)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#e5e5e5] hover:bg-[#333] transition-colors flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-[#e5e5e5] font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#e5e5e5] hover:bg-[#333] transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#ffcc00]">
                          {formatCOPCustom(item.precio * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 text-sm mt-1 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t border-[#333]">
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-[#111111] rounded-lg shadow-md p-6 sticky top-4 border border-[#333]">
                <h2 className="text-xl font-bold text-[#e5e5e5] mb-4">
                  Resumen del pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="font-semibold text-[#e5e5e5]">
                      {formatCOPCustom(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Envío:</span>
                    <span className="text-green-400 font-semibold">Gratis</span>
                  </div>
                  <div className="border-t border-[#333] pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-[#e5e5e5]">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-[#ffcc00]">
                        {formatCOPCustom(subtotal)}
                      </span>
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
                  <p>
                    Envios seguro | Envío 24-48h | Envios y Devoluciones gratuitas
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Solicitud */}
      <SolicitudModal
        isOpen={showSolicitudModal}
        onClose={() => setShowSolicitudModal(false)}
        onConfirm={handleConfirmarSolicitud}
        cart={cart}
        subtotal={subtotal}
        user={user}
      />
    </div>
  );
};

export default CarritoPage;
