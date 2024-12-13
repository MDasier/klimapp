import React, { useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { debounce } from "lodash";
import { getCitySuggestions } from "../services/cityApi.ts";

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

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value); 
    fetchSuggestions(value);
  };

  const handleSelection = (event: React.SyntheticEvent, value: any) => {
    if (value) {
      onSearch(value.lat, value.lon); 
    }
  };

  return (
    <Box mb={4}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => `${option.name}, ${option.country}`}
        onInputChange={handleInputChange}
        onChange={handleSelection}
        renderInput={(params) => (
          <TextField {...params} label="Buscar ciudad" variant="outlined" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText="No se encontraron sugerencias"
        renderOption={(props, option) => (
          <li {...props} key={`${option.name || 'unknown'}-${option.country || 'unknown'}`}>
            {option.name}, {option.country}
          </li>
        )}
      />
    </Box>
  );
};

export default SearchBar;
