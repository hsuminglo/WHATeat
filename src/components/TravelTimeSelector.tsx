import React from 'react';
import { Clock } from 'lucide-react';

interface TravelTimeSelectorProps {
  selectedTime: number;
  onTimeChange: (time: number) => void;
}

const TravelTimeSelector: React.FC<TravelTimeSelectorProps> = ({ selectedTime, onTimeChange }) => {
  const timeOptions = [
    { value: 10, label: '10分鐘以內' },
    { value: 20, label: '20分鐘以內' },
    { value: 30, label: '30分鐘以內' },
    { value: 45, label: '45分鐘以內' },
    { value: 60, label: '1小時以內' },
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Clock className="inline-block mr-2" size={20} />
        選擇路程時間
      </label>
      <select
        value={selectedTime}
        onChange={(e) => onTimeChange(Number(e.target.value))}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
      >
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TravelTimeSelector;