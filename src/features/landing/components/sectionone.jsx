import React from "react";
import {
    Truck,
    Shield,
    RefreshCw,
} from "lucide-react"

function SectionOne() {
    return (
        <div id="inicio" className="w-full h-auto bg-[#0a0a0a] flex p-12">
            <div className="p-12">
                <h1 className="text-[#6b5b47] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none pt-32">Descubre tu estilo unico</h1>
                <p className="text-xl font-bold text-[#e5e5e5] pt-6">La mejor colección de zapatos, ropa y accesorios de moda. Calidad premium, precios increíbles y envío gratis en compras superiores a €50.</p>
                <div className="pt-6">
                    <button className="bg-[#6b5b47] text-white py-2 px-4 rounded mr-4 hover:bg-[#C5A880] hover-glow-[#FFC107] font-semibold">Explorar Coleccion</button>
                    <button className="bg-transparent border border-[#6b5b47] text-[#6b5b47] py-2 px-4 rounded font-semibold hover:bg-[#6b5b47] hover:text-[#e5e5e5]">Ver ofertas</button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[#e5e5e5] pt-6">
                    <div className="flex items-center space-x-1">
                        <Truck className="h-4 w-4 text-[#6b5b47]" />
                        <span>Envío Gratis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <RefreshCw className="h-4 w-4 text-[#6b5b47]" />
                        <span>30 días devolución</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-[#6b5b47]" />
                        <span>Compra segura</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <img
                    src="/placeholder.svg?height=500&width=500"
                    width="500"
                    height="500"
                    alt="Modelo de moda"
                    className="aspect-square overflow-hidden rounded-xl object-cover border-2 border-dorado-oscuro hover-glow-dorado"
                />
            </div>
        </div>
    );
}

export default SectionOne;