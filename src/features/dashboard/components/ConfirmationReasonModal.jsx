import React, { useState, useEffect } from 'react';
import { XCircle } from 'react-bootstrap-icons';

const ConfirmationReasonModal = ({ show, onClose, onConfirm, title, message, placeholder }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!show) {
      setReason(''); // Clear reason when modal closes
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-700 mb-4">{message}</p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder={placeholder || "Escribe el motivo aquí..."}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={!reason.trim()}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationReasonModal;
