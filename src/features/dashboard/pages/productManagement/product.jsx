import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import ProductTable from "./components/productTable";
import { useProducts } from "./hooks/useProducts";

// Modales
import VerProductoModal from "./components/seeProduct";
import EditarProductoModal from "./components/editProduct";
import EliminarProductoModal from "./components/deleteProduct";
import CrearProductoModal from "./components/productCreate";

function Product() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  const { products, createProduct, updateProduct, deleteProduct } = useProducts();

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);

  // Filtro de productos
  const productosFiltrados = products.filter((prod) => {
    const matchBusqueda =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const matchCategoria =
      filtroCategoria === "todas"
        ? true
        : prod.categoria === filtroCategoria;

    return matchBusqueda && matchCategoria;
  });

  const handleCrearProducto = (nuevoProducto) => {
    createProduct(nuevoProducto);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto max-h-screen p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-500 mb-6">Administra los productos de tu empresa</p>
          </div>
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <span className="text-lg">+</span>
            Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">Filtros de Productos</h2>
          <p className="text-sm text-gray-500 mb-4">Busca y filtra los productos registrados</p>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las categorías</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Ropa">Ropa</option>
              <option value="Muebles">Muebles</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <ProductTable
          products={productosFiltrados}
          onVer={(prod) => setModalVer(prod)}
          onEditar={(prod) => setModalEditar(prod)}
          onEliminar={(id) => deleteProduct(id)}
        />

        {/* Modales */}
        {modalVer && <VerProductoModal producto={modalVer} onClose={() => setModalVer(null)} />}
        {modalEditar && (
          <EditarProductoModal
            producto={modalEditar}
            onClose={() => setModalEditar(null)}
            onGuardar={(data) => updateProduct(data.id, data)}
          />
        )}
        {modalEliminar && (
          <EliminarProductoModal
            producto={modalEliminar}
            onClose={() => setModalEliminar(null)}
            onEliminar={(id) => deleteProduct(id)}
          />
        )}
        {modalCrear && <CrearProductoModal onClose={() => setModalCrear(false)} onCrear={handleCrearProducto} />}
      </div>
    </div>
  );
}

export default Product;
