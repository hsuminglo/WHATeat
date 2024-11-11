import React, { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useRestaurants } from './hooks/useRestaurants';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantImage from './components/RestaurantImage';
import LocationButtons from './components/LocationButtons';
import RestaurantDetails from './components/RestaurantDetails';
import TravelTimeSelector from './components/TravelTimeSelector';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [maxTravelTime, setMaxTravelTime] = useState(20);
  const { location, loading: locationLoading } = useGeolocation();
  const { 
    currentRestaurant, 
    loading: restaurantsLoading, 
    error,
    fetchNextRestaurant 
  } = useRestaurants(location, maxTravelTime);

  const handleCall = () => {
    if (currentRestaurant?.phoneNumber) {
      window.location.href = `tel:${currentRestaurant.phoneNumber}`;
    }
  };

  const handleNavigate = () => {
    if (currentRestaurant) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${currentRestaurant.latitude},${currentRestaurant.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (locationLoading || restaurantsLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!currentRestaurant) {
    return <ErrorDisplay message="找不到餐廳" warning />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <RestaurantHeader onRefresh={fetchNextRestaurant} />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <TravelTimeSelector
            selectedTime={maxTravelTime}
            onTimeChange={setMaxTravelTime}
          />
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <RestaurantImage image={currentRestaurant.image} name={currentRestaurant.name} />
              <h2 className="text-2xl font-bold mb-2">{currentRestaurant.name}</h2>
              <p className="text-gray-600 mb-4">{currentRestaurant.address}</p>
              <LocationButtons
                onCall={handleCall}
                onNavigate={handleNavigate}
                phoneNumber={currentRestaurant.phoneNumber}
              />
            </div>
            <RestaurantDetails
              type={currentRestaurant.type}
              priceRange={currentRestaurant.priceRange}
              rating={currentRestaurant.rating}
              userRatingsTotal={currentRestaurant.userRatingsTotal}
              openNow={currentRestaurant.openNow}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;