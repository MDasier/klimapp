// src/services/weatherApi.ts
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY; // Asegúrate de tener la variable de entorno configurada correctamente
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Obtener clima actual por coordenadas
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

// Obtener clima actual por ciudad
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