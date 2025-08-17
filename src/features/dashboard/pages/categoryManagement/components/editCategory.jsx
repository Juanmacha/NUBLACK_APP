import React, { useState } from "react";
import BaseModal from "./BaseModal";

const EditarCategoriaModal = ({ categoria, onClose, onGuardar }) => {
  const [form, setForm] = useState({ ...categoria });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onGuardar(form);
    onClose();
  };

  if (!categoria) return null;

  return (
    <BaseModal title="Editar Categoría" onClose={onClose}>
      <div className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Guardar
        </button>
      </div>
    </BaseModal>
  );
};

export default EditarCategoriaModal;
