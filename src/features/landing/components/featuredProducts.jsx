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
    const [isMobile, setIsMobile] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    const categoryGroups = {
        Hombre: ["Jeans", "Chaquetas", "Sudaderas", "Shorts"],
        Mujer: ["Faldas", "Leggis"],
        Unisex: ["Ropa deportiva", "Zapatos", "Mochilas", "Camisetas"]
    };

    const activeProducts = products.filter(product => product.estado !== 'inactivo');

    const filteredProducts = activeProducts.filter(producto => {
        const searchTermMatch = !searchTerm ||
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const genderMatch = !selectedGender || producto.genero === selectedGender;

        const categoryMatch = !selectedCategory || producto.categoria === selectedCategory;

        return searchTermMatch && genderMatch && categoryMatch;
    });

    const visibleProductsCount = isMobile ? 6 : 8; // 6 for mobile, 8 for desktop
    const currentProducts = filteredProducts.slice(startIndex, startIndex + visibleProductsCount);
    const maxStartIndex = filteredProducts.length > visibleProductsCount ? filteredProducts.length - visibleProductsCount : 0;

    const goToNext = () => {
        setStartIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    };

    const goToPrev = () => {
        setStartIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            const interval = setInterval(() => {
                if (filteredProducts.length > visibleProductsCount) {
                    goToNext();
                }
            }, 3000); // Cambia de producto cada 3 segundos

            return () => clearInterval(interval);
        }
    }, [startIndex, filteredProducts.length, isMobile, visibleProductsCount]);

    useEffect(() => {
        setStartIndex(0); // Reset carousel position when filters change
        setSelectedCategory(null); // Reset category when gender changes
    }, [searchTerm, selectedGender]);

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

                    <div className="flex justify-center space-x-4 my-8">
                        <button
                            onClick={() => setSelectedGender(null)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${!selectedGender ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setSelectedGender('Hombre')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedGender === 'Hombre' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
                        >
                            Hombre
                        </button>
                        <button
                            onClick={() => setSelectedGender('Mujer')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedGender === 'Mujer' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
                        >
                            Mujer
                        </button>
                        <button
                            onClick={() => setSelectedGender('Unisex')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedGender === 'Unisex' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
                        >
                            Unisex
                        </button>
                    </div>

                    {selectedGender && (
                        <div className="flex justify-center space-x-4 my-8">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${!selectedCategory ? 'bg-blue-400 text-black' : 'bg-gray-700 text-white'}`}
                            >
                                Todas las categorias
                            </button>
                            {categoryGroups[selectedGender] && categoryGroups[selectedGender].map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === category ? 'bg-blue-400 text-black' : 'bg-gray-700 text-white'}`}
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
                            

                            <div className="max-w-7xl mx-auto relative">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-32 mt-12 px-6 justify-items-center">
                                    {currentProducts.map((producto) => (
                                        <div
                                            key={producto.id}
                                            className="bg-[#111111] text-[#f5f5f5] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                                            onClick={() => onProductClick(producto)}
                                        >
                                            <div className="relative">
                                                <div className="w-32 h-24 lg:w-64 lg:h-64 bg-gray-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform overflow-hidden mx-auto">
                                                    <img
                                                        src={producto.imagen || "/placeholder.svg"}
                                                        alt={producto.nombre}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <span className="inline-block text-xs px-2 py-1 rounded bg-[#222] text-gray-300 mb-2">
                                                    {producto.categoria || 'Sin categoría'}
                                                </span>
                                                <h3 className="text-lg font-semibold mb-2 text-center">
                                                    {producto.nombre}
                                                </h3>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(producto.rating || 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.262 3.89a1 1 0 00.95.69h4.084c.969 0 1.371 1.24.588 1.81l-3.302 2.397a1 1 0 00-.364 1.118l1.262 3.89c.3.921-.755 1.688-1.54 1.118l-3.302-2.397a1 1 0 00-1.175 0l-3.302-2.397c-.784.57-1.838-.197-1.539-1.118l1.262-3.89a1 1 0 00-.364-1.118L2.17 9.317c-.783-.57-.38-1.81.588-1.81h4.084a1 1 0 00.95-.69l1.262-3.89z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-400">({producto.rating || 4.5})</span>
                                                </div>
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className="text-2xl font-bold text-[#ffcc00]">{formatCOPCustom(producto.precio)}</span>
                                                    {producto.precioOriginal && producto.precioOriginal > producto.precio && (
                                                        <span className="text-sm text-gray-500 line-through">{formatCOPCustom(producto.precioOriginal)}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onProductClick(producto); }}
                                                    className="w-full mt-6 bg-[#4B1E1E] hover:bg-[#6a2b2b] text-white font-semibold py-2 rounded-lg"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filteredProducts.length > visibleProductsCount && (
                                    <>
                                        <button
                                            onClick={goToPrev}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full ml-2 hover:bg-opacity-75"
                                        >
                                            &#10094;
                                        </button>
                                        <button
                                            onClick={goToNext}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full mr-2 hover:bg-opacity-75"
                                        >
                                            &#10095;
                                        </button>
                                    </>
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