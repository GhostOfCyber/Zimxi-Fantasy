import React from 'react';

export default function Card({ children, title, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {title && (
        <div className="mb-4 border-b border-gray-100 pb-2">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}