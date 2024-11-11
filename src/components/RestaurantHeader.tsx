import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RestaurantHeaderProps {
  onRefresh: () => void;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ onRefresh }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">餐廳推薦</h1>
        <button
          onClick={onRefresh}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <RefreshCw className="mr-2" size={20} />
          換一家
        </button>
      </div>
    </header>
  );
};

export default RestaurantHeader;