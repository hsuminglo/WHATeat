import React from 'react';

interface ErrorDisplayProps {
  message: string;
  warning?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, warning = false }) => {
  const colorClasses = warning
    ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <div className="flex justify-center items-center h-screen">
      <div className={`${colorClasses} px-4 py-3 rounded relative border`} role="alert">
        {!warning && <strong className="font-bold">錯誤：</strong>}
        <span className="block sm:inline"> {message}</span>
      </div>
    </div>
  );
};

export default ErrorDisplay;