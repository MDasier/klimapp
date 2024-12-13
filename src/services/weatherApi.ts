import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCoordinates = async (latitude: number, longitude: number) => {
  const response = await axios.get(BASE_URL, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: API_KEY,
      units: "metric", // Mostrar temperaturas en grados Celsius
      lang: "es", // Idioma en español
    },
  });
  return response.data;
};
export const getWeatherByCity = async (city: string) => {
  const response = await axios.get(BASE_URL, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
      lang: "es", 
    },
  });
  return response.data;
};

export const getCitySuggestions = async (query: string) => {
  const response = await axios.get("http://api.openweathermap.org/geo/1.0/direct", {
    params: {
      q: query,
      limit: 3, // Sugerencias en la barra de búsqueda
      appid: API_KEY,
    },
  });
  return response.data.map((city: any) => ({
    name: city.name,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
  }));
};

// Obtener pronóstico de los próximos días por coordenadas
export const getForecast = async (latitude: number, longitude: number) => {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=es&units=metric`, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: API_KEY,
      units: 'metric', // Para obtener la temperatura en grados Celsius
    },
  });
  return response.data; // La propiedad `list` contiene las predicciones cada 3 horas
};