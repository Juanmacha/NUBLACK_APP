import React, { useState } from "react";
import CategoryTable from "./components/categoryTable";
import { useCategories } from "./hooks/useCategories";
import { Notification } from "./components/Notification";

// Modales
import VerCategoriaModal from "./components/seeCategory";
import EditarCategoriaModal from "./components/editCategory";
import ConfirmationReasonModal from "../../components/ConfirmationReasonModal"; // Import the new modal
import CrearCategoriaModal from "./components/categoryCreate";

function Category() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");

  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for confirmation modal
  const [categoryToDelete, setCategoryToDelete] = useState(null); // State to hold category to delete
  const [modalCrear, setModalCrear] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const handleCrearCategoria = (nuevaCategoria) => {
    createCategory(nuevaCategoria);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (reason) => {
    try {
      await deleteCategory(categoryToDelete.id, reason);
      setNotification({ message: `Categoría '${categoryToDelete.nombre}' eliminada con éxito.`, type: 'success' });
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex-1 overflow-y-auto max-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-500 mb-6">Administra las categorías de tu empresa</p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <span className="text-lg">+</span>
          Nueva Categoría
        </button>
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
        categorias={categoriasFiltradas}
        onVer={(cat) => setModalVer(cat)}
        onEditar={(cat) => setModalEditar(cat)}
        onEliminar={(cat) => handleDeleteClick(cat)} // Pass the whole category object
      />

      {/* Modales */}
      {modalVer && <VerCategoriaModal categoria={modalVer} onClose={() => setModalVer(null)} />}
      {modalEditar && (
        <EditarCategoriaModal
          categoria={modalEditar}
          onClose={() => setModalEditar(null)}
          onGuardar={(data) => updateCategory(data.id, data)}
        />
      )}
      {showDeleteConfirm && categoryToDelete && (
        <ConfirmationReasonModal
          show={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación de Categoría"
          message={`¿Estás seguro que deseas eliminar la categoría '${categoryToDelete.nombre}'? Esta acción no se puede deshacer.`}
          placeholder="Escribe el motivo de la eliminación..."
        />
      )}
      {modalCrear && <CrearCategoriaModal onClose={() => setModalCrear(false)} onCrear={handleCrearCategoria} />}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}

export default Category;
