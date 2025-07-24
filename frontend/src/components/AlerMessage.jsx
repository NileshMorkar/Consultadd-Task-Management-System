import React from 'react';

const colorMap = {
  success: 'bg-green-100 text-green-700 border-green-400',
  error: 'bg-red-100 text-red-700 border-red-400',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  info: 'bg-blue-100 text-blue-700 border-blue-400',
};

export default function AlertMessage({ type = 'info', message, onClose }) {
  return (
    <div
      className={`w-full border px-4 py-3 rounded relative shadow-sm ${colorMap[type]} transition-all`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-xl font-semibold text-gray-500 hover:text-black"
        >
          &times;
        </button>
      )}
    </div>
  );
}
