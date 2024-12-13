import React, { useEffect, useState } from "react";
import useGeolocation from "./hooks/useGeolocation.ts";
import { getWeatherByCoordinates, getWeatherByCity, getForecast } from "./services/weatherApi.ts";
import WeatherCard from "./components/WeatherCard.tsx";
import SearchBar from "./components/SearchBar.tsx";
import { Container, CircularProgress, Typography, Grid, Card, CardContent, Link } from "@mui/material";

const App: React.FC = () => {
  const { location, error } = useGeolocation();
  const [weather, setWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any | null>(null); // Estado para almacenar el pronóstico
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
      // Obtener clima actual
      const data = await getWeatherByCoordinates(latitude, longitude);
      setWeather(data);

      // Obtener pronóstico de los siguientes días
      const forecastData = await getForecast(latitude, longitude);
      setForecast(forecastData.list); // `list` contiene el pronóstico cada 3 horas
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
      console.log(data);
      // Obtener pronóstico usando las coordenadas de la ciudad
      const { coord } = data;  // Asumiendo que 'data' tiene una propiedad 'coord' con las coordenadas
      if (coord) {
        const forecastData = await getForecast(coord.lat, coord.lon);
        setForecast(forecastData.list);  // 'list' contiene el pronóstico cada 3 horas
      } else {
        setErrorMessage("No se encontraron coordenadas para esta ciudad.");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage(`No encontramos "${city}". Por favor revisa el nombre de la ciudad que buscas e inténtalo de nuevo.`);
      } else if (error.response?.status === 400) {
        setErrorMessage("El nombre de la ciudad no es válido.");
      } else {
        setErrorMessage("Hubo un problema al buscar la ciudad. Intenta más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la fecha en formato legible
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute:"numeric" });
  };
  
  return (
    <Container>
      
      {error && <Typography color="error">{error}</Typography>}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{marginTop:"20px"}}>
          <Typography variant="h1" style={{ fontSize: "40px", textAlign:"center", padding:"20px" }}>
            {"KLIMAPP BY "}
            <Link href="https://github.com/mdasier" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              MDASIER
            </Link>
          </Typography>
          {/* Mostrar clima actual */}
          <Card sx={{maxWidth: "100%", display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center", textAlign: "center", marginBottom: "20px" }}>            
            {weather && <WeatherCard weather={weather} />}
            <Typography variant="h4">{currentTime}</Typography>
          </Card>          
          <SearchBar onSearch={fetchWeatherByCoordinates} />
          {/* Mostrar pronóstico para los próximos días */}
          {forecast && (
            <Grid container spacing={2} mt={4}>
              {forecast.slice(0, 5).map((item: any, index: number) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
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
        </div>
      )}
    </Container>
  );
};

export default App;
