import React, { useState } from 'react';

const ConfirmationModal = ({ show, onClose, onConfirm, title, message, confirmButtonText, showReasonInput = true }) => {
  const [reason, setReason] = useState('');

  if (!show) {
    return null;
  }

  const handleConfirm = () => {
    if (showReasonInput && !reason.trim()) {
      alert('Por favor, ingrese un motivo.');
      return;
    }
    onConfirm(reason);
    setReason(''); // Clear reason after confirmation
  };

  const handleClose = () => {
    setReason(''); // Clear reason on close
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">{message}</p>
          {showReasonInput && (
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo <span className="text-red-500">*</span>
            </label>
          )}
          {showReasonInput && (
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escriba aquí el motivo..."
            />
          )}
        </div>
        <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
