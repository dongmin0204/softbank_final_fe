import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E8EC] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3>{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F6F8FB] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7684]" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
