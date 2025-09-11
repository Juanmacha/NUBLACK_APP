import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../../auth/hooks/useAuthClient";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

function FeaturedProducts({ searchTerm = "", onProductClick }) { // Add onProductClick prop
    const navigate = useNavigate();
    const { user } = useAuthClient();
    const { addToCart } = useCart();
    const { products, loading } = useProducts();
    const { categories } = useCategories();
    const [paginaActual, setPaginaActual] = useState(1);
    const [notification, setNotification] = useState(null);

    const activeProducts = products.filter(product => product.estado !== 'inactivo');

    const filteredProducts = activeProducts.filter(producto =>
        !searchTerm ||
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        setPaginaActual(1);
    }, [searchTerm]);

    const productosPorPagina = 8;
    const totalPaginas = Math.ceil(filteredProducts.length / productosPorPagina);
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    const productosPaginados = filteredProducts.slice(indiceInicio, indiceFin);

    const cambiarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaActual(pagina);
        }
    };

    const handleAddToCart = (producto) => {
        if (!user) {
            navigate('/login');
        } else {
            addToCart(producto);
            setNotification(`¡${producto.nombre} añadido al carrito!`);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    if (loading) {
        return (
            <section id="productos" className="w-full p-12 md:py-24 lg:py-32 bg-[#0a0a0a]">
                <div className="container px-4 md:px-6">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffcc00] mx-auto"></div>
                        <p className="text-gray-500 mt-4">Cargando productos...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="productos" className="w-full p-12 md:py-24 lg:py-32 bg-[#0a0a0a]">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#6b5b47]">
                                {searchTerm ? `Resultados para "${searchTerm}"` : "Productos Destacados"}
                            </h1>
                            <p className="text-[#e5e5e5] text-xl md:text-xl/relaxed">
                                {searchTerm
                                    ? `Encontramos ${filteredProducts.length} productos que coinciden con tu búsqueda`
                                    : "Descubre nuestra selección de productos más populares con ofertas especiales"
                                }
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => navigate('/')}
                                    className="text-yellow-400 hover:text-yellow-300 text-sm underline"
                                >
                                    Ver todos los productos
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">No se encontraron productos</h3>
                            <p className="text-gray-500">
                                {searchTerm ? `No hay productos que coincidan con "${searchTerm}"` : "No hay productos disponibles."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4 pl-4">
                                {productosPaginados.map((producto) => (
                                    <div
                                        key={producto.id}
                                        className="bg-[#111111] text-[#f5f5f5] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                                        onClick={() => onProductClick(producto)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={producto.imagen || "/placeholder.svg"}
                                                alt={producto.nombre}
                                                className="w-full h-64 object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <span className="inline-block text-xs px-2 py-1 rounded bg-[#222] text-gray-300 mb-2">
                                                {producto.categoria || 'Sin categoría'}
                                            </span>
                                            <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
                                            <div className="flex items-center mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(producto.rating || 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.262 3.89a1 1 0 00.95.69h4.084c.969 0 1.371 1.24.588 1.81l-3.302 2.397a1 1 0 00-.364 1.118l1.262 3.89c.3.921-.755 1.688-1.54 1.118l-3.302-2.397a1 1 0 00-1.175 0l-3.302 2.397c-.784.57-1.838-.197-1.539-1.118l1.262-3.89a1 1 0 00-.364-1.118L2.17 9.317c-.783-.57-.38-1.81.588-1.81h4.084a1 1 0 00.95-.69l1.262-3.89z" />
                                                    </svg>
                                                ))}
                                                <span className="ml-2 text-sm text-gray-400">({producto.rating || 4.5})</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-[#ffcc00]">€{producto.precio}</span>
                                                {producto.precioOriginal && producto.precioOriginal > producto.precio && (
                                                    <span className="text-sm text-gray-500 line-through">€{producto.precioOriginal}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(producto)}
                                                className="w-full mt-4 bg-[#4B1E1E] hover:bg-[#6a2b2b] text-white font-semibold py-2 rounded"
                                            >
                                                Añadir al Carrito
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPaginas > 1 && (
                                <div className="flex items-center justify-center space-x-2 mt-12">
                                    <button
                                        onClick={() => cambiarPagina(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-[#e5e5e5]"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Anterior
                                    </button>

                                    {[...Array(totalPaginas)].map((_, index) => {
                                        const numeroPagina = index + 1;
                                        return (
                                            <button
                                                key={numeroPagina}
                                                onClick={() => cambiarPagina(numeroPagina)}
                                                className={`w-10 h-8 rounded-md border ${paginaActual === numeroPagina ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
                                            >
                                                {numeroPagina}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => cambiarPagina(paginaActual + 1)}
                                        disabled={paginaActual === totalPaginas}
                                        className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-[#e5e5e5]"
                                    >
                                        Siguiente
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <div className="text-center mt-4 text-sm text-gray-500">
                                Mostrando {indiceInicio + 1} - {Math.min(indiceFin, filteredProducts.length)} de {filteredProducts.length} productos
                            </div>
                        </>
                    )}
                </div>
            </section>

            {notification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
                    <span className="mr-2">✓</span>
                    <span>{notification}</span>
                </div>
            )}
        </>
    );
}

export default FeaturedProducts;