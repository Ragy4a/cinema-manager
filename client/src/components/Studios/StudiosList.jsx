import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box, CircularProgress, Divider, Button, Pagination, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { getAllStudios, deleteStudio } from '../../store/slices/studiosSlice';  
import { pathToImages } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';

const FilterButton = styled(Button)(({ theme }) => ({
  height: '60px',
  minHeight: '40px',
  minWidth: '100px',
  marginRight: theme.spacing(1),
}));

function StudiosList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studios, status, total } = useSelector((state) => state.studiosList);  

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAllStudios({ page, filter, search, itemsPerPage })); 
  }, [dispatch, page, filter, search]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleDelete = (id) => {
    dispatch(deleteStudio(id)); 
  };

  const handleListItemClick = (id) => {
    navigate(`/studios/${id}`);
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (studios.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No studios found.
      </Typography>
    );
  }

  const count = Math.ceil(total / itemsPerPage);

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', mt: 2 }}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Search Studios"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          fullWidth
          sx={{ mr: 2 }}
        />
        <FilterButton variant={filter === 'newest' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('newest')}>
          Newest
        </FilterButton>
        <FilterButton variant={filter === 'oldest' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('oldest')}>
          Oldest
        </FilterButton>
        <FilterButton variant={filter === 'most-movies' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('most-movies')}>
          Most Movies
        </FilterButton>
      </Box>

      <List sx={{minHeight: '850px'}}>
        {studios.map((studio) => {
          const locationTitle = studio.Location?.title || 'Unknown Location';
          const countryTitle = studio.Location?.Country?.title || 'Unknown Country';

          return (
            <Box key={studio.id} sx={{ mb: 1, p: 1, bgcolor: '#f9f9f9', borderRadius: '8px', boxShadow: 1 }}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ cursor: 'pointer', minHeight: '120px' }} 
                onClick={() => handleListItemClick(studio.id)}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={studio.logo ? `${pathToImages}/studios/${studio.logo}` : `${pathToImages}/studios/default.png`}
                    alt={studio.title}
                    sx={{ width: 80, height: 120, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      {studio.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        Found Year: {new Date(studio.found_year).getFullYear()}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        Location: {locationTitle}, {countryTitle}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        Number of Movies: {studio.movies_count}
                      </Typography>
                    </>
                  }
                />
                <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to={`/studios/edit/${studio.id}`}
                    sx={{ mb: 1 }}
                    onClick={(e) => e.stopPropagation()} 
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(studio.id);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </ListItem>
              <Divider variant="inset" component="div" />
            </Box>
          );
        })}
      </List>

      {count > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={count}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default StudiosList;