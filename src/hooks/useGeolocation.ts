import { useState, useEffect } from 'react';

export interface Location {
  latitude: number;
  longitude: number;
  error?: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ latitude: 0, longitude: 0, error: '您的瀏覽器不支援地理位置功能' });
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      const errorMessages: { [key: number]: string } = {
        1: '請允許存取位置資訊',
        2: '無法取得位置資訊',
        3: '位置資訊請求超時'
      };
      setLocation({ 
        latitude: 0, 
        longitude: 0, 
        error: errorMessages[error.code] || error.message 
      });
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }, []);

  return { location, loading };
};