import React from "react";
import BaseModal from "./BaseModal";

const EliminarCategoriaModal = ({ categoria, onClose, onEliminar }) => {
  if (!categoria) return null;

  return (
    <BaseModal title="Eliminar Categoría" onClose={onClose}>
      <p>
        ¿Estás seguro que deseas eliminar la categoría{" "}
        <strong>{categoria.nombre}</strong>? Esta acción no se puede deshacer.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onEliminar(categoria.id);
            onClose();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </BaseModal>
  );
};

export default EliminarCategoriaModal;
