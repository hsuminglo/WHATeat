import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAMhjd_vINHUrT1-9jdcGZ0xACs_axgR7w';

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
  language: 'zh-TW',
  region: 'TW'
});

let mapInstance: google.maps.Map | null = null;
let placesService: google.maps.places.PlacesService | null = null;

export interface RestaurantSearchParams {
  latitude: number;
  longitude: number;
  maxTravelTime: number;
}

const initializeGoogleServices = async () => {
  if (!mapInstance || !placesService) {
    await loader.load();
    const mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);
    
    mapInstance = new google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 15
    });
    
    placesService = new google.maps.places.PlacesService(mapInstance);
  }
  return { placesService };
};

const getPlaceDetails = async (
  service: google.maps.places.PlacesService,
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: [
          'formatted_phone_number',
          'price_level',
          'opening_hours',
          'business_status'
        ]
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error('無法取得餐廳詳細資訊'));
        }
      }
    );
  });
};

export const searchNearbyRestaurants = async ({ latitude, longitude, maxTravelTime }: RestaurantSearchParams) => {
  if (!latitude || !longitude) {
    throw new Error('需要位置資訊才能搜尋餐廳');
  }

  try {
    const { placesService } = await initializeGoogleServices();
    
    if (!placesService) {
      throw new Error('Google Places 服務初始化失敗');
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(latitude, longitude),
        radius: maxTravelTime * 80,
        type: 'restaurant',
        rankBy: google.maps.places.RankBy.RATING,
        fields: [
          'place_id',
          'name',
          'photos',
          'types',
          'price_level',
          'rating',
          'user_ratings_total',
          'vicinity',
          'geometry',
          'business_status'
        ]
      };

      placesService.nearbySearch(request, async (results, status) => {
        try {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const operationalRestaurants = results.filter(
              place => place.business_status === 'OPERATIONAL'
            );

            if (operationalRestaurants.length === 0) {
              reject(new Error('在指定範圍內找不到營業中的餐廳'));
              return;
            }

            const detailedResults = await Promise.all(
              operationalRestaurants.map(async place => {
                if (!place.place_id) return place;
                try {
                  const details = await getPlaceDetails(placesService!, place.place_id);
                  return {
                    ...place,
                    ...details,
                    isOpen: details.opening_hours?.isOpen() ?? true
                  };
                } catch {
                  return {
                    ...place,
                    isOpen: true // Default to open if we can't get opening hours
                  };
                }
              })
            );

            const openRestaurants = detailedResults.filter(place => place.isOpen);

            if (openRestaurants.length === 0) {
              reject(new Error('在指定範圍內找不到營業中的餐廳'));
              return;
            }

            resolve(openRestaurants);
          } else {
            const errorMessages: { [key: string]: string } = {
              [google.maps.places.PlacesServiceStatus.ZERO_RESULTS]: '在指定範圍內找不到餐廳',
              [google.maps.places.PlacesServiceStatus.INVALID_REQUEST]: '搜尋請求無效',
              [google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT]: '已超過 API 配額限制',
              [google.maps.places.PlacesServiceStatus.REQUEST_DENIED]: 'API 請求被拒絕，請確認 API 金鑰設定正確',
              [google.maps.places.PlacesServiceStatus.ERROR]: 'Places API 服務錯誤'
            };

            reject(new Error(errorMessages[status] || `Places API 錯誤: ${status}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('google is not defined')) {
        throw new Error('Google Maps API 載入失敗，請確認網路連線');
      }
      if (error.message.includes('ApiNotActivatedMapError')) {
        throw new Error('請在 Google Cloud Console 中啟用 Maps JavaScript API');
      }
      if (error.message.includes('InvalidKeyMapError')) {
        throw new Error('Google Maps API 金鑰無效');
      }
      throw error;
    }
    throw new Error('搜尋餐廳時發生未知錯誤');
  }
};