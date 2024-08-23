import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box, Button, Pagination, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteDirector, getAllDirectors } from '../../store/slices/directorsSlice'; // Импортируем необходимые экшены
import { pathToImages } from '../../constants';

const StyledListContainer = styled(Box)({
  maxHeight: '600px',
  overflowY: 'auto',
  flexGrow: 1,
});

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
  cursor: 'pointer',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  marginRight: theme.spacing(2),
}));

const DirectorName = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: 'black',
  textDecoration: 'none',
});

const ButtonGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
});

const FilterButton = styled(Button)(({ theme }) => ({
  height: '60px',
  minHeight: '40px',
  minWidth: '100px',
  marginRight: theme.spacing(1),
}));

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

function DirectorsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const directors = useSelector(state => state.directorsList.directors);
  const total = useSelector(state => state.directorsList.total);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAllDirectors({ page, itemsPerPage, search, filter }));
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

  const handleDeleteDirector = (event, id) => {
    event.stopPropagation();
    dispatch(deleteDirector(id));
  };

  const handleListItemClick = (id) => {
    navigate(`/directors/${id}`);
  };

  const count = Math.ceil(total / itemsPerPage);

  return (
    <Box mt={8} sx={{ maxWidth: '1000px', margin: '2dvh auto 0', display: 'flex', flexDirection: 'column', height: '90%' }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search Directors"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
        />
        <Box ml={2} display="flex" alignItems="center">
          <FilterButton variant="outlined" onClick={() => handleFilterChange('oldest')}>
            Oldest
          </FilterButton>
          <FilterButton variant="outlined" onClick={() => handleFilterChange('youngest')}>
            Youngest
          </FilterButton>
          <FilterButton variant="outlined" onClick={() => handleFilterChange('most-movies')}>
            Most Movies
          </FilterButton>
        </Box>
      </Box>
      <StyledListContainer>
        <StyledList>
          {directors.map(({ id, first_name, second_name, photo }) => (
            <StyledListItem 
              key={id} 
              onClick={() => handleListItemClick(id)}
            >
              <ListItemAvatar>
                <StyledAvatar src={`${pathToImages}/directors/${photo}`} alt={`${first_name} ${second_name}`} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <DirectorName component="span">
                    {`${first_name} ${second_name}`}
                  </DirectorName>
                }
              />
              <ButtonGroup>
                <EditButton
                  component={Link}
                  to={`/directors/edit/${id}`}
                  variant="contained"
                  onClick={(event) => event.stopPropagation()}
                >
                  Edit
                </EditButton>
                <DeleteButton onClick={(event) => handleDeleteDirector(event, id)} variant="contained">
                  Delete
                </DeleteButton>
              </ButtonGroup>
            </StyledListItem>
          ))}
        </StyledList>
      </StyledListContainer>
      {count > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={count}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default DirectorsList;