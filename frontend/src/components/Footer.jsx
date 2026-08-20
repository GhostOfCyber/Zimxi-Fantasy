import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 text-center border-t border-gray-800 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} ZIMXI Fantasy League. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-600">
          Website made by <span className="text-green-500 font-bold">GwinyayiTech</span>
        </p>
      </div>
    </footer>
  );
}