import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY; 

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
  return response.data;
};
