import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthClient } from "../../auth/hooks/useAuthClient";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { formatCOPCustom } from "../../../shared/utils/currency";

function FeaturedProducts({ searchTerm = "", onProductClick }) {
    const navigate = useNavigate();
    const { user } = useAuthClient();
    const { products, loading } = useProducts();
    const { categories } = useCategories();
    const [notification, setNotification] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleProductsCount, setVisibleProductsCount] = useState(0);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // Agrupar categorías por género
    const categoryGroups = {
        'Hombre': ['Zapatos', 'Ropa', 'Accesorios'],
        'Mujer': ['Zapatos', 'Ropa', 'Accesorios'],
        'Unisex': ['Zapatos', 'Ropa', 'Accesorios']
    };

    // Filtrar productos
    const filteredProducts = products.filter(producto => {
        const searchTermMatch = !searchTerm || 
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
        
        const genderMatch = !selectedGender || producto.genero === selectedGender;
        const categoryMatch = !selectedCategory || producto.categoria === selectedCategory;

        return searchTermMatch && genderMatch && categoryMatch;
    });

    const totalPages = Math.ceil(filteredProducts.length / visibleProductsCount);

    // Efecto para manejar el cambio de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 900) { // Mobile
                setVisibleProductsCount(2);
            } else if (window.innerWidth < 1024) { // Tablet (lg)
                setVisibleProductsCount(2);
            } else if (window.innerWidth < 1280) { // Desktop pequeño (xl)
                setVisibleProductsCount(3);
            } else { // Desktop grande (2xl)
                setVisibleProductsCount(12);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Resetear página cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGender, selectedCategory, searchTerm]);

    // Carrusel automático (solo si el usuario no está interactuando)
    useEffect(() => {
        if (filteredProducts.length > visibleProductsCount && !isUserInteracting) {
            const interval = setInterval(() => {
                setCurrentPage(prev => prev >= totalPages ? 1 : prev + 1);
            }, 4000); // Cambia de página cada 4 segundos

            return () => clearInterval(interval);
        }
    }, [currentPage, filteredProducts.length, visibleProductsCount, totalPages, isUserInteracting]);

    // Calcular productos visibles
    const startIdx = (currentPage - 1) * visibleProductsCount;
    const endIdx = startIdx + visibleProductsCount;
    const currentProducts = filteredProducts.slice(startIdx, endIdx);

    const goToPrev = () => {
        setIsUserInteracting(true);
        setCurrentPage(prev => prev > 1 ? prev - 1 : totalPages);
        // Reanudar carrusel automático después de 10 segundos
        setTimeout(() => setIsUserInteracting(false), 10000);
    };

    const goToNext = () => {
        setIsUserInteracting(true);
        setCurrentPage(prev => prev < totalPages ? prev + 1 : 1);
        // Reanudar carrusel automático después de 10 segundos
        setTimeout(() => setIsUserInteracting(false), 10000);
    };

    const goToPage = (page) => {
        setIsUserInteracting(true);
        setCurrentPage(page);
        // Reanudar carrusel automático después de 10 segundos
        setTimeout(() => setIsUserInteracting(false), 10000);
    };

    if (loading) {
        return (
            <section id="productos" className="w-full py-12 md:py-24 lg:py-32 bg-[#0a0a0a]">
                <div className="container mx-auto px-0 md:px-0">
                    <div className="text-center">
                        <div className="text-[#6b5b47] text-2xl">Cargando productos...</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="productos" className="w-full py-12 md:py-24 lg:py-32 bg-[#0a0a0a]">
                <div className="container mx-auto px-0 md:px-0">
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

                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-6 sm:my-8 px-4">
                        <button
                            onClick={() => setSelectedGender(null)}
                            className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${!selectedGender ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setSelectedGender('Hombre')}
                            className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${selectedGender === 'Hombre' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Hombre
                        </button>
                        <button
                            onClick={() => setSelectedGender('Mujer')}
                            className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${selectedGender === 'Mujer' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Mujer
                        </button>
                        <button
                            onClick={() => setSelectedGender('Unisex')}
                            className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${selectedGender === 'Unisex' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Unisex
                        </button>
                    </div>

                    {selectedGender && (
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-6 sm:my-8 px-4">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${!selectedCategory ? 'bg-blue-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                            >
                                Todas las categorias
                            </button>
                            {categoryGroups[selectedGender] && categoryGroups[selectedGender].map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-blue-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

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
                            <div className="w-full relative px-1">
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 mt-12">
                                    {currentProducts.map((producto) => (
                                        <div
                                            key={producto.id}
                                            className="bg-[#111111] text-[#f5f5f5] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[320px] xl:min-h-[350px] flex flex-col"
                                            onClick={() => onProductClick(producto)}
                                        >
                                            <div className="relative">
                                                <div className="w-full h-32 sm:h-36 md:h-40 lg:h-40 xl:h-44 bg-gray-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform overflow-hidden">
                                                    <img
                                                        src={producto.imagen || "/placeholder.svg"}
                                                        alt={producto.nombre}
                                                        className="object-cover w-full h-full rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 sm:p-4 md:p-4 lg:p-3 xl:p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                <span className="inline-block text-sm sm:text-base px-2 py-1 rounded bg-[#222] text-gray-300 mb-2 sm:mb-3">
                                                    {producto.categoria || 'Sin categoría'}
                                                </span>
                                                <h3 className="text-base sm:text-lg lg:text-base xl:text-lg font-semibold mb-2 sm:mb-3 text-center">
                                                    {producto.nombre}
                                                </h3>
                                                </div>
                                                <div>
                                                <div className="flex items-center justify-center mb-2 sm:mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 ${i < Math.floor(producto.rating || 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.262 3.89a1 1 0 00.95.69h4.084c.969 0 1.371 1.24.588 1.81l-3.302 2.397a1 1 0 00-.364 1.118l1.262 3.89c.3.921-.755 1.688-1.54 1.118l-3.302-2.397a1 1 0 00-1.175 0l-3.302-2.397c-.784.57-1.838-.197-1.539-1.118l1.262-3.89a1 1 0 00-.364-1.118L2.17 9.317c-.783-.57-.38-1.81.588-1.81h4.084a1 1 0 00.95-.69l1.262-3.89z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-3 text-base sm:text-lg text-gray-400">({producto.rating || 4.5})</span>
                                                </div>
                                                <div className="flex items-center justify-center space-x-3">
                                                    <span className="text-lg sm:text-xl lg:text-lg xl:text-xl font-bold text-[#ffcc00]">{formatCOPCustom(producto.precio)}</span>
                                                    {producto.precioOriginal && producto.precioOriginal > producto.precio && (
                                                        <span className="text-base sm:text-lg text-gray-500 line-through">{formatCOPCustom(producto.precioOriginal)}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onProductClick(producto); }}
                                                    className="w-full mt-3 sm:mt-4 md:mt-5 bg-[#4B1E1E] hover:bg-[#6a2b2b] text-white font-semibold py-2 sm:py-3 rounded-lg text-base sm:text-lg"
                                                >
                                                    Ver Detalles
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Botones de navegación del carrusel */}
                                {filteredProducts.length > visibleProductsCount && (
                                    <>
                                        <button
                                            onClick={goToPrev}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={goToNext}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}

                                {/* Paginador numérico */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center space-x-2 mt-8">
                                        <div className="flex space-x-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => goToPage(pageNum)}
                                                        className={`px-3 py-2 rounded-md transition-colors ${
                                                            currentPage === pageNum
                                                                ? 'bg-[#6b5b47] text-white'
                                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
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