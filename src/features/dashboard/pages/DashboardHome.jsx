import React, { useState, useEffect } from "react";
import { People, Basket3, Folder, Clipboard, GraphUp, CurrencyEuro, ArrowClockwise } from "react-bootstrap-icons";
import { formatCOPCustom } from "../../../shared/utils/currency";
import { useToastContext } from "../../../shared/context/ToastContext";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import Badge from "../../../shared/components/Badge";

function DashboardHome() {
    const { success, error: showError } = useToastContext();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        usuarios: 0,
        productos: 0,
        categorias: 0,
        solicitudes: 0,
        detalles: 0,
        valorTotal: 0
    });

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        setLoading(true);
        try {
            // Simular delay para mostrar loading
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Cargar usuarios
            const users = JSON.parse(localStorage.getItem('nublack_users') || '[]');
            
            // Cargar productos
            const products = JSON.parse(localStorage.getItem('nublack_products') || '[]');
            
            // Cargar categorías
            const categories = JSON.parse(localStorage.getItem('nublack_categories') || '[]');
            
            // Cargar solicitudes y detalles del nuevo sistema
            const solicitudes = JSON.parse(localStorage.getItem('nublack_solicitudes') || '[]');
            const detalles = JSON.parse(localStorage.getItem('nublack_detalles_solicitudes') || '[]');
            
            // Calcular estadísticas de solicitudes
            const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
            const solicitudesAprobadas = solicitudes.filter(s => s.estado === 'aprobada').length;
            const solicitudesEnCamino = solicitudes.filter(s => s.estado === 'en_camino').length;
            const solicitudesEntregadas = solicitudes.filter(s => s.estado === 'entregada').length;
            const valorTotal = solicitudes.reduce((sum, s) => sum + (s.total || 0), 0);

            setStats({
                usuarios: users.length,
                productos: products.length,
                categorias: categories.length,
                solicitudes: solicitudes.length,
                detalles: detalles.length,
                valorTotal: valorTotal,
                solicitudesPendientes,
                solicitudesAprobadas,
                solicitudesEnCamino,
                solicitudesEntregadas
            });
            
            success('Estadísticas actualizadas', 'Los datos se han actualizado correctamente.');
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            showError('Error al cargar datos', 'Hubo un problema al actualizar las estadísticas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Bienvenido al panel de control de NUBLACK con sistema de solicitudes separado.</p>
            </div>
            
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <People className="w-8 h-8 text-blue-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuarios</h3>
                            <p className="text-3xl font-bold text-blue-600 fade-in number-pulse">{stats.usuarios}</p>
                            <p className="text-sm text-gray-500">Total de usuarios registrados</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Basket3 className="w-8 h-8 text-green-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos</h3>
                            <p className="text-3xl font-bold text-green-600 fade-in number-pulse">{stats.productos}</p>
                            <p className="text-sm text-gray-500">Productos en catálogo</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Folder className="w-8 h-8 text-purple-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Categorías</h3>
                            <p className="text-3xl font-bold text-purple-600 fade-in number-pulse">{stats.categorias}</p>
                            <p className="text-sm text-gray-500">Categorías disponibles</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Clipboard className="w-8 h-8 text-orange-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Solicitudes</h3>
                            <p className="text-3xl font-bold text-orange-600 fade-in number-pulse">{stats.solicitudes}</p>
                            <p className="text-sm text-gray-500">Total de solicitudes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas de solicitudes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-200 hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Clipboard className="w-8 h-8 text-yellow-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pendientes</h3>
                            <p className="text-3xl font-bold text-yellow-600 fade-in number-pulse">{stats.solicitudesPendientes}</p>
                            <p className="text-sm text-gray-500">Solicitudes por revisar</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-green-200 hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Clipboard className="w-8 h-8 text-green-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprobadas</h3>
                            <p className="text-3xl font-bold text-green-600 fade-in number-pulse">{stats.solicitudesAprobadas}</p>
                            <p className="text-sm text-gray-500">Solicitudes aprobadas</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Clipboard className="w-8 h-8 text-blue-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">En Camino</h3>
                            <p className="text-3xl font-bold text-blue-600 fade-in number-pulse">{stats.solicitudesEnCamino}</p>
                            <p className="text-sm text-gray-500">Solicitudes en entrega</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <Clipboard className="w-8 h-8 text-purple-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Entregadas</h3>
                            <p className="text-3xl font-bold text-purple-600 fade-in number-pulse">{stats.solicitudesEntregadas}</p>
                            <p className="text-sm text-gray-500">Solicitudes completadas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas financieras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-emerald-200 hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <CurrencyEuro className="w-8 h-8 text-emerald-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Valor Total</h3>
                            <p className="text-3xl font-bold text-emerald-600 fade-in number-pulse">{formatCOPCustom(stats.valorTotal)}</p>
                            <p className="text-sm text-gray-500">Valor total de todas las solicitudes</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-200 hover-lift transition-all duration-200 hover:shadow-lg dashboard-card shine-effect">
                    <div className="flex items-center">
                        <GraphUp className="w-8 h-8 text-indigo-500 mr-3 bounce-gentle" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles</h3>
                            <p className="text-3xl font-bold text-indigo-600 fade-in number-pulse">{stats.detalles}</p>
                            <p className="text-sm text-gray-500">Total de productos solicitados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del sistema */}
            <div className="bg-white p-6 rounded-lg shadow-md border hover-lift transition-all duration-200 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 fade-in">Información del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="slide-in-left">
                        <p className="text-gray-600"><strong>Estructura de datos:</strong> Sistema separado (Solicitudes + Detalles)</p>
                        <p className="text-gray-600"><strong>Almacenamiento:</strong> LocalStorage optimizado</p>
                        <p className="text-gray-600"><strong>Migración:</strong> Compatible con datos anteriores</p>
                    </div>
                    <div className="slide-in-right">
                        <p className="text-gray-600"><strong>Última actualización:</strong> {new Date().toLocaleString()}</p>
                        <p className="text-gray-600"><strong>Estado:</strong> Funcionando correctamente</p>
                        <p className="text-gray-600"><strong>Versión:</strong> 2.0 - Estructura Separada</p>
                    </div>
                </div>
            </div>

            {/* Botón de actualizar */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={cargarEstadisticas}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                    {loading ? (
                        <>
                            <LoadingSpinner size="sm" color="white" />
                            <span className="animate-pulse">Actualizando...</span>
                        </>
                    ) : (
                        <>
                            <ArrowClockwise className="w-4 h-4 transition-transform duration-200 hover:rotate-180" />
                            <span>Actualizar Estadísticas</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default DashboardHome;
