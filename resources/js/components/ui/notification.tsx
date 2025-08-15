import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ 
  type, 
  message, 
  isVisible, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'var(--techwave-success-bg-color, #10b981)' 
    : 'var(--techwave-error-bg-color, #ef4444)';
  
  const iconColor = type === 'success' ? '#ffffff' : '#ffffff';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div 
        className="flex items-center p-4 rounded-lg shadow-lg text-white min-w-80"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="h-5 w-5 mr-3" style={{ color: iconColor }} />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <X className="h-4 w-4" style={{ color: iconColor }} />
        </button>
      </div>
    </div>
  );
} 