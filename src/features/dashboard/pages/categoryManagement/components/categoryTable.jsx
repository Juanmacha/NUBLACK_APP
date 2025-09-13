import React from 'react';
import { Eye, PencilSquare } from 'react-bootstrap-icons';

const CategoryTable = ({ categorias, onVer, onEditar, onToggleStatus }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categorias.map((category, index) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.nombre}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {category.descripcion}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                    category.estado === 'Activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                  onClick={() => onToggleStatus(category.id, category.estado === 'Activo' ? 'Inactivo' : 'Activo')}
                >
                  {category.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onVer(category)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditar(category)}
                    className="text-green-600 hover:text-green-900"
                    title="Editar"
                  >
                    <PencilSquare className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categorias.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay categorías disponibles
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
