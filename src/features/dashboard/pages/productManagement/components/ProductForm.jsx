
import React, { useState, useEffect } from "react";
import { useCategories } from "../../categoryManagement/hooks/useCategories";
import { Upload, X } from "lucide-react";

const ProductForm = ({ product, onSave, onClose, mode }) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    images: [],
    estado: "activo",
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio || "",
        stock: product.stock || "",
        categoria: product.categoria || "",
        images: product.images || [],
        estado: product.estado || "activo",
      });
    }
  }, [product]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoria) {
      alert("Por favor selecciona una categoría");
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isViewMode = mode === "view";

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
            Nombre del Producto
          </label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Zapatillas Nike Air Max"
            required
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="precio" className="text-sm font-medium text-gray-700">
            Precio
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            placeholder="0.00"
            required
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="categoria" className="text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            required
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe las características del producto..."
          rows={3}
          disabled={isViewMode}
          className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">Imágenes del Producto</label>
        {isViewMode ? (
          formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-500" />
            <p className="mt-4 text-sm font-medium text-gray-700">Arrastra y suelta imágenes aquí</p>
            <p className="text-xs text-gray-500">o haz clic para seleccionar archivos</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="hidden"
              id="file-upload"
            />
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Seleccionar Imágenes
            </button>
          </div>
        )}

        
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {isViewMode ? "Cerrar" : "Cancelar"}
        </button>
        {!isViewMode && (
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {mode === "create" ? "Crear Producto" : "Guardar Cambios"}
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
