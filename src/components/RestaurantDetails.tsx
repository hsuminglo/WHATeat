import React from 'react';
import { Utensils, DollarSign, Star, Clock } from 'lucide-react';

interface RestaurantDetailsProps {
  type: string;
  priceRange: string;
  rating: number;
  userRatingsTotal: number;
  openNow?: boolean;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  type,
  priceRange,
  rating,
  userRatingsTotal,
  openNow
}) => {
  const formatPriceRange = (price: string) => {
    switch (price.length) {
      case 1: return '便宜 (200元以下)';
      case 2: return '平價 (200-500元)';
      case 3: return '中等 (500-1000元)';
      case 4: return '高價 (1000元以上)';
      default: return '價格未知';
    }
  };

  return (
    <div className="border-t border-gray-200 px-6 py-4">
      <h3 className="text-lg font-semibold mb-2">詳細資訊</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <Utensils className="mr-2" size={20} />
          <span>{type}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="mr-2" size={20} />
          <span>{formatPriceRange(priceRange)}</span>
        </div>
        <div className="flex items-center">
          <Star className="mr-2" size={20} />
          <span>{rating} ({userRatingsTotal} 則評價)</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 text-green-500" size={20} />
          <span className="text-green-500 font-medium">營業中</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;