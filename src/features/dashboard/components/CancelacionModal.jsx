import React, { useState } from 'react';
import Swal from 'sweetalert2';

const CancelacionModal = ({ show, onClose, onConfirm }) => {
  const [justificacion, setJustificacion] = useState('');

  if (!show) {
    return null;
  }

  const handleConfirm = () => {
    if (!justificacion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Justificación Requerida',
        text: 'Por favor, ingrese una justificación para la cancelación.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    onConfirm(justificacion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Confirmar Cancelación de Solicitud</h2>
        </div>
        <div className="p-6">
          <label htmlFor="justificacion" className="block text-sm font-medium text-gray-700 mb-2">
            Motivo de la cancelación <span className="text-red-500">*</span>
          </label>
          <textarea
            id="justificacion"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escriba aquí por qué se cancela la solicitud..."
          />
        </div>
        <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Confirmar Cancelación
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelacionModal;
