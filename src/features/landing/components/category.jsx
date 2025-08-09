import jorda from "/Jordan.png";

function Categorias() {
  const categorias = [
    {
      nombre: "Calzado Deportivo",
      descripcion: "Comodidad y estilo",
      imagen:jorda
    },
    {
      nombre: "Ropa Casual",
      descripcion: "Para el día a día",
      imagen: jorda
    },
    {
      nombre: "Ropa Formal",
      descripcion: "Elegancia profesional",
      imagen: jorda
    },
    {
      nombre: "Accesorios",
      descripcion: "Completa tu look",
      imagen: jorda
    }
  ];

  return (
    <section className="bg-black text-white py-12">
      {/* Título y descripción */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#b89f7d]">
          Explora Nuestras Categorías
        </h2>
        <p className="text-gray-400 mt-2 max-w-xl mx-auto">
          Encuentra exactamente lo que buscas en nuestras categorías cuidadosamente seleccionadas
        </p>    
      </div>

      {/* Tarjetas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {categorias.map((categoria, index) => (
          <div
            key={index}
            className="bg-[#111] rounded-lg p-4 flex flex-col items-center text-center shadow-lg transition-transform"
          >
            <div className="w-38 h-38 bg-gray-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform overflow-hidden">
              <img
                src={categoria.imagen}
                alt={categoria.nombre}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="mt-4 text-lg font-bold">{categoria.nombre}</h3>
            <p className="text-gray-400 text-sm">{categoria.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categorias;
