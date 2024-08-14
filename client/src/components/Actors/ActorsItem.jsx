import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Avatar, CircularProgress, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { getActorById, deleteActor } from '../../store/slices/actorsSlice';

const ActorsItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getActorById(id));
  }, [dispatch, id]);
  
  const actor = useSelector((state) => state.actorsList.actors.find((actor) => actor.id === Number(id)));
  const status = useSelector((state) => state.actorsList.status);
  
  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`)
  };

  const handleDelete = () => {
    dispatch(deleteActor(id));
    navigate('/actors');
  };

  if (status === 'loading' || !actor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    first_name,
    second_name,
    photo,
    birth_date,
    death_year,
    birthActorLocation,
    deathActorLocation,
    movies
  } = actor;

  return (
    <Box mt={8} sx={{ maxWidth: '900px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={photo}
          alt={`${first_name} ${second_name}`}
          sx={{ width: 200, height: 200, marginRight: 4, border: '2px solid #ddd' }}
        />
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4">
            {first_name} {second_name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={1}>
            Birth Date: {new Date(birth_date).toLocaleDateString()}
          </Typography>
          {death_year && (
            <Typography variant="subtitle1" color="textSecondary" mt={1}>
              Death Year: {new Date(death_year).toLocaleDateString()}
            </Typography>
          )}
          <Typography variant="subtitle1" color="textSecondary" mt={1}>
            Birth Place: {birthActorLocation?.title}
          </Typography>
          {deathActorLocation && (
            <Typography variant="subtitle1" color="textSecondary" mt={1}>
              Death Place: {deathActorLocation?.title}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Movies
        </Typography>
        <List sx={{bgcolor: '#d4d4d4'}}>
          {movies && movies.length > 0 ? (
            movies.map(({ id, title, poster }) => (
              <ListItem key={id} sx={{cursor: 'pointer', bgcolor: '#ebebeb', width: '95%', margin: 'auto', marginTop: '10px'}} onClick={() => handleMovieClick(id)}>
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={poster}
                    alt={title}
                    sx={{ width: 50, height: 75, marginRight: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={title}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No movies found for this actor.
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
          to={`/actors/edit/${id}`}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default ActorsItem;