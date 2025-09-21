import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  rounded = 'full',
  className = '',
  animated = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gray':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'outline':
        return 'bg-transparent text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-2.5 py-1.5 text-sm';
      case 'lg':
        return 'px-3 py-2 text-base';
      default:
        return 'px-2.5 py-1.5 text-sm';
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'none':
        return 'rounded-none';
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-full';
    }
  };

  const getAnimationClasses = () => {
    if (animated) {
      return 'animate-pulse';
    }
    return '';
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium border
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getRoundedClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Badge especializado para estados
export const StatusBadge = ({ status, children, ...props }) => {
  const getStatusVariant = () => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'active':
      case 'aprobado':
      case 'aprobada':
      case 'completado':
      case 'completada':
      case 'entregada':
        return 'success';
      case 'inactivo':
      case 'inactive':
      case 'cancelado':
      case 'cancelada':
      case 'rechazado':
      case 'rechazada':
        return 'error';
      case 'pendiente':
      case 'pending':
      case 'en_proceso':
      case 'en_camino':
        return 'warning';
      case 'borrador':
      case 'draft':
        return 'gray';
      default:
        return 'info';
    }
  };

  return (
    <Badge variant={getStatusVariant()} {...props}>
      {children || status}
    </Badge>
  );
};

// Badge especializado para números
export const NumberBadge = ({ number, max = 99, ...props }) => {
  const displayNumber = number > max ? `${max}+` : number;
  
  return (
    <Badge 
      variant="error" 
      size="sm" 
      className="min-w-[1.25rem] h-5 flex items-center justify-center"
      {...props}
    >
      {displayNumber}
    </Badge>
  );
};

export default Badge;

