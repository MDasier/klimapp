import React, { useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { debounce } from "lodash";
import { getCitySuggestions } from "../services/cityApi.ts";

interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (lat: number, lon: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query.trim()) {
      setOptions([]);
      return;
    }
    try {
      const suggestions = await getCitySuggestions(query);
      setOptions(suggestions);
    } catch (error) {
      console.error("Error con las sugerencias de ciudad:", error);
    }
  }, 150);


  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>, 
    value: string, 
    reason: string
  ) => {
    setInputValue(value);
    fetchSuggestions(value);
  };

  const handleSelection = (event: React.SyntheticEvent, value: CitySuggestion | null) => {
    if (value) {
      onSearch(value.lat, value.lon);
    }
  };

  return (
    <Box mb={4}>
      <Autocomplete
        options={options}
        getOptionLabel={(option: CitySuggestion) => `${option.name}, ${option.country}`}
        onInputChange={handleInputChange}
        onChange={handleSelection}
        renderInput={(params) => (
          <TextField {...params} label="Buscar ciudad" variant="outlined" fullWidth />
        )}
        isOptionEqualToValue={(option: CitySuggestion, value: CitySuggestion) => option.name === value.name && option.country === value.country}
        noOptionsText="No se encontraron sugerencias"
        renderOption={(props, option: CitySuggestion) => (
          <li {...props} key={`${option.name}-${option.country}`}>
            {option.name}, {option.country}
          </li>
        )}
      />
    </Box>
  );
};

export default SearchBar;
