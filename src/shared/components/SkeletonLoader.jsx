import React from 'react';

const SkeletonLoader = ({ 
  type = 'text', 
  lines = 1, 
  className = '',
  width = 'w-full',
  height = 'h-4'
}) => {
  const getSkeletonClasses = () => {
    const baseClasses = 'animate-pulse bg-gray-300 rounded';
    return `${baseClasses} ${width} ${height} ${className}`;
  };

  if (type === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className={`${getSkeletonClasses()} bg-gray-300 rounded-lg flex items-center justify-center`}>
        <div className="w-8 h-8 text-gray-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  // Default text skeleton
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={getSkeletonClasses()}
          style={{ width: index === lines - 1 ? '75%' : '100%' }}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

