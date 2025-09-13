import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, GeoAlt, Phone, Person, Download, CreditCard } from 'react-bootstrap-icons';
import { formatCOPCustom } from '../../../shared/utils/currency';
import Swal from 'sweetalert2';
import CancelacionModal from "../components/CancelacionModal";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [fechaFiltro, setFechaFiltro] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // 4 elementos por página

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
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar datos',
        text: 'Hubo un problema al cargar las solicitudes. Por favor, inténtalo de nuevo más tarde.',
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar estado',
        text: 'Hubo un problema al actualizar el estado de la solicitud. Por favor, inténtalo de nuevo.',
      });
    }
  };

  const handleConfirmCancel = (justificacion) => {
    if (solicitudToCancel) {
      actualizarEstado(solicitudToCancel.id, 'cancelada', justificacion);
      setSolicitudToCancel(null);
      setShowCancelModal(false);
    }
  };

  const confirmarActualizarEstado = (solicitudId, nuevoEstado) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas cambiar el estado de la solicitud a "${nuevoEstado.replace('_', ' ')}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarEstado(solicitudId, nuevoEstado);
        Swal.fire(
          '¡Actualizado!',
          'El estado de la solicitud ha sido actualizado.',
          'success'
        )
      }
    })
  };

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const matchEstado = !filtroEstado || solicitud.estado === filtroEstado;
    const matchSearch = !searchTerm ||
      solicitud.numeroPedido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFecha = !fechaFiltro || 
      new Date(solicitud.fechaSolicitud || solicitud.createdAt).toLocaleDateString('en-CA') === fechaFiltro;

    return matchEstado && matchSearch && matchFecha;
  });

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = solicitudesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(solicitudesFiltradas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reiniciar a la primera página cuando los filtros cambian
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroEstado, searchTerm, fechaFiltro]);

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    // Colores corporativos
    const primaryColor = '#2c3e50'; // Azul oscuro
    const secondaryColor = '#7f8c8d'; // Gris
    const successColor = '#27ae60'; // Verde

    doc.setFont('Helvetica');

    // --- Encabezado ---
    const addHeader = () => {
      try {
        const imgData = '/images/NBlogo.png'; // Ruta pública
        doc.addImage(imgData, 'PNG', 15, 10, 40, 15);
      } catch (e) {
        console.error("No se pudo cargar el logo. Usando texto como placeholder.");
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia de PDF',
          text: 'No se pudo cargar el logo para el PDF. Se usará texto como placeholder.',
        });
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text("NUBACK", 15, 20);
      }

      // Título
      doc.setFontSize(18);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text('Solicitudes Aprobadas', 200, 20, { align: 'right' });

      // Fecha
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(secondaryColor);
      doc.text(formattedDate, 200, 27, { align: 'right' });

      // Línea divisoria
      doc.setDrawColor(primaryColor);
      doc.line(15, 35, 200, 35);
    };

    // --- Pie de página ---
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text(
          `Documento generado automáticamente por NUBACK – Todos los derechos reservados.`,
          105,
          285,
          { align: 'center' }
        );
        doc.text(`Página ${i} de ${pageCount}`, 200, 285, { align: 'right' });
      }
    };

    // --- Contenido ---
    addHeader();
    let y = 50; // Posición inicial después del encabezado

    const solicitudesAprobadas = solicitudesFiltradas.filter(s => s.estado === 'aprobada');

    if (solicitudesAprobadas.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(secondaryColor);
      doc.text("No hay solicitudes aprobadas para mostrar.", 105, 60, { align: 'center' });
    }

    solicitudesAprobadas.forEach((solicitud) => {
      const detallesSolicitud = getDetallesSolicitud(solicitud.id);
      const cardHeight = 20 + (detallesSolicitud.length * 10) + 50; // Altura estimada de la tarjeta

      if (y + cardHeight > 270) { // Verificar si hay espacio en la página
        addFooter();
        doc.addPage();
        addHeader();
        y = 50;
      }

      // Contenedor de la tarjeta
      doc.setDrawColor(secondaryColor);
      doc.setLineWidth(0.2);
      doc.roundedRect(15, y, 185, cardHeight, 3, 3, 'S');

      // Número de Solicitud
      doc.setFontSize(14);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text(`#${solicitud.numeroPedido || solicitud.id.slice(-6)}`, 20, y + 12);

      // Información del Cliente
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.text('Información del Cliente:', 20, y + 25);
      doc.setFont('Helvetica', 'normal');
      doc.text(`- Nombre: ${solicitud.nombreCompleto}`, 22, y + 32);
      doc.text(`- Teléfono: ${solicitud.telefonoContacto}`, 22, y + 39);
      doc.text(`- Email: ${solicitud.correoElectronico}`, 22, y + 46);

      // Información para el Domiciliario
      doc.setFont('Helvetica', 'bold');
      doc.text('Información para el Domiciliario:', 110, y + 25);
      doc.setFont('Helvetica', 'normal');
      doc.text(`- Dirección: ${solicitud.direccionEntrega}`, 112, y + 32);
      doc.text(`- Método de Pago: ${solicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : solicitud.metodoPago}`, 112, y + 39);
      doc.text(`- Nº Solicitud: #${solicitud.numeroPedido || solicitud.id.slice(-6)}`, 112, y + 46);

      // Productos Solicitados
      autoTable(doc, {
        startY: y + 55,
        margin: { left: 20 },
        tableWidth: 170,
        head: [['Producto', 'Cantidad', 'Valor']],
        body: detallesSolicitud.map(d => [d.nombreProducto, d.cantidad, formatCOPCustom(d.subtotal)]),
        foot: [['', 'Total del Pedido:', formatCOPCustom(solicitud.total)]],
        theme: 'grid',
        headStyles: {
          fillColor: [44, 62, 80], // primaryColor
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        footStyles: {
          fillColor: [236, 240, 241], // Un gris claro
          textColor: [44, 62, 80], // primaryColor
          fontStyle: 'bold',
        },
        styles: {
          cellPadding: 2,
          fontSize: 10,
          valign: 'middle',
          halign: 'left',
        },
        columnStyles: {
          2: { halign: 'right' },
        },
      });

      y += cardHeight + 10; // Espacio entre tarjetas
    });

    addFooter();
    doc.save(`reporte_solicitudes_aprobadas_${formattedDate}.pdf`);
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
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Download />
          Descargar PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">Filtros de Solicitudes</h2>
        <p className="text-sm text-gray-500 mb-4">Busca y filtra las solicitudes registradas</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="en_camino">En Camino</option>
            <option value="entregada">Entregada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vista de Solicitudes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((solicitud, index) => {
              const detallesSolicitud = getDetallesSolicitud(solicitud.id);
              return (
                <tr key={solicitud.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{solicitud.nombreCompleto}</div>
                      <div className="text-sm text-gray-500 flex items-center"><Phone className="w-3 h-3 mr-1" />{solicitud.telefonoContacto}</div>
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
                          <button onClick={() => confirmarActualizarEstado(solicitud.id, 'aprobada')} className="text-green-600 hover:text-green-900" title="Aprobar"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => { setSolicitudToCancel(solicitud); setShowCancelModal(true); }} className="text-red-600 hover:text-red-900" title="Cancelar"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      {solicitud.estado === 'aprobada' && (<button onClick={() => confirmarActualizarEstado(solicitud.id, 'en_camino')} className="text-blue-600 hover:text-blue-900" title="Marcar en camino"><GeoAlt className="w-4 h-4" /></button>)}
                      {solicitud.estado === 'en_camino' && (<button onClick={() => confirmarActualizarEstado(solicitud.id, 'entregada')} className="text-purple-600 hover:text-purple-900" title="Marcar entregada"><CheckCircle className="w-4 h-4" /></button>)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {currentItems.length === 0 && solicitudesFiltradas.length > 0 && (<div className="text-center py-8 text-gray-500">No hay solicitudes en esta página.</div>)}
        {solicitudesFiltradas.length === 0 && (<div className="text-center py-8 text-gray-500">No hay solicitudes que coincidan con los filtros</div>)}
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}

      {/* Modal de Detalles de Solicitud */}
      {showModal && selectedSolicitud && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de Solicitud #{selectedSolicitud.numeroPedido || selectedSolicitud.id.slice(-6)}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              {/* Información del Cliente */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Nombre:</strong> {selectedSolicitud.nombreCompleto}</p>
                  <p><strong>Documento:</strong> {selectedSolicitud.documentoIdentificacion}</p>
                  <p><strong>Teléfono:</strong> {selectedSolicitud.telefonoContacto}</p>
                  <p><strong>Email:</strong> {selectedSolicitud.correoElectronico}</p>
                </div>
              </div>

              <hr className="my-6" />

              {/* Información de Entrega */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Información de Entrega
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><strong>Dirección:</strong> {selectedSolicitud.direccionEntrega}</p>
                    {selectedSolicitud.indicacionesAdicionales && (
                        <p><strong>Indicaciones:</strong> {selectedSolicitud.indicacionesAdicionales}</p>
                    )}
                    <p><strong>Método de Pago:</strong> {selectedSolicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : selectedSolicitud.metodoPago}</p>
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
                          {detalle.size && (
                            <span className="text-gray-500 ml-2">Talla: {detalle.size}</span>
                          )}
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
                {selectedSolicitud.estado === 'cancelada' && selectedSolicitud.motivoCancelacion && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h5 className="font-bold">Motivo de Cancelación</h5>
                    <p>{selectedSolicitud.motivoCancelacion}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Nº Solicitud:</strong> {selectedSolicitud.numeroPedido || selectedSolicitud.id.slice(-6)}</p>
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