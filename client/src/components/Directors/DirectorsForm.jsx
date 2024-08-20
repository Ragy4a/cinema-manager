import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Avatar, Typography, Chip } from '@mui/material';
import { getDirectorById, createDirector, updateDirector } from '../../store/slices/directorsSlice';
import { getAllCountries } from '../../store/slices/countriesSlice';
import { getAllLocations } from '../../store/slices/locationsSlice';
import { getAllMovies } from '../../store/slices/moviesSlice';
import { DatePicker } from '@mui/x-date-pickers';
import { PersonSchema } from '../../utils/validationSchemas';
import { createEmptyPerson, pathToImages } from '../../constants';
import { styled } from '@mui/material/styles';

const ErrorMessageStyled = styled('div')({
  color: 'red',
  fontWeight: 'bold',
  padding: '8px',
  borderRadius: '4px',
  marginTop: '8px',
});

const DirectorsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: urlId } = useParams();
  const id = (urlId && urlId !== ':id') ? Number(urlId) : false;

  const [filteredBirthLocations, setFilteredBirthLocations] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);

  const director = useSelector((state) =>
    state.directorsList.directors.find((director) => director.id === Number(id))
  );
  const countries = useSelector((state) => state.countriesList.countries);
  const locations = useSelector((state) => state.locationsList.locations);
  const movies = useSelector((state) => state.moviesList.movies);

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(getAllLocations());
    dispatch(getAllMovies());

    if (id) {
      dispatch(getDirectorById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (director) {
      if (director.photo) {
        setPreview(director.photo);
      }
      if (director.movies) {
        setSelectedMovies(director.movies.map(movie => movie.title));
      }

      const birthCountryId = director.birthDirectorLocation?.Country?.id;
      if (birthCountryId) {
        const birthCountryLocations = locations.filter(location => location.country_id === birthCountryId);
        setFilteredBirthLocations(birthCountryLocations);
      }
    }
  }, [director, locations]);

  const handleCountryChange = (event, setFieldValue) => {
    const selectedCountry = countries.find(country => country.id === event.target.value);
    setFieldValue('country', selectedCountry ? selectedCountry.title : '');

    const filteredLocations = locations.filter(location => location.country_id === selectedCountry?.id);
    setFilteredBirthLocations(filteredLocations);
    setFieldValue('birth_place', '');
  };

  const handleBirthPlaceChange = (event, setFieldValue) => {
    const selectedLocation = filteredBirthLocations.find(location => location.id === event.target.value);
    setFieldValue('birth_place', selectedLocation ? selectedLocation.title : '');
  };

  const handleDeathPlaceChange = (event, setFieldValue) => {
    const selectedLocation = locations.find(location => location.id === event.target.value);
    setFieldValue('death_place', selectedLocation ? selectedLocation.title : '');
  };

  const handlePhotoChange = (event) => {
    const file = event.currentTarget.files[0];
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleMovieSelection = (event) => {
    const selectedMovie = event.target.value;
    if (!selectedMovies.includes(selectedMovie)) {
      setSelectedMovies([...selectedMovies, selectedMovie]);
    }
  };

  const removeSelectedMovie = (movieTitle) => {
    setSelectedMovies(selectedMovies.filter(movie => movie !== movieTitle));
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('first_name', values.first_name);
    formData.append('second_name', values.second_name);
    formData.append('birth_date', values.birth_date ? values.birth_date.toISOString() : '');
    formData.append('country', values.country);
    formData.append('birth_place', values.birth_place);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    if (values.death_date) {
      formData.append('death_date', values.death_date.toISOString());
    }
    if (values.death_place) {
      formData.append('death_place', values.death_place);
    }
    selectedMovies.forEach(movie => formData.append('movies[]', movie));
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    if (id) {
      dispatch(updateDirector(formData));
    } else {
      dispatch(createDirector(formData));
    }
    navigate('/directors');
  };

  return (
    <Formik
      initialValues={director ? {
        ...director,
        birth_date: director.birth_date ? new Date(director.birth_date) : null,
        country: director.birthDirectorLocation?.Country?.title || '',
        birth_place: director.birthDirectorLocation?.title || '',
        death_place: director.deathDirectorLocation?.title || '',
        movies: selectedMovies || []
      } : createEmptyPerson()}
      validationSchema={PersonSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleChange, setFieldValue, isValid }) => (
        <Form>
          <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
            <Field
              as={TextField}
              name="first_name"
              label="First Name"
              fullWidth
              margin="normal"
              onChange={handleChange}
              value={values.first_name}
            />
            <ErrorMessage name="first_name" component={ErrorMessageStyled} />

            <Field
              as={TextField}
              name="second_name"
              label="Second Name"
              fullWidth
              margin="normal"
              onChange={handleChange}
              value={values.second_name}
            />
            <ErrorMessage name="second_name" component={ErrorMessageStyled} />

            <DatePicker
              label="Birth Date"
              value={values.birth_date ? new Date(values.birth_date) : null}
              onChange={(newValue) => setFieldValue('birth_date', newValue)}
              textField={(params) => (
                <TextField {...params} name="birth_date" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="birth_date" component={ErrorMessageStyled} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                value={countries.find(country => country.title === values.country)?.id || ''}
                onChange={(event) => handleCountryChange(event, setFieldValue)}
                label="Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Birth Place</InputLabel>
              <Select
                value={filteredBirthLocations.find(location => location.title === values.birth_place)?.id || ''}
                onChange={(event) => handleBirthPlaceChange(event, setFieldValue)}
                label="Birth Place"
                disabled={!filteredBirthLocations.length}
              >
                {filteredBirthLocations.length > 0 ? (
                  filteredBirthLocations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No available locations
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <ErrorMessage name="birth_place" component={ErrorMessageStyled} />

            <DatePicker
              label="Death Year"
              value={values.death_date ? new Date(values.death_date) : null}
              onChange={(newValue) => setFieldValue('death_date', newValue)}
              textField={(params) => (
                <TextField {...params} name="death_date" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="death_date" component={ErrorMessageStyled} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Death Place</InputLabel>
              <Select
                value={locations.find(location => location.title === values.death_place)?.id || ''}
                onChange={(event) => handleDeathPlaceChange(event, setFieldValue)}
                label="Death Place"
              >
                {locations.length > 0 ? (
                  locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.title}, {location['Country.title']}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No available locations
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <ErrorMessage name="death_place" component={ErrorMessageStyled} />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Upload Photo</Typography>
              {preview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Avatar src={`${pathToImages}/directors/${preview}`} sx={{ width: 150, height: 150, margin: '0 auto', border: '1px solid #ddd' }} />
                </Box>
              )}
              <Button variant="contained" component="label">
                Select File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Movies</Typography>
              <FormControl fullWidth>
                <Select
                  value=""
                  onChange={handleMovieSelection}
                  label="Select Movie"
                >
                  {movies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.title}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedMovies.map((movieTitle) => (
                  <Chip
                    key={movieTitle}
                    label={movieTitle}
                    onDelete={() => removeSelectedMovie(movieTitle)}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                {id ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="contained" color="secondary" onClick={() => navigate('/directors')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );  
};

export default DirectorsForm;