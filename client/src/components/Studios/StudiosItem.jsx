import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Avatar, CircularProgress, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { getStudioById, deleteStudio } from '../../store/slices/studiosSlice';
import { pathToImages } from '../../constants';

const StudiosItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getStudioById(id));
  }, [dispatch, id]);

  const studio = useSelector((state) => state.studiosList.studios.find((studio) => studio.id === Number(id)));
  const status = useSelector((state) => state.studiosList.status);

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const handleDelete = () => {
    dispatch(deleteStudio(id));
    navigate('/studios');
  };

  if (status === 'loading' || !studio) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    title,
    logo,
    found_year,
    location,
    movies
  } = studio;

  const locationFull = location ? `${location.title}, ${location.country}` : 'Unknown';

  return (
    <Box
      mt={8}
      sx={{
        maxWidth: '1200px',
        margin: '5dvh auto 0',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
        border: '1px solid #ddd',                    
        borderRadius: '10px',                          
        padding: 4,                                   
        bgcolor: '#fff'                                
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={logo ? `${pathToImages}/studios/${logo}` : `${pathToImages}/studios/default.png`}
          alt={title}
          sx={{ width: 200, height: 200, marginRight: 4, border: '2px solid #ddd' }}
        />
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={1}>
            Found Year: {new Date(found_year).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={1}>
            Location: {locationFull}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Movies
        </Typography>
        <List sx={{ bgcolor: '#f0f1f2' }}>
          {movies && movies.length > 0 ? (
            movies.map(({ id, title, poster }) => (
              <ListItem
                key={id}
                sx={{ cursor: 'pointer', bgcolor: '#ebebeb', width: '95%', margin: 'auto', marginTop: '10px' }}
                onClick={() => handleMovieClick(id)}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={poster ? `${pathToImages}/movies/${poster}` : `${pathToImages}/movies/default.png`}
                    alt={title}
                    sx={{ width: 50, height: 75, marginRight: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={title} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No movies found for this studio.
            </Typography>
          )}
        </List>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          component={Link}
          to={`/studios/edit/${id}`}
        >
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default StudiosItem;