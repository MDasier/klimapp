import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

import Lottie from "lottie-react";

import clearAnimation from '../animations/clear.json';
import rainAnimation from '../animations/rain.json';
import snowAnimation from '../animations/snow.json';
import cloudsAnimation from '../animations/cloud.json';
import stormAnimation from '../animations/storm.json';
import drizzleAnimation from '../animations/drizzle.json';
import defectoAnimation from '../animations/defecto.json';

const weatherAnimations: { [key: string]: any } = {
  Clear: clearAnimation,
  Rain: rainAnimation,
  Snow: snowAnimation,
  Clouds: cloudsAnimation,
  Storm: stormAnimation,
  Drizzle: drizzleAnimation,
  Defecto: defectoAnimation
};

interface WeatherData {
  name: string;
  main: { temp: number };
  weather: { description: string }[];
}

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const weatherType = weather.weather[0].main;
  const animationData = weatherAnimations[weatherType] || weatherAnimations["Defecto"];
  return (
    <Card sx={{ boxShadow: "none", border: "none"}}>
      <CardContent sx={{ border: "none"}}>
        <Lottie animationData={animationData} style={{ width: 150, height: 150 }} />

        <Typography variant="h5">{weather.name}</Typography>
        <Typography variant="h6">{Math.floor(weather.main.temp)}°C</Typography>
        <Typography variant="body1">{weather.weather[0].description}</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;