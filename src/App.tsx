import React, { useEffect, useState } from "react";
import useGeolocation from "./hooks/useGeolocation.ts";
import { getWeatherByCoordinates } from "./services/weatherApi.ts";
import { getForecast } from "./services/forecastApi.ts"; 
import { getWeatherByCity } from "./services/weatherApi.ts"; 
import SearchBar from "./components/SearchBar.tsx";
import { Container, CircularProgress, Typography, Grid, Card, CardContent } from "@mui/material";
import WeatherCard from "./components/WeatherCard.tsx";
import { formatDate } from "./utils/formatDate.ts";


const App: React.FC = () => {
  const { location, error } = useGeolocation();
  const [weather, setWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any | null>(null); 
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    if (location) {
      fetchWeatherByCoordinates(location.latitude, location.longitude);
    }
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [location]);

  const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getWeatherByCoordinates(latitude, longitude);
      setWeather(data);

      const forecastData = await getForecast(latitude, longitude);
      setForecast(forecastData.list); 
    } catch (error) {
      setErrorMessage("No se pudo obtener el clima en la ubicación seleccionada.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchWeatherByCity = async (city: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      if (location && location.latitude && location.longitude) {
        const forecastData = await getForecast(location.latitude, location.longitude);
        setForecast(forecastData.list); 
      }else {
        setErrorMessage("Problema con la geolocalización.");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage(`No encontramos "${city}". Por favor revisa el nombre de la ciudad.`);
      } else {
        setErrorMessage("Hubo un problema al buscar la ciudad.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      
    {error && <Typography color="error">{error}</Typography>}
    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    {loading ? (
      <CircularProgress />
    ) : (
      <>
        {/* Mostrar clima actual */}
        <Card sx={{maxWidth: "100%", display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>            
          {weather && <WeatherCard weather={weather} />}
          
          <Typography variant="h4">{currentTime}</Typography>
        </Card>          
        <SearchBar onSearch={fetchWeatherByCoordinates} />
        {/* Mostrar pronóstico para los próximos días */}
        {forecast && (
          <Grid container spacing={2} mt={4}>
            {forecast.slice(0, 5).map((item: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center", textAlign: "center", border: "none" }}>
                  <CardContent sx={{ border: "none"}}>
                    <Typography variant="h6">{formatDate(item.dt)}</Typography>
                  </CardContent>
                  <WeatherCard weather={item} />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </>
    )}
  </Container>
  );
};

export default App;
