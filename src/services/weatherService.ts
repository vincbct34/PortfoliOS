// Open-Meteo API service for weather data

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  city: string;
}

// WMO Weather interpretation codes
export function getWeatherCondition(code: number): string {
  if (code === 0) return 'Ciel dégagé';
  if (code <= 3) return 'Partiellement nuageux';
  if (code <= 48) return 'Brouillard';
  if (code <= 57) return 'Bruine';
  if (code <= 67) return 'Pluie';
  if (code <= 77) return 'Neige';
  if (code <= 82) return 'Averses';
  if (code <= 86) return 'Averses de neige';
  if (code <= 99) return 'Orage';
  return 'Inconnu';
}

export function getWeatherIcon(
  code: number,
  isDay: boolean
): 'sun' | 'cloud' | 'cloudRain' | 'cloudSnow' | 'cloudLightning' | 'cloudFog' | 'moon' {
  if (code === 0) return isDay ? 'sun' : 'moon';
  if (code <= 3) return 'cloud';
  if (code <= 48) return 'cloudFog';
  if (code <= 67) return 'cloudRain';
  if (code <= 86) return 'cloudSnow';
  if (code <= 99) return 'cloudLightning';
  return 'cloud';
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
}

// Get user's location using browser geolocation or default to Paris
export async function getUserLocation(): Promise<GeoLocation> {
  return new Promise((resolve) => {
    // Default to Paris
    const defaultLocation: GeoLocation = {
      latitude: 48.8566,
      longitude: 2.3522,
      city: 'Paris',
    };

    if (!navigator.geolocation) {
      resolve(defaultLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use BigDataCloud free reverse geocoding API
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
          );
          const geoData = await geoResponse.json();
          const city =
            geoData.city || geoData.locality || geoData.principalSubdivision || 'Votre position';

          resolve({ latitude, longitude, city });
        } catch {
          resolve({
            latitude,
            longitude,
            city: 'Votre position',
          });
        }
      },
      () => {
        resolve(defaultLocation);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      city: '',
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}
