import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box, Button, Pagination, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteActor, getActors } from '../../store/slices/actorsSlice';

const StyledList = styled(List)({
  width: '100%',
  backgroundColor: '#f5f5f5',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
});

const StyledListItem = styled(ListItem)({
  padding: '10px 20px',
  borderBottom: '1px solid #ddd',
  '&:last-child': {
    borderBottom: 'none',
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  marginRight: theme.spacing(2),
}));

const ActorName = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'black',
  textDecoration: 'none',
});

const ActorDetails = styled(Typography)({
  color: '#888',
});

const ButtonGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
});

const EditButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor: '#4caf50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

const DeleteButton = styled(Button)(() => ({
  backgroundColor: '#f44336',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#e53935',
  },
}));

function ActorsList() {
  const dispatch = useDispatch();
  const actors = useSelector(state => state.actorsList.actors);
  const total = useSelector(state => state.actorsList.total);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getActors({ page, itemsPerPage, search, filter }));
  }, [dispatch, page, itemsPerPage, search, filter]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    setPage(1);
  };

  const count = Math.ceil(total / itemsPerPage);

  return (
    <Box mt={4} sx={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Actors
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search Actors"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
        />
        <Box ml={2} display="flex" alignItems="center">
          <Button variant="outlined" onClick={() => handleFilterChange('oldest')} sx={{ mr: 1 }}>Oldest</Button>
          <Button variant="outlined" onClick={() => handleFilterChange('youngest')} sx={{ mr: 1 }}>Youngest</Button>
          <Button variant="outlined" onClick={() => handleFilterChange('most-movies')}>Most Movies</Button>
        </Box>
      </Box>
      <StyledList>
        {actors.map(({ id, first_name, second_name, photo }) => (
          <StyledListItem key={id}>
            <ListItemAvatar>
              <StyledAvatar src={photo} alt={`${first_name} ${second_name}`} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <ActorName component={Link} to={`/actors/${id}-${first_name}-${second_name}`}>
                  {`${first_name} ${second_name}`}
                </ActorName>
              }
              secondary={<ActorDetails component="span">Actor ID: {id}</ActorDetails>}
            />
            <ButtonGroup>
              <EditButton
                component={Link}
                to={`/actors/edit/${id}`}
                variant="contained"
              >
                Edit
              </EditButton>
              <DeleteButton onClick={() => dispatch(deleteActor(id))} variant="contained">Delete</DeleteButton>
            </ButtonGroup>
          </StyledListItem>
        ))}
      </StyledList>
      {count > 0 && (
        <Pagination
          count={count}
          page={page}
          onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
        />
      )}
    </Box>
  );
}

export default ActorsList;