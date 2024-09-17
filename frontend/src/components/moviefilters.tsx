import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';

interface FilterProps {
  onFilter: (filters: any) => void;
}

const MovieFilters: React.FC<FilterProps> = ({ onFilter }) => {
  const [mood, setMood] = useState('');
  const [ageRating, setAgeRating] = useState('');
  const [genre, setGenre] = useState('');
  const [movieAge, setMovieAge] = useState('');

  const handleFilter = () => {
    onFilter({ mood, ageRating, genre, movieAge });
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
          <MenuItem value="exciting">
            <Box display="flex" alignItems="center">
              <InsertEmoticonIcon style={{ marginRight: 8 }} />
              Excited
            </Box></MenuItem>
          <MenuItem value="romantic">
            <Box display="flex" alignItems="center">
              <FavoriteBorderIcon style={{ marginRight: 8 }} />
              Romantic
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
          <MenuItem value="action">Action</MenuItem>
          <MenuItem value="comedy">Comedy</MenuItem>
          <MenuItem value="romance">Romance</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Movie Age</InputLabel>
        <Select value={movieAge} onChange={(e) => setMovieAge(e.target.value)}>
          <MenuItem value="new">New (Last 5 years)</MenuItem>
          <MenuItem value="classic">Classic (Over 5 years)</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" fullWidth onClick={handleFilter} sx={{ marginTop: 2 }}>
        Filter Movies
      </Button>
    </Box>
  );
};

export default MovieFilters;


