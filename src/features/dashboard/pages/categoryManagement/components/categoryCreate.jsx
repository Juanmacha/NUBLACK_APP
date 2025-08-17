// src/pages/Category/components/Modals/CrearCategoriaModal.jsx
import React, { useState } from "react";
import BaseModal from "./BaseModal";

const CrearCategoriaModal = ({ onClose, onCrear }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "Activo",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }
    onCrear(form);
    onClose();
  };

  return (
    <BaseModal title="Crear Nueva Categoría" onClose={onClose}>
      <div className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre de la categoría"
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear
        </button>
      </div>
    </BaseModal>
  );
};

export default CrearCategoriaModal;
