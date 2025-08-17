import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import CategoryTable from "./components/categoryTable";
import { Search, Plus } from "lucide-react";

// Modales
import VerCategoriaModal from "./components/seeCategory";
import EditarCategoriaModal from "./components/editCategory";
import EliminarCategoriaModal from "./components/deleteCategory";
import CrearCategoriaModal from "./components/categoryCreate";

function Category() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");

  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Tecnología", descripcion: "Productos electrónicos y gadgets", estado: "Activo" },
    { id: 2, nombre: "Ropa", descripcion: "Moda y accesorios", estado: "Inactivo" },
    { id: 3, nombre: "Muebles", descripcion: "Artículos para el hogar", estado: "Activo" },
  ]);

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);

  // Filtro de categorías
  const categoriasFiltradas = categorias.filter((cat) => {
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
    const nueva = {
      id: categorias.length ? Math.max(...categorias.map((c) => c.id)) + 1 : 1,
      ...nuevaCategoria,
    };
    setCategorias((prev) => [...prev, nueva]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
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
            <Plus size={18} />
            Nueva Categoría
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">Filtros de Categorías</h2>
          <p className="text-sm text-gray-500 mb-4">Busca y filtra las categorías registradas</p>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar categoría..."
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
          onEliminar={(id) => setCategorias((prev) => prev.filter((c) => c.id !== id))}
        />

        {/* Modales */}
        {modalVer && <VerCategoriaModal categoria={modalVer} onClose={() => setModalVer(null)} />}
        {modalEditar && (
          <EditarCategoriaModal
            categoria={modalEditar}
            onClose={() => setModalEditar(null)}
            onGuardar={(data) =>
              setCategorias((prev) => prev.map((c) => (c.id === data.id ? data : c)))
            }
          />
        )}
        {modalEliminar && (
          <EliminarCategoriaModal
            categoria={modalEliminar}
            onClose={() => setModalEliminar(null)}
            onEliminar={(id) =>
              setCategorias((prev) => prev.filter((c) => c.id !== id))
            }
          />
        )}
        {modalCrear && <CrearCategoriaModal onClose={() => setModalCrear(false)} onCrear={handleCrearCategoria} />}
      </div>
    </div>
  );
}

export default Category;
