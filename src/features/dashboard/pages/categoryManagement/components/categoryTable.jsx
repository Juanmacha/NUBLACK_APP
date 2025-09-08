import React, { useState } from "react";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";

const CategoryTable = ({ categorias, onVer, onEditar, onEliminar }) => {
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 4;
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const categoriasActuales = categorias.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(categorias.length / registrosPorPagina);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-bold mb-1">
        Categorías ({categorias.length})
      </h2>

      <p className="text-sm text-gray-500 mb-4">Administra las categorías registradas</p>

      <div className="overflow-y-auto max-h-[300px] border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasActuales.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 border-t">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.nombre}</td>
                <td className="p-3">{cat.descripcion}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${cat.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {cat.estado}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button onClick={() => onVer(cat)} className="text-blue-500 hover:text-blue-700">
                    <FaEye />
                  </button>
                  <button onClick={() => onEditar(cat)} className="text-yellow-500 hover:text-yellow-700">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => onEliminar(cat.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Página {paginaActual} de {totalPaginas}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;