
import React, { useState } from "react";

const CancelacionModal = ({ isOpen, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = () => {
    if (!motivo.trim()) {
      alert("Por favor, explica el motivo de la cancelación.");
      return;
    }
    onConfirm(motivo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] text-[#e5e5e5] rounded-lg shadow-xl max-w-md w-full border border-[#333]">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Cancelar Solicitud</h3>
          <p className="text-gray-400 mb-4">
            ¿Estás seguro de que quieres cancelar esta solicitud? Por favor, explícanos por qué.
          </p>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo de la cancelación..."
            rows={4}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B1E1E]"
          />
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-[#333] text-gray-400 rounded-md hover:bg-[#1a1a1a] transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors font-semibold"
            >
              Confirmar Cancelación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelacionModal;
