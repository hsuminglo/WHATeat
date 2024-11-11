import { useState, useEffect } from 'react';
import { Restaurant } from '../types/restaurant';
import { searchNearbyRestaurants } from '../services/googlePlaces';
import { Location } from './useGeolocation';

export const useRestaurants = (location: Location | null, maxTravelTime: number) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!location) {
        setError('無法獲取位置資訊');
        setLoading(false);
        return;
      }

      if (location.error) {
        setError(location.error);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const results = await searchNearbyRestaurants({
          latitude: location.latitude,
          longitude: location.longitude,
          maxTravelTime
        });

        if (!Array.isArray(results) || results.length === 0) {
          setError('在指定範圍內找不到餐廳');
          setLoading(false);
          return;
        }

        const formattedRestaurants: Restaurant[] = results
          .filter(place => place && place.name)
          .map(place => ({
            id: place.place_id || '',
            name: place.name || '',
            image: place.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 }) || '/default-restaurant.jpg',
            travelTime: '計算中...',
            type: place.types?.[0] || '餐廳',
            priceRange: '￥'.repeat(place.price_level || 1),
            rating: place.rating || 0,
            userRatingsTotal: place.user_ratings_total || 0,
            address: place.vicinity || '',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0,
            openNow: place.isOpen ?? true,
            phoneNumber: place.formatted_phone_number
          }));

        if (formattedRestaurants.length === 0) {
          setError('在指定範圍內找不到餐廳');
          setLoading(false);
          return;
        }

        setRestaurants(formattedRestaurants);
        setCurrentRestaurant(formattedRestaurants[0]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '無法取得餐廳資訊';
        setError(errorMessage);
        console.error('餐廳搜尋錯誤:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location, maxTravelTime]);

  const fetchNextRestaurant = () => {
    if (restaurants.length === 0) return;
    
    const currentIndex = currentRestaurant 
      ? restaurants.findIndex(r => r.id === currentRestaurant.id)
      : -1;
    const nextIndex = (currentIndex + 1) % restaurants.length;
    setCurrentRestaurant(restaurants[nextIndex]);
  };

  return {
    restaurants,
    currentRestaurant,
    loading,
    error,
    fetchNextRestaurant
  };
};