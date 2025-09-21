import React from 'react';

function SobreNosotros() {
    return (
        <div id='nosotros' className='w-full h-auto bg-[#0a0a0a] p-12'>
            <div className='flex flex-col md:flex-row items-center md:justify-between'>
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                    <h1 className='text-[#6b5b47] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>Nuestra Filososfia</h1>
                    <p className='text-xl font-bold text-[#e5e5e5] pt-6'>En NUBLACK creemos que la moda urbana debe ir más allá de las tendencias: debe transmitir esencia, calidad y autenticidad.</p>
                    <p className='text-xl font-bold text-[#e5e5e5] pt-6'>Ofrecemos zapatos, mochilas, camisetas y más, diseñados para jóvenes y adultos, hombres y mujeres, que buscan estilo sin sacrificar comodidad ni su bolsillo.</p>
                </div>
                <div className="md:w-1/2 flex items-center justify-center">
                    <img
                        src="/images/3.jpg"
                        width="300"
                        height="250"
                        alt="Nuestra Filosofía - Moda urbana NUBLACK"
                        className="overflow-hidden rounded-xl object-cover border-2 border-dorado-oscuro hover-glow-dorado w-64 h-48 md:w-80 md:h-60 hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = "/images/Jordan.png";
                        }}
                    />
                </div>
            </div>
            <div className='mt-12'>
                <div className="w-full bg-[#0a0a0a] py-8">
                    <h1 className="text-[#6b5b47] text-4xl font-bold text-center mb-14">Cómo Funciona</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-12">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#e5e5e5] text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                                1
                            </div>
                            <h3 className="font-semibold mb-2 text-[#e5e5e5] ">Solicita</h3>
                            <p className="text-gray-300 text-sm">Realiza tu solicitud en nuestra página web</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#e5e5e5]  text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                                2
                            </div>
                            <h3 className="font-semibold mb-2 text-[#e5e5e5] ">Contacto</h3>
                            <p className="text-gray-300 text-sm">Nuestro asesor se pondrá en contacto contigo</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#e5e5e5]  text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                                3
                            </div>
                            <h3 className="font-semibold mb-2 text-[#e5e5e5] ">Entrega</h3>
                            <p className="text-gray-300 text-sm">Coordinamos el domicilio a tu ubicación</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#e5e5e5]  text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                                4
                            </div>
                            <h3 className="font-semibold mb-2 text-[#e5e5e5] ">Pago</h3>
                            <p className="text-gray-300 text-sm">Pago contraentrega con garantía incluida</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SobreNosotros;