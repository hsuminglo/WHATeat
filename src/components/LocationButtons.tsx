import React from 'react';
import { Phone, Navigation } from 'lucide-react';

interface LocationButtonsProps {
  onCall: () => void;
  onNavigate: () => void;
  phoneNumber?: string;
}

const LocationButtons: React.FC<LocationButtonsProps> = ({ onCall, onNavigate, phoneNumber }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={onCall}
        disabled={!phoneNumber}
        className={`${
          phoneNumber 
            ? 'bg-green-500 hover:bg-green-700' 
            : 'bg-gray-400 cursor-not-allowed'
        } text-white font-bold py-2 px-4 rounded flex items-center justify-center`}
      >
        <Phone className="mr-2" size={20} />
        聯繫店家
      </button>
      <button 
        onClick={onNavigate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      >
        <Navigation className="mr-2" size={20} />
        導航
      </button>
    </div>
  );
};

export default LocationButtons;