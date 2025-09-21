import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useCategories } from "../../categoryManagement/hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { Upload, X, Eye } from "lucide-react";
import ImageUpload from "../../../../../shared/components/ImageUpload";
import { useToastContext } from "../../../../../shared/context/ToastContext";
import LoadingSpinner from "../../../../../shared/components/LoadingSpinner";
import Badge, { StatusBadge } from "../../../../../shared/components/Badge";
import Tooltip from "../../../../../shared/components/Tooltip";

const ProductForm = ({ product, onSave, onClose, mode }) => {
  const { categories } = useCategories();
  const { products } = useProducts();
  const { success, error: showError } = useToastContext();
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
      // Si el producto tiene images (array), usarlo; si no, crear array con imagen principal
      const images = product.images || (product.imagen ? [product.imagen] : []);
      
      setFormData({
        id: product.id,
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio || "",
        categoria: product.categoria || "",
        genero: product.genero || "", // Initialize genero
        tallas: product.tallas || [], // Initialize tallas
        images: images,
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

    // Añadir stockPorTalla, genero e imagen principal al formData antes de guardar
    const productToSave = { 
      ...formData, 
      stockPorTalla, 
      genero: formData.genero,
      imagen: formData.images.length > 0 ? formData.images[0] : null // Primera imagen como imagen principal
    };

    onSave(productToSave);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      
      // Solo reiniciar tallas si realmente cambió la categoría o género
      if (name === "categoria" || name === "genero") {
        let newTallas = [];
        
        // Para zapatos, necesitamos tanto categoría como género
        if (newState.categoria === "Zapatos" && newState.genero) {
          const tallasDisponibles = TALLA_OPTIONS[newState.categoria][newState.genero] || [];
          newTallas = tallasDisponibles.map(talla => {
            // Mantener el stock existente si la talla ya existía
            const tallaExistente = prev.tallas.find(t => t.talla === talla);
            return {
              talla: talla,
              stock: tallaExistente ? tallaExistente.stock : 0
            };
          });
        } else if (newState.categoria !== "Zapatos" && TALLA_OPTIONS[newState.categoria]) {
          const tallasDisponibles = TALLA_OPTIONS[newState.categoria] || [];
          newTallas = tallasDisponibles.map(talla => {
            // Mantener el stock existente si la talla ya existía
            const tallaExistente = prev.tallas.find(t => t.talla === talla);
            return {
              talla: talla,
              stock: tallaExistente ? tallaExistente.stock : 0
            };
          });
        }
        
        newState.tallas = newTallas;
      }
      
      return newState;
    });
  };

  const handleTallaStockChange = (talla, stockValue) => {
    setFormData((prev) => {
      const newTallas = prev.tallas.map(t =>
        t.talla === talla ? { ...t, stock: parseInt(stockValue) || 0 } : t
      );
      
      // Si la talla no existe en el array, agregarla
      const tallaExiste = newTallas.some(t => t.talla === talla);
      if (!tallaExiste) {
        newTallas.push({
          talla: talla,
          stock: parseInt(stockValue) || 0
        });
      }
      
      return {
        ...prev,
        tallas: newTallas
      };
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
                    <label className="text-sm text-gray-700 min-w-[60px]">
                      {tallaOption}:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md bg-gray-100">
                      <button
                        type="button"
                        onClick={() => handleTallaStockChange(tallaOption, Math.max(0, stockValue - 1))}
                        disabled={isViewMode || stockValue <= 0}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                    <input
                      id={`stock-${tallaOption}`}
                      type="number"
                      min="0"
                      value={stockValue}
                      onChange={(e) => handleTallaStockChange(tallaOption, e.target.value)}
                      onKeyDown={handleNumberInputKeyDown}
                      disabled={isViewMode}
                        className="w-16 px-2 py-1 text-sm text-center border-0 bg-transparent focus:outline-none focus:ring-0"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleTallaStockChange(tallaOption, stockValue + 1)}
                        disabled={isViewMode}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Imágenes del Producto
            <Tooltip content="Sube hasta 5 imágenes del producto. Formatos: JPG, PNG, WebP. Máximo 5MB cada una.">
              <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
            </Tooltip>
          </label>
          {formData.images.length > 0 && (
            <Badge variant="info" size="sm">
              {formData.images.length} imagen{formData.images.length !== 1 ? 'es' : ''}
            </Badge>
          )}
        </div>

        {isViewMode ? (
          formData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group hover-lift">
                  <img
                    src={image}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Tooltip content="Ver imagen completa">
                      <button
                        type="button"
                        onClick={() => window.open(image, '_blank')}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No hay imágenes disponibles</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {/* Componente de subida de imágenes - MÁS PEQUEÑO */}
            <div className="max-w-md mx-auto">
              <ImageUpload
                onImageSelect={(file, imageUrl) => {
                  if (formData.images.length >= 5) {
                    showError('Límite alcanzado', 'Solo puedes subir hasta 5 imágenes por producto.');
                    return;
                  }
                  setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, imageUrl]
                  }));
                  success('Imagen agregada', 'La imagen se ha subido correctamente.');
                }}
                onImageRemove={() => {
                  // Se maneja individualmente en cada imagen
                }}
                maxSize={5 * 1024 * 1024} // 5MB
                aspectRatio="square"
                className="w-full"
              />
            </div>

            {/* Galería de imágenes subidas */}
            {formData.images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Imágenes subidas:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group hover-lift">
                      <img
                        src={image}
                        alt={`Producto ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center space-x-2">
                        <Tooltip content="Ver imagen completa">
                          <button
                            type="button"
                            onClick={() => window.open(image, '_blank')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Tooltip>
                        <Tooltip content="Eliminar imagen">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white rounded-full shadow-lg hover:bg-red-100"
                          >
                            <X className="w-6 h-6 text-red-600" />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="absolute top-1 left-1">
                        <Badge variant="gray" size="sm">
                          {index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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