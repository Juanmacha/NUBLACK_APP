
import React, { useState, useEffect } from "react";
import { useCategories } from "../hooks/useCategories";

const CategoryForm = ({ category, onSave, onClose, mode }) => {
  const { categories } = useCategories();
  const [form, setForm] = useState({
    nombre: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        nombre: category.nombre || "",
        descripcion: category.descripcion || "",
        estado: category.estado || "Activo",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre de la categoría es obligatorio.";
    }
    if (!form.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Check for duplicate category name only in create mode
    if (mode === "create") {
      const isDuplicate = categories.some(
        (cat) => cat.nombre.toLowerCase() === form.nombre.toLowerCase()
      );
      if (isDuplicate) {
        setErrors({ ...newErrors, nombre: "Ya existe una categoría con este nombre." });
        return;
      }
    }

    onSave(form);
    onClose();
  };

  const isViewMode = mode === "view";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre de la categoría <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre de la categoría"
          disabled={isViewMode}
          className={`mt-1 block w-full border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
      </div>
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          disabled={isViewMode}
          rows="3"
          className={`mt-1 block w-full border ${errors.descripcion ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
      </div>
      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          disabled={isViewMode}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          {isViewMode ? "Cerrar" : "Cancelar"}
        </button>
        {!isViewMode && (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {mode === "create" ? "Crear" : "Guardar Cambios"}
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
