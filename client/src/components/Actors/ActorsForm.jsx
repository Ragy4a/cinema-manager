import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Avatar, Typography, Chip } from '@mui/material';
import { getActorById, createActor, updateActor } from '../../store/slices/actorsSlice';
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

const ActorForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: urlId } = useParams();
  const id = (urlId && urlId !== ':id') ? Number(urlId) : false;

  const [filteredBirthLocations, setFilteredBirthLocations] = useState([]);
  const [filteredDeathLocations, setFilteredDeathLocations] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);

  const actor = useSelector((state) =>
    state.actorsList.actors.find((actor) => actor.id === Number(id))
  );
  const countries = useSelector((state) => state.countriesList.countries);
  const locations = useSelector((state) => state.locationsList.locations);
  const movies = useSelector((state) => state.moviesList.movies);

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(getAllLocations());
    dispatch(getAllMovies());

    if (id) {
      dispatch(getActorById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (actor) {
      if (actor.photo) {
        setPreview(actor.photo);
      }
      if (actor.movies) {
        setSelectedMovies(actor.movies.map(movie => movie.title));
      }

      const birthCountryId = actor.birthActorLocation?.Country?.id;
      if (birthCountryId) {
        const birthCountryLocations = locations.filter(location => location.country_id === birthCountryId);
        setFilteredBirthLocations(birthCountryLocations);
        setFilteredDeathLocations(birthCountryLocations);
      }
    }
  }, [actor, locations]);

  const handleCountryChange = (event, setFieldValue) => {
    const selectedCountry = countries.find(country => country.id === event.target.value);
    setFieldValue('country', selectedCountry ? selectedCountry.title : '');

    const filteredLocations = locations.filter(location => location.country_id === selectedCountry?.id);
    setFilteredBirthLocations(filteredLocations);
    setFilteredDeathLocations(filteredLocations);
    setFieldValue('birth_place', '');
    setFieldValue('death_place', '');
  };

  const handleBirthPlaceChange = (event, setFieldValue) => {
    const selectedLocation = filteredBirthLocations.find(location => location.id === event.target.value);
    setFieldValue('birth_place', selectedLocation ? selectedLocation.title : '');
  };

  const handleDeathPlaceChange = (event, setFieldValue) => {
    const selectedLocation = filteredDeathLocations.find(location => location.id === event.target.value);
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
    const actorData = {
      ...values,
      movies: selectedMovies
    };
    console.log(actorData)
    console.log(photoFile)
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        actorData.photo = reader.result;
        console.log(actorData.photo)
        if (id) {
          dispatch(updateActor(actorData));
        } else {
          dispatch(createActor(actorData));
        }
        // navigate('/actors');
      };
      reader.readAsDataURL(photoFile);
    } else {
      if (id) {
        dispatch(updateActor(actorData));
      } else {
        dispatch(createActor(actorData));
      }
      // navigate('/actors');
    }
  };

  return (
    <Formik
      initialValues={actor ? {
        ...actor,
        birth_date: actor.birth_date ? new Date(actor.birth_date) : null,
        country: actor.birthActorLocation?.Country?.title || '',
        birth_place: actor.birthActorLocation?.title || '',
        death_place: actor.deathActorLocation?.title || '',
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
              value={values.birth_date}
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
              value={values.death_date || null}
              onChange={(newValue) => setFieldValue('death_date', newValue)}
              textField={(params) => (
                <TextField {...params} name="death_date" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="death_date" component={ErrorMessageStyled} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Death Place</InputLabel>
              <Select
                value={filteredDeathLocations.find(location => location.title === values.death_place)?.id || ''}
                onChange={(event) => handleDeathPlaceChange(event, setFieldValue)}
                label="Death Place"
                disabled={!filteredDeathLocations.length}
              >
                {filteredDeathLocations.length > 0 ? (
                  filteredDeathLocations.map((location) => (
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
            <ErrorMessage name="death_place" component={ErrorMessageStyled} />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Upload Photo</Typography>
              {preview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Avatar src={`${pathToImages}/actors/${preview}`} sx={{ width: 150, height: 150, margin: '0 auto', border: '1px solid #ddd' }} />
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
              <Button type="button" variant="contained" color="secondary" onClick={() => navigate('/actors')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ActorForm;