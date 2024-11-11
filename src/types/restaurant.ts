export interface Restaurant {
  id: string;
  name: string;
  image: string;
  travelTime: string;
  type: string;
  priceRange: string;
  rating: number;
  userRatingsTotal: number;
  address: string;
  latitude: number;
  longitude: number;
  openNow?: boolean;
  phoneNumber?: string;
}