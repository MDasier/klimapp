// src/services/cityApi.ts
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY; // Asegúrate de tener la variable de entorno configurada correctamente

// Obtener sugerencias de ciudades
export const getCitySuggestions = async (query: string) => {
  const response = await axios.get("http://api.openweathermap.org/geo/1.0/direct", {
    params: {
      q: query,
      limit: 3, // Limitar las sugerencias a 3
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
