import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useCategories } from "../../categoryManagement/hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { Upload, X } from "lucide-react";

const ProductForm = ({ product, onSave, onClose, mode }) => {
  const { categories } = useCategories();
  const { products } = useProducts();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    genero: "", // New field for gender
    tallas: [], // Changed from stock to tallas array
    images: [],
    estado: "activo",
  });

  const TALLA_OPTIONS = {
    "Zapatos": {
      "Hombre": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
      "Mujer": ["4.5", "5.5", "6.5", "7", "7.5", "8", "8.5", "9"],
      "Unisex": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"]
    },
    "Jeans": ["28", "30", "32", "34", "36", "38", "40"],
    "Chaquetas": ["S", "M", "L", "XL", "XXL"],
    "Sudaderas": ["S", "M", "L", "XL", "XXL"],
    "Shorts": ["S", "M", "L", "XL"],
    "Faldas": ["XS", "S", "M", "L", "XL"],
    "Leggis": ["XS", "S", "M", "L", "XL"],
    "Ropa deportiva": ["S", "M", "L", "XL", "XXL"],
    "Mochilas": ["Pequeña", "Mediana", "Grande"],
    "Camisetas": ["S", "M", "L", "XL", "XXL"],
    "default": []
  };
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio || "",
        categoria: product.categoria || "",
        genero: product.genero || "", // Initialize genero
        tallas: product.tallas || [], // Initialize tallas
        images: product.images || [],
        estado: product.estado || "activo",
      });
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido.";
    // Validación de producto duplicado
    const isDuplicate = products.some(
      (p) => p.nombre.toLowerCase() === formData.nombre.toLowerCase() && p.id !== formData.id
    );
    if (isDuplicate) {
      newErrors.nombre = "Ya existe un producto con este nombre.";
    }

    if (formData.descripcion && !formData.descripcion.trim()) newErrors.descripcion = "La descripción no puede contener solo espacios.";
    if (!formData.precio || parseFloat(formData.precio) <= 0) newErrors.precio = "El precio debe ser un número positivo.";
    if (!formData.categoria) newErrors.categoria = "La categoría es requerida.";
    if (formData.categoria === "Zapatos" && !formData.genero) newErrors.genero = "El género es requerido para zapatos.";

    let currentTallaOptions = [];
    if (formData.categoria === "Zapatos" && formData.genero) {
      currentTallaOptions = TALLA_OPTIONS[formData.categoria][formData.genero] || [];
    } else if (formData.categoria !== "Zapatos" && TALLA_OPTIONS[formData.categoria]) {
      currentTallaOptions = TALLA_OPTIONS[formData.categoria] || [];
    }
    if (currentTallaOptions.length > 0) {
      const hasStock = formData.tallas.some(t => t.stock > 0);
      if (!hasStock) {
        newErrors.tallas = "Debe haber al menos una talla con stock mayor a 0.";
      }
      formData.tallas.forEach(t => {
        if (t.stock < 0 || isNaN(t.stock)) {
          newErrors.tallas = "El stock de las tallas debe ser un número igual o mayor a 0.";
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleNumberInputKeyDown = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
        return;
    }

    // Construir stockPorTalla a partir del array tallas
    const stockPorTalla = formData.tallas.reduce((acc, currentTalla) => {
      acc[currentTalla.talla] = currentTalla.stock;
      return acc;
    }, {});

    // Añadir stockPorTalla y genero al formData antes de guardar
    const productToSave = { ...formData, stockPorTalla, genero: formData.genero };

    onSave(productToSave);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "categoria" || name === "genero") {
        let newTallas = [];
        if (newState.categoria === "Zapatos" && newState.genero) {
          newTallas = (TALLA_OPTIONS[newState.categoria][newState.genero] || []).map(talla => ({
            talla: talla,
            stock: 0
          }));
        } else if (newState.categoria !== "Zapatos" && TALLA_OPTIONS[newState.categoria]) {
          newTallas = (TALLA_OPTIONS[newState.categoria] || []).map(talla => ({
            talla: talla,
            stock: 0
          }));
        }
        newState.tallas = newTallas;
      }
      return newState;
    });
  };

  const handleTallaStockChange = (talla, stockValue) => {
    setFormData((prev) => ({
      ...prev,
      tallas: prev.tallas.map(t =>
        t.talla === talla ? { ...t, stock: parseInt(stockValue) || 0 } : t
      ),
    }));
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
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
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
            onKeyDown={handleNumberInputKeyDown}
            placeholder="0.00"
            disabled={isViewMode}
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.precio && <p className="text-xs text-red-500">{errors.precio}</p>}
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
          {errors.categoria && <p className="text-xs text-red-500">{errors.categoria}</p>}
        </div>

        <div className="space-y-2">
            <label htmlFor="genero" className="text-sm font-medium text-gray-700">
              Producto para
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una opción</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Unisex">Unisex</option>
            </select>
            {errors.genero && <p className="text-xs text-red-500">{errors.genero}</p>}
          </div>

        {((formData.categoria !== "Zapatos" && TALLA_OPTIONS[formData.categoria] && TALLA_OPTIONS[formData.categoria].length > 0) ||
          (formData.categoria === "Zapatos" && formData.genero && TALLA_OPTIONS[formData.categoria][formData.genero] && TALLA_OPTIONS[formData.categoria][formData.genero].length > 0)) && (
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Tallas y Stock</label>
            <div className="grid grid-cols-3 gap-2">
              {(formData.categoria === "Zapatos" ? TALLA_OPTIONS[formData.categoria][formData.genero] : TALLA_OPTIONS[formData.categoria] || []).map((tallaOption) => {
                const currentTalla = formData.tallas.find(t => t.talla === tallaOption);
                const stockValue = currentTalla ? currentTalla.stock : 0;
                return (
                  <div key={tallaOption} className="flex items-center space-x-2">
                    <label htmlFor={`stock-${tallaOption}`} className="text-sm text-gray-700">
                      {tallaOption}:
                    </label>
                    <input
                      id={`stock-${tallaOption}`}
                      type="number"
                      min="0"
                      value={stockValue}
                      onChange={(e) => handleTallaStockChange(tallaOption, e.target.value)}
                      onKeyDown={handleNumberInputKeyDown}
                      disabled={isViewMode}
                      className="w-full bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>
            {errors.tallas && <p className="text-xs text-red-500">{errors.tallas}</p>}
          </div>
        )}
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
        {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
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