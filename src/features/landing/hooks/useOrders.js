import { useCallback, useMemo } from 'react';
import { useAuthClient } from '../../auth/hooks/useAuthClient.jsx';

// Claves del localStorage para la nueva estructura
const SOLICITUDES_STORAGE_KEY = 'nublack_solicitudes';
const DETALLES_STORAGE_KEY = 'nublack_detalles_solicitudes';

// Funciones para cargar datos
const loadSolicitudes = () => {
  try {
    const stored = localStorage.getItem(SOLICITUDES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading solicitudes:', error);
    return [];
  }
};

const loadDetalles = () => {
  try {
    const stored = localStorage.getItem(DETALLES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading detalles:', error);
    return [];
  }
};

// Funciones para guardar datos
const saveSolicitudes = (solicitudes) => {
  try {
    localStorage.setItem(SOLICITUDES_STORAGE_KEY, JSON.stringify(solicitudes));
  } catch (error) {
    console.error('Error saving solicitudes:', error);
  }
};

const saveDetalles = (detalles) => {
  try {
    localStorage.setItem(DETALLES_STORAGE_KEY, JSON.stringify(detalles));
  } catch (error) {
    console.error('Error saving detalles:', error);
  }
};

// Generar IDs únicos
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function useOrders() {
  const { user } = useAuthClient();

  // Obtener todas las solicitudes del usuario
  const getAllSolicitudes = useCallback(() => {
    if (!user?.email) return [];
    
    const solicitudes = loadSolicitudes();
    return solicitudes.filter(solicitud => solicitud.userEmail === user.email);
  }, [user?.email]);

  // Obtener solicitudes con sus detalles
  const getSolicitudesCompletas = useCallback(() => {
    if (!user?.email) return [];
    
    const solicitudes = loadSolicitudes();
    const detalles = loadDetalles();
    
    return solicitudes
      .filter(solicitud => solicitud.userEmail === user.email)
      .map(solicitud => {
        const detallesSolicitud = detalles.filter(detalle => 
          detalle.solicitudId === solicitud.id
        );
        return {
          ...solicitud,
          detalles: detallesSolicitud
        };
      });
  }, [user?.email]);

  // Obtener solo solicitudes (sin detalles)
  const getSolicitudes = useCallback(() => {
    return getAllSolicitudes();
  }, [getAllSolicitudes]);

  // Obtener detalles de una solicitud específica
  const getDetallesSolicitud = useCallback((solicitudId) => {
    const detalles = loadDetalles();
    return detalles.filter(detalle => detalle.solicitudId === solicitudId);
  }, []);

  // Crear nueva solicitud con detalles
  const createSolicitud = useCallback((solicitudData) => {
    if (!user?.email) throw new Error('Usuario no autenticado');
    
    // 1. Crear la solicitud principal
    const nuevaSolicitud = {
      id: generateId(),
      numeroPedido: solicitudData.numeroPedido,
      fechaSolicitud: solicitudData.fechaSolicitud,
      estado: 'pendiente',
      total: solicitudData.subtotal,
      tiempoEstimadoEntrega: solicitudData.tiempoEstimadoEntrega,
      prioridad: solicitudData.prioridad || 'normal',
      notasInternas: solicitudData.notasInternas,
      
      // Información del cliente
      nombreCompleto: solicitudData.nombreCompleto,
      documentoIdentificacion: solicitudData.documentoIdentificacion,
      telefonoContacto: solicitudData.telefonoContacto,
      correoElectronico: solicitudData.correoElectronico,
      direccionEntrega: solicitudData.direccionEntrega,
      indicacionesAdicionales: solicitudData.indicacionesAdicionales,
      referenciaDireccion: solicitudData.referenciaDireccion,
      instruccionesEspeciales: solicitudData.instruccionesEspeciales,
      horarioPreferido: solicitudData.horarioPreferido,
      
      // Información de pago
      metodoPago: solicitudData.metodoPago,
      
      // Información del sistema
      createdAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name
    };

    // 2. Crear los detalles de productos
    const nuevosDetalles = solicitudData.productos.map(producto => ({
      id: generateId(),
      solicitudId: nuevaSolicitud.id,
      productoId: producto.id,
      nombreProducto: producto.nombre,
      descripcionProducto: producto.descripcion || '',
      imagenProducto: producto.imagen || '',
      cantidad: producto.quantity,
      precioUnitario: producto.precio,
      subtotal: producto.precio * producto.quantity
    }));

    // 3. Guardar en localStorage
    const solicitudes = loadSolicitudes();
    const detalles = loadDetalles();
    
    solicitudes.push(nuevaSolicitud);
    detalles.push(...nuevosDetalles);
    
    saveSolicitudes(solicitudes);
    saveDetalles(detalles);

    // Debug logs
    console.log('Nueva solicitud creada:', nuevaSolicitud);
    console.log('Detalles creados:', nuevosDetalles);
    console.log('Total solicitudes:', solicitudes.length);
    console.log('Total detalles:', detalles.length);

    return {
      solicitud: nuevaSolicitud,
      detalles: nuevosDetalles
    };
  }, [user?.email, user?.name]);

  // Actualizar estado de solicitud
  const updateSolicitudEstado = useCallback((solicitudId, nuevoEstado) => {
    const solicitudes = loadSolicitudes();
    const solicitudIndex = solicitudes.findIndex(s => s.id === solicitudId);
    
    if (solicitudIndex !== -1) {
      solicitudes[solicitudIndex].estado = nuevoEstado;
      solicitudes[solicitudIndex].updatedAt = new Date().toISOString();
      
      // Si se aprueba, agregar información del domiciliario
      if (nuevoEstado === 'aprobada') {
        solicitudes[solicitudIndex].domiciliario = {
          nombre: 'Domiciliario Asignado',
          telefono: '+34 XXX XXX XXX',
          fechaAsignacion: new Date().toISOString()
        };
      }
      
      saveSolicitudes(solicitudes);
      return true;
    }
    return false;
  }, []);

  // Agregar producto a solicitud existente
  const addProductoToSolicitud = useCallback((solicitudId, producto) => {
    const detalles = loadDetalles();
    const solicitudes = loadSolicitudes();
    
    // Verificar que la solicitud existe
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) throw new Error('Solicitud no encontrada');
    
    // Crear nuevo detalle
    const nuevoDetalle = {
      id: generateId(),
      solicitudId: solicitudId,
      productoId: producto.id,
      nombreProducto: producto.nombre,
      descripcionProducto: producto.descripcion || '',
      imagenProducto: producto.imagen || '',
      cantidad: producto.quantity,
      precioUnitario: producto.precio,
      subtotal: producto.precio * producto.quantity
    };
    
    // Agregar detalle
    detalles.push(nuevoDetalle);
    saveDetalles(detalles);
    
    // Actualizar total de la solicitud
    const detallesSolicitud = detalles.filter(d => d.solicitudId === solicitudId);
    const nuevoTotal = detallesSolicitud.reduce((sum, d) => sum + d.subtotal, 0);
    
    solicitud.total = nuevoTotal;
    solicitud.updatedAt = new Date().toISOString();
    saveSolicitudes(solicitudes);
    
    return nuevoDetalle;
  }, []);

  // Remover producto de solicitud
  const removeProductoFromSolicitud = useCallback((solicitudId, detalleId) => {
    const detalles = loadDetalles();
    const solicitudes = loadSolicitudes();
    
    // Remover detalle
    const detallesFiltrados = detalles.filter(d => d.id !== detalleId);
    saveDetalles(detallesFiltrados);
    
    // Actualizar total de la solicitud
    const detallesSolicitud = detallesFiltrados.filter(d => d.solicitudId === solicitudId);
    const nuevoTotal = detallesSolicitud.reduce((sum, d) => sum + d.subtotal, 0);
    
    const solicitudIndex = solicitudes.findIndex(s => s.id === solicitudId);
    if (solicitudIndex !== -1) {
      solicitudes[solicitudIndex].total = nuevoTotal;
      solicitudes[solicitudIndex].updatedAt = new Date().toISOString();
      saveSolicitudes(solicitudes);
    }
    
    return true;
  }, []);

  // Obtener estadísticas
  const getEstadisticas = useCallback(() => {
    const solicitudes = loadSolicitudes();
    const detalles = loadDetalles();
    
    return {
      totalSolicitudes: solicitudes.length,
      solicitudesPendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
      solicitudesAprobadas: solicitudes.filter(s => s.estado === 'aprobada').length,
      solicitudesEnCamino: solicitudes.filter(s => s.estado === 'en_camino').length,
      solicitudesEntregadas: solicitudes.filter(s => s.estado === 'entregada').length,
      solicitudesCanceladas: solicitudes.filter(s => s.estado === 'cancelada').length,
      totalProductos: detalles.length,
      valorTotal: solicitudes.reduce((sum, s) => sum + s.total, 0)
    };
  }, []);

  // Migrar datos del sistema anterior (si existe)
  const migrarDatosAnteriores = useCallback(() => {
    try {
      const oldOrders = localStorage.getItem('nublack_orders');
      if (!oldOrders) return;
      
      const oldOrdersMap = JSON.parse(oldOrders);
      const solicitudes = [];
      const detalles = [];
      
      Object.values(oldOrdersMap).flat().forEach(order => {
        if (order.type === 'solicitud') {
          // Crear solicitud
          const solicitud = {
            id: order.id,
            numeroPedido: order.numeroPedido,
            fechaSolicitud: order.fechaSolicitud,
            estado: order.estado,
            total: order.subtotal,
            tiempoEstimadoEntrega: order.tiempoEstimadoEntrega,
            prioridad: order.prioridad || 'normal',
            notasInternas: order.notasInternas,
            nombreCompleto: order.nombreCompleto,
            documentoIdentificacion: order.documentoIdentificacion,
            telefonoContacto: order.telefonoContacto,
            correoElectronico: order.correoElectronico,
            direccionEntrega: order.direccionEntrega,
            indicacionesAdicionales: order.indicacionesAdicionales,
            referenciaDireccion: order.referenciaDireccion,
            instruccionesEspeciales: order.instruccionesEspeciales,
            horarioPreferido: order.horarioPreferido,
            metodoPago: order.metodoPago,
            createdAt: order.createdAt,
            userEmail: order.userEmail,
            userName: order.userName
          };
          
          solicitudes.push(solicitud);
          
          // Crear detalles
          if (order.productos) {
            order.productos.forEach(producto => {
              const detalle = {
                id: generateId(),
                solicitudId: order.id,
                productoId: producto.id,
                nombreProducto: producto.nombre,
                descripcionProducto: producto.descripcion || '',
                imagenProducto: producto.imagen || '',
                cantidad: producto.quantity,
                precioUnitario: producto.precio,
                subtotal: producto.precio * producto.quantity
              };
              detalles.push(detalle);
            });
          }
        }
      });
      
      if (solicitudes.length > 0) {
        saveSolicitudes(solicitudes);
        saveDetalles(detalles);
        console.log(`Migrados ${solicitudes.length} solicitudes y ${detalles.length} detalles`);
        
        // Limpiar datos antiguos
        localStorage.removeItem('nublack_orders');
      }
    } catch (error) {
      console.error('Error migrando datos:', error);
    }
  }, []);

  return {
    // Funciones principales
    getSolicitudes,
    getSolicitudesCompletas,
    getDetallesSolicitud,
    createSolicitud,
    updateSolicitudEstado,
    
    // Funciones de productos
    addProductoToSolicitud,
    removeProductoFromSolicitud,
    
    // Utilidades
    getEstadisticas,
    migrarDatosAnteriores,
    
    // Datos directos (para debugging)
    getAllSolicitudes: () => loadSolicitudes(),
    getAllDetalles: () => loadDetalles()
  };
}
