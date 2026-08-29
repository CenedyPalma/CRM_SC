import * as React from 'react';

// Example standard button component
export const Button = ({ children, onClick, className = '' }: any) => {
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm shadow-indigo-900 flex items-center space-x-2 ${className}`}
    >
      {children}
    </button>
  );
};
