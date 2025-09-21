import React, { useState, useRef, useCallback } from 'react';
import { CloudUpload, X, EyeFill, TrashFill } from 'react-bootstrap-icons';
import LoadingSpinner from './LoadingSpinner';
import Tooltip from './Tooltip';

const ImageUpload = ({
  onImageSelect,
  onImageRemove,
  existingImage = null,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  disabled = false,
  showPreview = true,
  aspectRatio = 'square' // 'square', 'landscape', 'portrait', 'auto'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'landscape':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'aspect-auto';
    }
  };

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      setError('Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG o WebP.');
      return false;
    }

    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = useCallback((file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    
    // Simular carga (en producción, aquí iría la lógica de subida real)
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreview(imageUrl);
        onImageSelect?.(file, imageUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  }, [maxSize, acceptedTypes, onImageSelect]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (preview && showPreview) {
    return (
      <div className={`relative group ${className}`}>
        <div className={`relative overflow-hidden rounded-lg border-2 border-gray-300 ${getAspectRatioClasses()}`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <Tooltip content="Ver imagen">
                <button
                  type="button"
                  onClick={() => window.open(preview, '_blank')}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                        <EyeFill className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Eliminar imagen">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors"
                >
                        <TrashFill className="w-4 h-4 text-red-600" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${getAspectRatioClasses()}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <LoadingSpinner size="lg" color="blue" />
            <p className="mt-4 text-sm text-gray-600">Subiendo imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-2">
              {dragActive ? 'Suelta la imagen aquí' : 'Haz clic para subir o arrastra una imagen'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP hasta {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
