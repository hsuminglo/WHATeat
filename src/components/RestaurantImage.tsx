import React from 'react';

interface RestaurantImageProps {
  image: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  return (
    <div className="relative h-64 mb-6">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/default-restaurant.jpg';
        }}
      />
    </div>
  );
};

export default RestaurantImage;