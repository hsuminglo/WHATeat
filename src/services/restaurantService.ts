import { Restaurant } from '../types/restaurant';

interface FallbackRestaurant {
  id: number;
  name: string;
  image: string;
  travelTime: string;
  type: string;
  priceRange: string;
  groupFriendly: boolean;
  busyness: string;
  recommendationScore: number;
  latitude: number;
  longitude: number;
}

async function getFallbackRestaurants(): Promise<Restaurant> {
  try {
    const response = await fetch('http://localhost:3000/api/restaurant');
    const data: FallbackRestaurant = await response.json();
    
    return {
      id: String(data.id),
      name: data.name,
      image: data.image,
      travelTime: data.travelTime,
      type: data.type,
      priceRange: data.priceRange,
      rating: data.recommendationScore,
      userRatingsTotal: Math.floor(Math.random() * 100) + 50,
      address: '使用離線數據',
      latitude: data.latitude,
      longitude: data.longitude,
      openNow: true
    };
  } catch (error) {
    console.error('Error fetching fallback data:', error);
    throw new Error('無法取得餐廳資訊');
  }
}

export { getFallbackRestaurants };