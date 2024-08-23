import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Button } from '@mui/material';
import { deleteMovie, getMovieById } from '../../store/slices/moviesSlice';
import { pathToImages } from '../../constants';

function MoviesItem() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovieById(id)); 
  }, [dispatch, id]);
  
  const { movies, status } = useSelector((state) => state.moviesList);
  const movie = movies.find((movie) => movie.id === Number(id));

  if (status === 'pending' || !movie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  const handleDelete = (id) => {
    dispatch(deleteMovie(id));
  }
  
  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', mt: 4, p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
        {movie.title}
      </Typography>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Avatar
          variant="square"
          src={movie.poster ? `${pathToImages}/movies/${movie.poster}` : `${pathToImages}/movies/default.png`}
          alt={movie.title}
          sx={{ width: 200, height: 300, mr: 4 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Release Year:</strong> {new Date(movie.release_year).getFullYear()}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Country:</strong> {movie.country}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Studio:</strong> 
            <Link 
              to={`/studios/${movie.studioId}`} 
              style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold', marginLeft: '4px' }}
            >
              {movie.studio}
            </Link>
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {movie.directors && movie.directors.length > 1 ? 'Directors' : 'Director'}
              </Typography>
              <List>
                {movie.directors && movie.directors.map((director) => (
                  <ListItem 
                    key={director.id} 
                    sx={{ pl: 0, cursor: 'pointer' }}
                    component={Link}
                    to={`/directors/${director.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={director.photo ? `${pathToImages}/directors/${director.photo}` : `${pathToImages}/directors/default.png`}
                        alt={`${director.first_name} ${director.second_name}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${director.first_name} ${director.second_name}`}
                      secondary={`Birth Date: ${new Date(director.birth_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ flex: 1, ml: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {movie.actors && movie.actors.length > 1 ? 'Actors' : 'Actor'}
              </Typography>
              <List>
                {movie.actors && movie.actors.map((actor) => (
                  <ListItem 
                    key={actor.id} 
                    sx={{ pl: 0, cursor: 'pointer' }}
                    component={Link}
                    to={`/actors/${actor.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={actor.photo ? `${pathToImages}/actors/${actor.photo}` : `${pathToImages}/actors/default.png`}
                        alt={`${actor.first_name} ${actor.second_name}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${actor.first_name} ${actor.second_name}`}
                      secondary={`Birth Date: ${new Date(actor.birth_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              component={Link}
              to={`/movies/edit/${id}`}
            >
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          </Box> 
        </Box>
      </Box>
    </Box>
  );
}

export default MoviesItem;