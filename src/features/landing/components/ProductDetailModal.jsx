import React, { useState, useEffect } from 'react';
import { XCircle } from 'react-bootstrap-icons';
import { formatCOPCustom } from '../../../shared/utils/currency';
import { useCart } from '../hooks/useCart';
import Swal from 'sweetalert2';

const ProductDetailModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    setQuantity(1); // Reset quantity when modal opens
    if (product && product.tallas && product.tallas.length > 0) {
      setSelectedSize(product.tallas[0].talla); // Select the 'talla' property of the first object
    } else {
      setSelectedSize('');
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const availableStock = selectedSize && product.stockPorTalla ? product.stockPorTalla[selectedSize] || 0 : 0;

  const handleIncrement = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, availableStock));
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Swal.fire({
        icon: 'warning',
        title: 'Talla No Seleccionada',
        text: 'Por favor, selecciona una talla.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (quantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad Inválida',
        text: 'La cantidad debe ser al menos 1.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    if (quantity > availableStock) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Insuficiente',
        text: `Solo hay ${availableStock} unidades disponibles para la talla ${selectedSize}.`,
        confirmButtonText: 'Entendido'
      });
      return;
    }

    addToCart(product, selectedSize, quantity);
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al Carrito!',
      text: `${quantity} unidad(es) de ${product.nombre} (Talla: ${selectedSize}) ha(n) sido agregada(s) al carrito.`,
      showConfirmButton: false,
      timer: 1500
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-[#e5e5e5]">
        <div className="flex justify-between items-center p-4 border-b border-[#333]">
          <h2 className="text-2xl font-bold">Detalles del Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <img
              src={product.imagen || '/images/placeholder.png'}
              alt={product.nombre}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-[#ffcc00]">{product.nombre}</h3>
            <p className="text-gray-300 text-lg">{product.descripcion}</p>
            <p className="text-4xl font-extrabold text-white">{formatCOPCustom(product.precio)}</p>
            
            <div className="text-gray-400">
              <p><strong>Categoría:</strong> {product.categoria || 'N/A'}</p>
              {product.genero && (
                <p><strong>Producto para:</strong> {product.genero}</p>
              )}
              <p><strong>Stock Disponible (Talla {selectedSize || 'N/A'}):</strong> {availableStock > 0 ? availableStock : 'Agotado'}</p>
            </div>

            {product.tallas && product.tallas.length > 0 && (
              <div className="flex items-center space-x-4 mt-6">
                <label htmlFor="size-select" className="text-lg font-semibold">Talla:</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {product.tallas
                    .filter(sizeObj => product.stockPorTalla && product.stockPorTalla[sizeObj.talla] > 0) // Filtrar tallas con stock > 0
                    .map((sizeObj) => (
                      <option key={sizeObj.talla} value={sizeObj.talla}>{sizeObj.talla}</option>
                    ))}
                </select>
              </div>
            )}

            {availableStock > 0 ? (
              <div className="flex items-center space-x-4 mt-6">
                <label className="text-lg font-semibold">Cantidad:</label>
                <div className="flex items-center border border-[#555] rounded-md">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-1 bg-[#333] text-white rounded-l-md hover:bg-[#444] focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-[#333] text-white text-center w-12">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-1 bg-[#333] text-white rounded-r-md hover:bg-[#444] focus:outline-none"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#4B1E1E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6a2b2b] transition-colors"
                >
                  Agregar al Carrito
                </button>
              </div>
            ) : (
              <p className="text-red-500 text-xl font-semibold mt-6">Producto Agotado o Talla no disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
