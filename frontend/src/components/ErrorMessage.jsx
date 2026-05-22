import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message = 'An unexpected error occurred' }) => {
  return (
    <div className="error-banner">
      <AlertTriangle size={20} />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
