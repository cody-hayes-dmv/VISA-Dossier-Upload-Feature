import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

/**
 * @param {Object} props
 * @param {'success' | 'error'} props.type
 * @param {string} props.message
 * @param {function(): void} props.onClose
 * @param {boolean} props.autoClose
 * @param {number} props.duration
 */
export function Notification({ 
  type, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full z-50 ${bgColor} ${borderColor} border rounded-lg shadow-lg`}>
      <div className="p-4">
        <div className="flex items-start">
          <Icon className={`h-5 w-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`ml-3 ${textColor} hover:opacity-75 transition-opacity`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}