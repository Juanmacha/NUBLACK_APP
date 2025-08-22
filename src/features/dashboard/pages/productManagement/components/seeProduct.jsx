import React from 'react';

const SeeProduct = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Producto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="text-sm text-gray-900">{product?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <p className="text-sm text-gray-900">{product?.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <p className="text-sm text-gray-900">${product?.price}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <p className="text-sm text-gray-900">{product?.stock}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <p className="text-sm text-gray-900">{product?.category}</p>
            </div>
            {product?.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mt-1"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Creado</label>
              <p className="text-sm text-gray-900">
                {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Actualizado</label>
              <p className="text-sm text-gray-900">
                {product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeProduct;
