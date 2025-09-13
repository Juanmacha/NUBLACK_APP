import React, { useState, useEffect } from "react";
import CategoryTable from "./components/categoryTable";
import { useCategories } from "./hooks/useCategories";
import { useProducts } from "../productManagement/hooks/useProducts";
// Modales
import VerCategoriaModal from "./components/seeCategory";
import EditarCategoriaModal from "./components/editCategory";
import Swal from 'sweetalert2';

function Category() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(4);

  const { categories, updateCategory } = useCategories();
  const { products } = useProducts();

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);

  // Filtro de categorías
  const categoriasFiltradas = categories.filter((cat) => {
    const matchBusqueda =
      cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cat.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado =
      filtroEstado === "todas"
        ? true
        : filtroEstado === "activa"
        ? cat.estado === "Activo"
        : cat.estado === "Inactivo";

    return matchBusqueda && matchEstado;
  });

  // Paginación
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = categoriasFiltradas.slice(indicePrimerElemento, indiceUltimoElemento);
  const totalPaginas = Math.ceil(categoriasFiltradas.length / elementosPorPagina);

  // Reiniciar a la primera página cuando los filtros cambian
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  const handleToggleCategoryStatus = async (id, newStatus) => {
    const categoryToUpdate = categories.find(cat => cat.id === id);
    if (!categoryToUpdate) {
        Swal.fire('Error', 'La categoría no fue encontrada.', 'error');
        return;
    }

    if (newStatus === 'Inactivo') {
        const associatedProducts = products.filter(product => product.categoria === categoryToUpdate.nombre);
        if (associatedProducts.length > 0) {
            Swal.fire(
                'Error',
                'No se puede desactivar la categoría porque tiene productos asociados.',
                'error'
            );
            return;
        }
    }

    try {
      await updateCategory(id, { estado: newStatus });
      Swal.fire(
        '¡Actualizado!',
        `El estado de la categoría ha sido cambiado a ${newStatus}.`,
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error',
        error.message || 'Hubo un problema al cambiar el estado de la categoría.',
        'error'
      );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto max-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-500 mb-6">Administra las categorías de tu empresa</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">Filtros de Categorías</h2>
        <p className="text-sm text-gray-500 mb-4">Busca y filtra las categorías registradas</p>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas</option>
            <option value="activa">Activo</option>
            <option value="inactiva">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <CategoryTable
        categorias={elementosActuales}
        onVer={(cat) => setModalVer(cat)}
        onEditar={(cat) => setModalEditar(cat)}
        onToggleStatus={handleToggleCategoryStatus}
      />

      {/* Controles de Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPaginaActual(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Anterior
            </button>
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPaginaActual(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  paginaActual === i + 1
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}

      {/* Modales */}
      {modalVer && <VerCategoriaModal categoria={modalVer} onClose={() => setModalVer(null)} />}
      {modalEditar && (
        <EditarCategoriaModal
          categoria={modalEditar}
          onClose={() => setModalEditar(null)}
          onGuardar={async (data) => {
            try {
              await updateCategory(data.id, data);
              Swal.fire(
                '¡Actualizada!',
                'La categoría ha sido actualizada exitosamente.',
                'success'
              );
              setModalEditar(null);
            } catch (error) {
              Swal.fire(
                'Error',
                error.message || 'Hubo un problema al actualizar la categoría.',
                'error'
              );
            }
          }}
        />
      )}
    </div>
  );
}

export default Category;