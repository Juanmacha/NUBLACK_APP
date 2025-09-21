import React, { useState, useEffect } from "react";
import { useCategories } from "../../dashboard/pages/categoryManagement/hooks/useCategories";
import jordan from "/images/Jordan.png";

function Categories() {
  const { categories } = useCategories();
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(0);

  const activeCategories = categories.filter(categoria => categoria.estado !== 'Inactivo');

  const currentCategories = activeCategories.slice(startIndex, startIndex + visibleCategoriesCount);

  const maxStartIndex = activeCategories.length > visibleCategoriesCount ? activeCategories.length - visibleCategoriesCount : 0;

  const goToNext = () => {
    setStartIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Mobile
        setVisibleCategoriesCount(2);
      } else { // Desktop
        setVisibleCategoriesCount(4);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeCategories.length > visibleCategoriesCount) {
      const interval = setInterval(() => {
        setStartIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
      }, 4000); // Cambia de categoría cada 4 segundos

      return () => clearInterval(interval);
    }
  }, [startIndex, activeCategories.length, visibleCategoriesCount, maxStartIndex]);

  return (
    <section id="categorias" className="bg-[#0a0a0a]  text-white py-12">
      {/* Título y descripción */}
      <div className="text-center mb-10">
        <h1 className="text-[#6b5b47] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none pt-32">
          Explora Nuestras Categorías
        </h1>
        <p className="text-xl font-bold text-[#e5e5e5] pt-6">
          Encuentra exactamente lo que buscas en nuestras categorías cuidadosamente seleccionadas
        </p>    
      </div>

      {/* Tarjetas */}
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {currentCategories.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-[#111] rounded-lg p-6 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105 hover:shadow-xl min-h-[350px] justify-between"
            >
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center hover:scale-110 transition-transform overflow-hidden mb-4">
                <img
                  src={categoria.imagen || jordan}
                  alt={categoria.nombre}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-2">{categoria.nombre}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{categoria.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {activeCategories.length > visibleCategoriesCount && (
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
    </section>
  );
}

export default Categories;