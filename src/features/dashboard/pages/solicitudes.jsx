import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, GeoAlt, Phone, Person } from 'react-bootstrap-icons';
import { formatCOPCustom } from '../../../shared/utils/currency';
 import CancelacionModal from "../components/CancelacionModal";

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [solicitudToCancel, setSolicitudToCancel] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      const solicitudesData = JSON.parse(localStorage.getItem('nublack_solicitudes') || '[]');
      const detallesData = JSON.parse(localStorage.getItem('nublack_detalles_solicitudes') || '[]');
      setSolicitudes(solicitudesData);
      setDetalles(detallesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = (solicitudId, nuevoEstado, motivoCancelacion = '') => {
    try {
      const solicitudesActualizadas = solicitudes.map(solicitud => {
        if (solicitud.id === solicitudId) {
          const actualizada = {
            ...solicitud,
            estado: nuevoEstado,
            updatedAt: new Date().toISOString(),
          };
          if (nuevoEstado === 'aprobada') {
            actualizada.domiciliario = {
              nombre: 'Domiciliario Asignado',
              telefono: '+34 XXX XXX XXX',
              fechaAsignacion: new Date().toISOString(),
            };
          } else if (nuevoEstado === 'cancelada' && motivoCancelacion) {
            actualizada.motivoCancelacion = motivoCancelacion;
          }
          return actualizada;
        }
        return solicitud;
      });
      setSolicitudes(solicitudesActualizadas);
      localStorage.setItem('nublack_solicitudes', JSON.stringify(solicitudesActualizadas));
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleConfirmCancel = (justificacion) => {
    if (solicitudToCancel) {
      actualizarEstado(solicitudToCancel.id, 'cancelada', justificacion);
      setSolicitudToCancel(null);
      setShowCancelModal(false);
    }
  };

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const matchEstado = !filtroEstado || solicitud.estado === filtroEstado;
    const matchSearch = !searchTerm ||
      solicitud.numeroPedido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchSearch;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobada': return 'bg-green-100 text-green-800';
      case 'en_camino': return 'bg-blue-100 text-blue-800';
      case 'entregada': return 'bg-purple-100 text-purple-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'aprobada': return <CheckCircle className="w-4 h-4" />;
      case 'en_camino': return <GeoAlt className="w-4 h-4" />;
      case 'entregada': return <CheckCircle className="w-4 h-4" />;
      case 'cancelada': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDetallesSolicitud = (solicitudId) => {
    return detalles.filter(detalle => detalle.solicitudId === solicitudId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <p className="text-gray-500 mb-6">Administra y da seguimiento a las solicitudes de domicilio.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">Filtros de Solicitudes</h2>
        <p className="text-sm text-gray-500 mb-4">Busca y filtra las solicitudes registradas</p>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por Nº de pedido o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="en_camino">En Camino</option>
            <option value="entregada">Entregada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Vista de Solicitudes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solicitudesFiltradas.map((solicitud) => {
              const detallesSolicitud = getDetallesSolicitud(solicitud.id);
              return (
                <tr key={solicitud.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{solicitud.nombreCompleto}</div>
                      <div className="text-sm text-gray-500 flex items-center"><Phone className="w-3 h-3 mr-1" />{solicitud.telefonoContacto}</div>
                      <div className="text-sm text-gray-500 flex items-center"><GeoAlt className="w-3 h-3 mr-1" />{solicitud.direccionEntrega?.substring(0, 30)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" title={detallesSolicitud.map(d => d.nombreProducto).join(', ')}>
                    <div className="text-sm font-medium text-gray-900">
                      {detallesSolicitud.length > 0 
                        ? `${detallesSolicitud[0].nombreProducto}${detallesSolicitud.length > 1 ? '...' : ''}` 
                        : 'Sin productos'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{formatCOPCustom(solicitud.total)}</div>
                    <div className="text-xs text-gray-500">{solicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : solicitud.metodoPago}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(solicitud.estado)}`}>
                      {getEstadoIcon(solicitud.estado)}<span className="ml-1 capitalize">{solicitud.estado?.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(solicitud.fechaSolicitud || solicitud.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => { setSelectedSolicitud(solicitud); setShowModal(true); }} className="text-blue-600 hover:text-blue-900" title="Ver detalles"><Eye className="w-4 h-4" /></button>
                      {solicitud.estado === 'pendiente' && (
                        <>
                          <button onClick={() => actualizarEstado(solicitud.id, 'aprobada')} className="text-green-600 hover:text-green-900" title="Aprobar"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => { setSolicitudToCancel(solicitud); setShowCancelModal(true); }} className="text-red-600 hover:text-red-900" title="Cancelar"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      {solicitud.estado === 'aprobada' && (<button onClick={() => actualizarEstado(solicitud.id, 'en_camino')} className="text-blue-600 hover:text-blue-900" title="Marcar en camino"><GeoAlt className="w-4 h-4" /></button>)}
                      {solicitud.estado === 'en_camino' && (<button onClick={() => actualizarEstado(solicitud.id, 'entregada')} className="text-purple-600 hover:text-purple-900" title="Marcar entregada"><CheckCircle className="w-4 h-4" /></button>)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {solicitudesFiltradas.length === 0 && (<div className="text-center py-8 text-gray-500">No hay solicitudes que coincidan con los filtros</div>)}
      </div>

      {/* Modal de Detalles de Solicitud */}
      {showModal && selectedSolicitud && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de Solicitud #{selectedSolicitud.numeroPedido || selectedSolicitud.id.slice(-6)}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Cliente */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Información del Cliente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Person className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Nombre:</span>
                      <span className="ml-2 font-medium">{selectedSolicitud.nombreCompleto}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">Documento:</span>
                      <span className="ml-2 font-medium">{selectedSolicitud.documentoIdentificacion}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="ml-2 font-medium">{selectedSolicitud.telefonoContacto}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{selectedSolicitud.correoElectronico}</span>
                    </div>
                  </div>
                </div>

                {/* Información de Entrega */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Información de Entrega
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <GeoAlt className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                      <div>
                        <span className="text-gray-600">Dirección:</span>
                        <p className="ml-2 font-medium">{selectedSolicitud.direccionEntrega}</p>
                      </div>
                    </div>
                    {selectedSolicitud.indicacionesAdicionales && (
                      <div>
                        <span className="text-gray-600">Indicaciones:</span>
                        <p className="ml-2 font-medium">{selectedSolicitud.indicacionesAdicionales}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Método de Pago:</span>
                      <span className="ml-2 font-medium">
                        {selectedSolicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : selectedSolicitud.metodoPago}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos con nueva estructura */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Productos Solicitados
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {getDetallesSolicitud(selectedSolicitud.id).map((detalle, index) => (
                    <div key={detalle.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center">
                        <img
                          src={detalle.imagenProducto || '/images/placeholder.png'}
                          alt={detalle.nombreProducto}
                          className="w-8 h-8 rounded object-cover mr-3"
                        />
                        <div>
                          <span className="font-medium">{detalle.nombreProducto}</span>
                          <span className="text-gray-500 ml-2">x{detalle.cantidad}</span>
                        </div>
                      </div>
                                             <span className="font-semibold">{formatCOPCustom(detalle.subtotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-300">
                    <span className="text-lg font-bold">Total:</span>
                                                              <span className="text-lg font-bold text-green-600">
                        {formatCOPCustom(selectedSolicitud.total)}
                      </span>
                  </div>
                </div>
              </div>

              {/* Información para Domiciliario */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Información para Domiciliario:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Cliente:</strong> {selectedSolicitud.nombreCompleto}</p>
                    <p><strong>Teléfono:</strong> {selectedSolicitud.telefonoContacto}</p>
                    <p><strong>Dirección:</strong> {selectedSolicitud.direccionEntrega}</p>
                    {selectedSolicitud.referenciaDireccion && (
                      <p><strong>Referencia:</strong> {selectedSolicitud.referenciaDireccion}</p>
                    )}
                  </div>
                  <div>
                                         <p><strong>Monto a cobrar:</strong> {formatCOPCustom(selectedSolicitud.total)}</p>
                    <p><strong>Forma de pago:</strong> {selectedSolicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : selectedSolicitud.metodoPago}</p>
                    <p><strong>Estado actual:</strong> <span className="capitalize">{selectedSolicitud.estado?.replace('_', ' ')}</span></p>
                    {selectedSolicitud.horarioPreferido && (
                      <p><strong>Horario preferido:</strong> {
                        selectedSolicitud.horarioPreferido === 'manana' ? 'Mañana (8:00 AM - 12:00 PM)' :
                        selectedSolicitud.horarioPreferido === 'tarde' ? 'Tarde (12:00 PM - 6:00 PM)' :
                        selectedSolicitud.horarioPreferido === 'noche' ? 'Noche (6:00 PM - 9:00 PM)' :
                        'Cualquier horario'
                      }</p>
                    )}
                  </div>
                </div>
                
                {/* Indicaciones adicionales */}
                {(selectedSolicitud.indicacionesAdicionales || selectedSolicitud.instruccionesEspeciales) && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">Instrucciones de Entrega:</h5>
                    {selectedSolicitud.indicacionesAdicionales && (
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Indicaciones:</strong> {selectedSolicitud.indicacionesAdicionales}
                      </p>
                    )}
                    {selectedSolicitud.instruccionesEspeciales && (
                      <p className="text-sm text-blue-800">
                        <strong>Instrucciones Especiales:</strong> {selectedSolicitud.instruccionesEspeciales}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CancelacionModal 
        show={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSolicitudToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default Solicitudes;