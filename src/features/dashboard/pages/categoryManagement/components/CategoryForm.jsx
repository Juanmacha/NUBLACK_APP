
import React, { useState, useEffect } from "react";
import { useCategories } from "../hooks/useCategories";
import ImageUpload from "../../../../../shared/components/ImageUpload";
import { useToastContext } from "../../../../../shared/context/ToastContext";
import Badge from "../../../../../shared/components/Badge";
import Tooltip from "../../../../../shared/components/Tooltip";

const CategoryForm = ({ category, onSave, onClose, mode }) => {
  const { categories } = useCategories();
  const { success, error: showError } = useToastContext();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "Activo",
    imagen: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        nombre: category.nombre || "",
        descripcion: category.descripcion || "",
        estado: category.estado || "Activo",
        imagen: category.imagen || null,
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Imagen de la Categoría
            <Tooltip content="Sube una imagen representativa para la categoría. Formatos: JPG, PNG, WebP. Máximo 5MB.">
              <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
            </Tooltip>
          </label>
          {form.imagen && (
            <Badge variant="success" size="sm">
              Imagen cargada
            </Badge>
          )}
        </div>

        {isViewMode ? (
          form.imagen ? (
            <div className="relative group hover-lift">
              <img
                src={form.imagen}
                alt={form.nombre}
                className="w-full h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                <Tooltip content="Ver imagen completa">
                  <button
                    type="button"
                    onClick={() => window.open(form.imagen, '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No hay imagen disponible</p>
            </div>
          )
        ) : (
          <ImageUpload
            onImageSelect={(file, imageUrl) => {
              setForm(prev => ({
                ...prev,
                imagen: imageUrl
              }));
              success('Imagen cargada', 'La imagen de la categoría se ha subido correctamente.');
            }}
            onImageRemove={() => {
              setForm(prev => ({
                ...prev,
                imagen: null
              }));
            }}
            existingImage={form.imagen}
            maxSize={5 * 1024 * 1024} // 5MB
            aspectRatio="landscape"
            className="w-full"
          />
        )}
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
