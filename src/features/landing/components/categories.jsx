import React, { useState, useEffect } from "react";
import { useCategories } from "../../dashboard/pages/categoryManagement/hooks/useCategories";

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
      } else if (window.innerWidth < 1024) { // Tablet (lg)
        setVisibleCategoriesCount(3);
      } else if (window.innerWidth < 1280) { // Desktop pequeño (xl)
        setVisibleCategoriesCount(4);
      } else { // Desktop grande (2xl)
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
      <div className="text-center mb-8 px-4 sm:mb-10">
        <h1 className="text-[#6b5b47] text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32">
          Explora Nuestras Categorías
        </h1>
        <p className="text-sm font-bold text-[#e5e5e5] pt-4 sm:text-base md:text-lg lg:text-xl xl:text-xl sm:pt-6 px-4 max-w-4xl mx-auto">
          Encuentra exactamente lo que buscas en nuestras categorías cuidadosamente seleccionadas
        </p>    
      </div>

      {/* Tarjetas */}
      <div className="max-w-7xl mx-auto relative px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {currentCategories.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-[#111] rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105 hover:shadow-xl min-h-[220px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-[320px] justify-between"
            >
              {categoria.imagen ? (
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 bg-gray-200 rounded-lg flex items-center justify-center hover:scale-110 transition-transform overflow-hidden mb-2 sm:mb-3">
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 bg-gray-800 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <div className="text-center text-gray-500">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500">Sin imagen</p>
                  </div>
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{categoria.nombre}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-1">{categoria.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {activeCategories.length > visibleCategoriesCount && (
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
      </div>
    </section>
  );
}

export default Categories;