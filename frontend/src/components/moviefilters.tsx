import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState,useEffect } from 'react';

interface FilterProps {
  onFilter: (filters: any) => void;
}

type Language = {
  iso_639_1: string;
  english_name: string;
};

type Genre = {
  id: number;
  name: string;
};

const MovieFilters: React.FC<FilterProps> = ({ onFilter }) => {
  const [mood, setMood] = useState('');
  const [ageRating, setAgeRating] = useState('');
  const [genre, setGenre] = useState('');
  const [genres,setGenres] = useState<Genre[]>([]);
  const [movieAge, setMovieAge] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/genres");
        const data: Genre[] = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);
  
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/languages");
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);


  const handleFilter = () => {
    onFilter({ mood, ageRating, genre, movieAge, language:selectedLanguage });
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'background.paper',
        padding: 3,
        borderRadius: 3,
        boxShadow: 3,
        marginTop: 3,
        marginBottom: 4,
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Mood</InputLabel>
        <Select value={mood}
          onChange={(e) => {
            setMood(e.target.value);
            console.log(mood)
          }}
        // renderValue={(selected) => (
        //   <Box display="flex" alignItems="center">
        //     {selected === 'happy' && <InsertEmoticonIcon style={{ marginRight: 8 }} />}
        //     {selected === 'happy' && 'Happy'}
        //     {selected === 'exciting' && 'Exciting'}
        //     {selected === 'romantic' && 'Romantic'}
        //   </Box>
        // )}
        >
          <MenuItem value="happy">
            <Box display="flex" alignItems="center">
              <SentimentSatisfiedAltIcon style={{ marginRight: 8 }} />
              Happy
            </Box>
          </MenuItem>
          <MenuItem value="neutral">
            <Box display="flex" alignItems="center">
              <InsertEmoticonIcon style={{ marginRight: 8 }} />
              Neutral
            </Box></MenuItem>
          <MenuItem value="sad">
            <Box display="flex" alignItems="center">
              <FavoriteBorderIcon style={{ marginRight: 8 }} />
              Sad
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Age Rating</InputLabel>
        <Select value={ageRating} onChange={(e) => setAgeRating(e.target.value)}>
          <MenuItem value="PG">PG</MenuItem>
          <MenuItem value="PG-13">PG-13</MenuItem>
          <MenuItem value="R">R</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Genre</InputLabel>
        <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
        {genres.map((genr) => (
        <MenuItem key={genr.id} value={genr.id}>
          {genr.name}
        </MenuItem>
      ))}
      </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Movie Age</InputLabel>
        <Select value={movieAge} onChange={(e) => setMovieAge(e.target.value)}>
          <MenuItem value="new">New (Last 5 years)</MenuItem>
          <MenuItem value="classic">Classic (Over 5 years)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Language</InputLabel>
        <Select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
        {languages.map((lang) => (
        <MenuItem key={lang.iso_639_1} value={lang.iso_639_1}>
          {lang.english_name}
        </MenuItem>
      ))}
        </Select>
      </FormControl>

      <Button variant="contained" fullWidth onClick={handleFilter} sx={{ marginTop: 2 }}>
        Filter Movies
      </Button>
    </Box>
  );
};

export default MovieFilters;


