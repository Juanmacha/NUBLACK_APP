import React from "react";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";

// Array local por defecto
const productosData = [
    { id: 1, nombre: "Zapatillas Deportivas Premium", precio: 89.99, precioOriginal: 120.0, imagen: "/placeholder.svg?height=300&width=300", categoria: "Deportivo", rating: 4.8, descuento: 25 },
    { id: 2, nombre: "Botas de Cuero Elegantes", precio: 149.99, precioOriginal: 199.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Formal", rating: 4.9, descuento: 25 },
    { id: 3, nombre: "Vestido Casual de Verano", precio: 59.99, precioOriginal: 79.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Vestidos", rating: 4.7, descuento: 25 },
    { id: 4, nombre: "Camisa Formal Blanca", precio: 39.99, precioOriginal: 59.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Camisas", rating: 4.6, descuento: 33 },
    { id: 5, nombre: "Jeans Slim Fit", precio: 69.99, precioOriginal: 89.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Pantalones", rating: 4.8, descuento: 22 },
    { id: 6, nombre: "Chaqueta de Cuero", precio: 199.99, precioOriginal: 299.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Chaquetas", rating: 4.9, descuento: 33 },
    { id: 7, nombre: "Sandalias de Verano", precio: 29.99, precioOriginal: 45.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Calzado", rating: 4.5, descuento: 35 },
    { id: 8, nombre: "Sudadera con Capucha", precio: 49.99, precioOriginal: 69.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Casual", rating: 4.7, descuento: 29 },
    { id: 9, nombre: "Falda Plisada", precio: 34.99, precioOriginal: 49.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Faldas", rating: 4.6, descuento: 30 },
    { id: 10, nombre: "Blazer Ejecutivo", precio: 119.99, precioOriginal: 159.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Formal", rating: 4.8, descuento: 25 },
    { id: 11, nombre: "Tenis Casuales", precio: 79.99, precioOriginal: 99.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Calzado", rating: 4.7, descuento: 20 },
    { id: 12, nombre: "Blusa Floral", precio: 44.99, precioOriginal: 59.99, imagen: "/placeholder.svg?height=300&width=300", categoria: "Blusas", rating: 4.5, descuento: 25 },
];

function FeaturedProducts({
    productosActuales = productosData, // Si no pasan nada, usa el array local
    favoritos = [],
    toggleFavorito = () => { },
    paginaActual = 1,
    totalPaginas = 1,
    cambiarPagina = () => { },
    indiceInicio = 0,
    indiceFin = 0,
    productos = productosData // También que productos tenga por defecto el local
}) {
    return (
        <section id="productos" className="w-full p-12 md:py-24 lg:py-32 bg-[#0a0a0a]">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#6b5b47]">
                            Productos Destacados
                        </h1>
                        <p className="text-[#e5e5e5] text-xl md:text-xl/relaxed">
                            Descubre nuestra selección de productos más populares con ofertas especiales
                        </p>
                    </div>
                </div>

                {/* Grid de productos */}
                <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4 pl-4">
                    {productosActuales.map((producto) => (
                        <div
                            key={producto.id}
                            className="bg-[#111111] text-[#f5f5f5] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                        >
                            {/* Imagen */}
                            <div className="relative">
                                <img
                                    src={producto.imagen || "/placeholder.svg"}
                                    alt={producto.nombre}
                                    className="w-full h-64 object-cover"
                                />
                            </div>

                            {/* Contenido */}
                            <div className="p-4">
                                <span className="inline-block text-xs px-2 py-1 rounded bg-[#222] text-gray-300 mb-2">
                                    {producto.categoria}
                                </span>

                                <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>

                                {/* Rating */}
                                <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(producto.rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-600"
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.262 3.89a1 1 0 00.95.69h4.084c.969 0 1.371 1.24.588 1.81l-3.302 2.397a1 1 0 00-.364 1.118l1.262 3.89c.3.921-.755 1.688-1.54 1.118l-3.302-2.397a1 1 0 00-1.175 0l-3.302 2.397c-.784.57-1.838-.197-1.539-1.118l1.262-3.89a1 1 0 00-.364-1.118L2.17 9.317c-.783-.57-.38-1.81.588-1.81h4.084a1 1 0 00.95-.69l1.262-3.89z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-400">({producto.rating})</span>
                                </div>

                                {/* Precios */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-[#ffcc00]">€{producto.precio}</span>
                                    {producto.precioOriginal > producto.precio && (
                                        <span className="text-sm text-gray-500 line-through">
                                            €{producto.precioOriginal}
                                        </span>
                                    )}
                                </div>

                                {/* Botón */}
                                <button className="w-full mt-4 bg-[#4B1E1E] hover:bg-[#6a2b2b] text-white font-semibold py-2 rounded">
                                    Añadir al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Paginador */}
                <div className="flex items-center justify-center space-x-2 mt-12">
                    <button
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-[#e5e5e5]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </button>

                    {[...Array(totalPaginas)].map((_, index) => {
                        const numeroPagina = index + 1;
                        return (
                            <button
                                key={numeroPagina}
                                onClick={() => cambiarPagina(numeroPagina)}
                                className={`w-10 h-8 rounded-md border ${paginaActual === numeroPagina
                                        ? "bg-black text-white"
                                        : "bg-white hover:bg-gray-100"
                                    }`}
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
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Info de paginación */}
                <div className="text-center mt-4 text-sm text-gray-500">
                    Mostrando {indiceInicio + 1}-
                    {Math.min(indiceFin, productos.length)} de {productos.length} productos
                </div>
            </div>
        </section>
    );
}

export default FeaturedProducts;
