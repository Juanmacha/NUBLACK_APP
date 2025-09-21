import React from "react";

function SectionOne() {
    return (
        <div id="inicio" className="w-full h-auto bg-black flex flex-col md:flex-row items-center justify-center p-6 md:p-12">
            <div className="p-6 md:p-12 text-center md:text-left flex-1">
                <h1 className="text-[#6b5b47] text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none pt-8 md:pt-32">Descubre tu estilo único</h1>
                <p className="text-base sm:text-lg font-bold text-[#e5e5e5] pt-4 md:pt-6">La mejor colección de zapatos, ropa y accesorios de moda. Calidad premium, precios increíbles y envío gratis en compras superiores a €50.</p>
                <div className="pt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <button className="bg-[#6b5b47] text-white py-2 px-4 rounded mr-4 hover:bg-[#C5A880] hover-glow-[#FFC107] font-semibold">Explorar Colección</button>
                    <button className="bg-transparent border border-[#6b5b47] text-[#6b5b47] py-2 px-4 rounded font-semibold hover:bg-[#6b5b47] hover:text-[#e5e5e5]">Ver ofertas</button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[#e5e5e5] pt-6">
                    <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-[#6b5b47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <span>Envío Gratis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-[#6b5b47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>30 días devolución</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-[#6b5b47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Compra segura</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center flex-1">
                <div className="relative">
                    <img
                        src="/images/3.jpg"
                        alt="Descubre tu estilo único"
                        className="w-64 h-48 md:w-80 md:h-60 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 object-cover"
                        onError={(e) => {
                            e.target.src = "/images/Jordan.png";
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default SectionOne;