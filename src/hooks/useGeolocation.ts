import { useState, useEffect } from "react";

export interface Geolocation {
  latitude: number;
  longitude: number;
}

const useGeolocation = () => {
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización desactivada en tu navegador...");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return { location, error };
};

export default useGeolocation;
