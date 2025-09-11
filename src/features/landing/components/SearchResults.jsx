import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, searchTerm }) => {
  const navigate = useNavigate();

  if (!searchTerm) {
    return null;
  }

  return (
    <div className="absolute top-16 left-0 right-0 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
      {results.length > 0 ? (
        <ul>
          {results.map(product => (
            <li key={product.id} 
                className="p-4 hover:bg-gray-700 cursor-pointer flex items-center gap-4"
                onClick={() => navigate(`/`)} // Should navigate to product page, but for now it navigates to landing
            >
              <img src={product.imagen || '/placeholder.svg'} alt={product.nombre} className="w-12 h-12 object-cover rounded-md" />
              <div>
                <p className="text-white font-semibold">{product.nombre}</p>
                <p className="text-gray-400 text-sm">{product.categoria}</p>
              </div>
              <p className="text-yellow-400 font-bold ml-auto">€{product.precio}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-400">
          No se encontraron productos para "{searchTerm}".
        </div>
      )}
    </div>
  );
};

export default SearchResults;
