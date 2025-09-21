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
    const doc = new jsPDF('p', 'mm', 'a4');
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    const formattedTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Paleta de colores empresarial
    const colors = {
      primary: '#1a365d',      // Azul marino corporativo
      secondary: '#2d3748',    // Gris oscuro
      accent: '#3182ce',       // Azul corporativo
      success: '#38a169',      // Verde éxito
      warning: '#ed8936',      // Naranja advertencia
      light: '#f7fafc',        // Gris muy claro
      dark: '#2d3748',         // Texto oscuro
      border: '#e2e8f0'        // Borde gris
    };

    doc.setFont('helvetica');

    // --- Encabezado Corporativo ---
    const addHeader = () => {
      // Fondo del encabezado
      doc.setFillColor(colors.primary);
      doc.rect(0, 0, 210, 50, 'F');

      try {
        // Logo de la empresa
        const imgData = '/images/NBlogo.png';
        doc.addImage(imgData, 'PNG', 15, 8, 35, 25);
      } catch (e) {
        // Logo de texto si no se puede cargar la imagen
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('NUBACK', 15, 25);
      }

      // Información de la empresa
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255);
      doc.text('Sistema de Gestión de Domicilios', 15, 35);
      doc.text('www.nublack.com', 15, 40);

      // Título del reporte CENTRADO
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('REPORTE DE DOMICILIARIOS', 105, 20, { align: 'center' });

      // Fecha y hora CENTRADAS
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${formattedDate} - ${formattedTime}`, 105, 30, { align: 'center' });
      doc.text(`Total de solicitudes: ${solicitudesFiltradas.filter(s => s.estado === 'aprobada').length}`, 105, 37, { align: 'center' });

      // Línea divisoria
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(15, 55, 195, 55);
    };

    // --- Pie de página profesional ---
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Línea superior del pie
        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.3);
        doc.line(15, 280, 195, 280);
        
        // Información del pie
        doc.setFontSize(8);
        doc.setTextColor(colors.secondary);
        doc.text('NUBACK - Sistema de Gestión de Domicilios', 15, 285);
        doc.text('Documento confidencial - Uso interno únicamente', 15, 290);
        doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
        doc.text('Generado automáticamente', 195, 290, { align: 'right' });
      }
    };

    // --- Tarjeta de solicitud mejorada ---
    const addSolicitudCard = (solicitud, yPosition) => {
      const detallesSolicitud = getDetallesSolicitud(solicitud.id);
      const cardHeight = 85 + (detallesSolicitud.length * 8);

      // Fondo de la tarjeta con sombra sutil
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(colors.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, yPosition, 180, cardHeight, 4, 4, 'FD');

      // Borde superior con color corporativo
      doc.setFillColor(colors.accent);
      doc.rect(15, yPosition, 180, 8, 'F');

      // Número de solicitud destacado
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`SOLICITUD #${solicitud.numeroPedido || solicitud.id.slice(-6)}`, 20, yPosition + 6);

      // Estado de la solicitud
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('APROBADA', 160, yPosition + 6);

      let currentY = yPosition + 20;

      // Información del cliente en dos columnas
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary);
      doc.text('INFORMACIÓN DEL CLIENTE', 20, currentY);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.dark);
      doc.text(`Nombre: ${solicitud.nombreCompleto}`, 20, currentY + 8);
      doc.text(`Teléfono: ${solicitud.telefonoContacto}`, 20, currentY + 14);
      doc.text(`Email: ${solicitud.correoElectronico}`, 20, currentY + 20);

      // Información para el domiciliario
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary);
      doc.text('INFORMACIÓN PARA DOMICILIARIO', 110, currentY);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.dark);
      doc.text(`Dirección: ${solicitud.direccionEntrega}`, 110, currentY + 8);
      doc.text(`Pago: ${solicitud.metodoPago === 'contraEntrega' ? 'Contra Entrega' : solicitud.metodoPago}`, 110, currentY + 14);
      doc.text(`Ref: ${solicitud.referenciaDireccion || 'N/A'}`, 110, currentY + 20);

      currentY += 35;

      // Tabla de productos mejorada
      autoTable(doc, {
        startY: currentY,
        margin: { left: 20, right: 20 },
        tableWidth: 170,
        head: [['PRODUCTO', 'CANT.', 'PRECIO UNIT.', 'SUBTOTAL']],
        body: detallesSolicitud.map(d => [
          d.nombreProducto,
          d.cantidad.toString(),
          formatCOPCustom(d.subtotal / d.cantidad),
          formatCOPCustom(d.subtotal)
        ]),
        foot: [
          ['', '', 'TOTAL PEDIDO:', formatCOPCustom(solicitud.total)]
        ],
        theme: 'striped',
        headStyles: {
          fillColor: [26, 54, 93], // colors.primary
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center'
        },
        footStyles: {
          fillColor: [49, 130, 206], // colors.accent
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [45, 55, 72], // colors.dark
          cellPadding: 4,
          halign: 'left'
        },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [247, 250, 252] // colors.light
        },
        tableLineColor: [226, 232, 240], // colors.border
        tableLineWidth: 0.3
      });

      // Instrucciones para el domiciliario
      currentY += (detallesSolicitud.length * 8) + 25;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.warning);
      doc.text('INSTRUCCIONES IMPORTANTES:', 20, currentY);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.dark);
      doc.text('• Verificar identidad del cliente antes de entregar', 20, currentY + 6);
      doc.text('• Confirmar método de pago antes de la entrega', 20, currentY + 12);
      doc.text('• Reportar cualquier incidencia inmediatamente', 20, currentY + 18);

      return cardHeight + 15;
    };

    // --- Generación del PDF ---
    addHeader();
    let y = 70;

    const solicitudesAprobadas = solicitudesFiltradas.filter(s => s.estado === 'aprobada');

    if (solicitudesAprobadas.length === 0) {
      // Mensaje de estado vacío con diseño profesional
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary);
      doc.text("ESTADO DEL REPORTE", 105, 75, { align: 'center' });
      
      // Caja de información más grande y centrada
      doc.setFillColor(colors.light);
      doc.setDrawColor(colors.border);
      doc.setLineWidth(0.5);
      doc.roundedRect(30, 85, 150, 80, 8, 8, 'FD');
      
      // Icono de información más grande
      doc.setFontSize(32);
      doc.setTextColor(colors.accent);
      doc.text("ℹ", 105, 110, { align: 'center' });
      
      // Mensaje principal
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.dark);
      doc.text("No hay solicitudes aprobadas", 105, 130, { align: 'center' });
      
      // Mensaje secundario
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.secondary);
      doc.text("para generar en este momento", 105, 145, { align: 'center' });
      
      // Información adicional
      doc.setFontSize(10);
      doc.setTextColor(colors.dark);
      doc.text("Este reporte se actualiza automáticamente cuando hay", 105, 160, { align: 'center' });
      doc.text("solicitudes en estado 'Aprobada'", 105, 170, { align: 'center' });
      
      // Información de contacto
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.secondary);
      doc.text("Para más información, contacte al administrador del sistema", 105, 200, { align: 'center' });
      doc.text("o consulte el panel de administración", 105, 210, { align: 'center' });
      
    } else {
      solicitudesAprobadas.forEach((solicitud, index) => {
        const cardHeight = addSolicitudCard(solicitud, y);
        
        // Verificar si necesitamos una nueva página
        if (y + cardHeight > 250) {
          addFooter();
          doc.addPage();
          addHeader();
          y = 60;
          addSolicitudCard(solicitud, y);
        }
        
        y += cardHeight + 10;
      });
    }

    addFooter();
    doc.save(`Reporte_Domiciliarios_${formattedDate.replace(/\//g, '-')}.pdf`);
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