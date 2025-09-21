import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  size = 'md',
  variant = 'default',
  showPercentage = true,
  animated = false,
  striped = false,
  className = '',
  label = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'md':
        return 'h-3';
      case 'lg':
        return 'h-4';
      case 'xl':
        return 'h-6';
      default:
        return 'h-3';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
      case 'danger':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'purple':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStripedClasses = () => {
    if (striped) {
      return 'bg-stripes';
    }
    return '';
  };

  const getAnimationClasses = () => {
    if (animated) {
      return 'animate-pulse';
    }
    return '';
  };

  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{progressValue}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`
            h-full transition-all duration-500 ease-out
            ${getVariantClasses()}
            ${getStripedClasses()}
            ${getAnimationClasses()}
          `}
          style={{ width: `${progressValue}%` }}
        >
          {striped && (
            <div className="h-full w-full bg-stripes-animated"></div>
          )}
        </div>
      </div>
      
      {!label && showPercentage && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{progressValue}%</span>
        </div>
      )}
    </div>
  );
};

// Progress Bar circular
export const CircularProgress = ({ 
  progress = 0, 
  size = 60,
  strokeWidth = 6,
  variant = 'default',
  showPercentage = true,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
      case 'danger':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      case 'purple':
        return '#8b5cf6';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getVariantColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

