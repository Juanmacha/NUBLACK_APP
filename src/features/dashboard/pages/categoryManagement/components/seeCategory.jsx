import React from "react";
import BaseModal from "./BaseModal";

const VerCategoriaModal = ({ categoria, onClose }) => {
  if (!categoria) return null;

  return (
    <BaseModal title="Detalle de Categoría" onClose={onClose}>
      <p><strong>Nombre:</strong> {categoria.nombre}</p>
      <p><strong>Descripción:</strong> {categoria.descripcion}</p>
      <p>
        <strong>Estado:</strong>{" "}
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            categoria.estado === "Activo"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {categoria.estado}
        </span>
      </p>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </BaseModal>
  );
};

export default VerCategoriaModal;
