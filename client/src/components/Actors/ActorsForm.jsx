import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Avatar, Typography, Chip } from '@mui/material';
import { getActorById, createActor, updateActor } from '../../store/slices/actorsSlice';
import { getAllCountries } from '../../store/slices/countriesSlice';
import { getAllLocations } from '../../store/slices/locationsSlice';
import { getAllMovies } from '../../store/slices/moviesSlice';
import { DatePicker } from '@mui/x-date-pickers';
import { createEmptyPerson } from '../../constants';

const ActorForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

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
      const birthCountryLocations = locations.filter(
        (location) => location.country_id === actor.birthActorLocation?.country_id
      );
      setFilteredBirthLocations(birthCountryLocations);

      const deathCountryLocations = actor.deathActorLocation
        ? locations.filter((location) => location.country_id === actor.deathActorLocation.country_id)
        : [];
      setFilteredDeathLocations(deathCountryLocations);
      if (actor.photo) {
        setPreview(actor.photo);
      }
      if (actor.movies) {
        setSelectedMovies(actor.movies.map(movie => movie.title));
      }
    }
  }, [actor, locations]);

  const handleCountryChange = (event, setFieldValue) => {
    const selectedCountryId = event.target.value;
    setFieldValue('country_id', selectedCountryId);
    const filteredBirth = locations.filter((location) => location.country_id === selectedCountryId);
    setFilteredBirthLocations(filteredBirth);
    setFieldValue('birth_place', '');
    setFilteredDeathLocations(filteredBirth); 
    setFieldValue('death_place', ''); 
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

  const schema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    second_name: Yup.string().required('Second name is required'),
    birth_date: Yup.date().required('Birth date is required'),
    birth_place: Yup.number().required('Birth place is required'),
    death_year: Yup.date().nullable(),
    death_place: Yup.number().nullable(),
    photo: Yup.mixed().nullable(),
    movies: Yup.array().of(Yup.string()).nullable(),
  });

  const handleSubmit = (values) => {
    const actorData = { ...values, movies: selectedMovies };

    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        actorData.photo = reader.result;
        if (id) {
          dispatch(updateActor({ id, ...actorData }));
        } else {
          dispatch(createActor(actorData));
        }
        navigate('/actors');
      };
      reader.readAsDataURL(photoFile);
    } else {
      if (id) {
        dispatch(updateActor({ id, ...actorData }));
      } else {
        dispatch(createActor(actorData));
      }
      navigate('/actors');
    }
  };

  return (
    <Formik
      initialValues={actor ? { 
        ...actor, 
        birth_date: actor.birth_date ? new Date(actor.birth_date) : null,
        country_id: actor.birth_place ? locations.find(loc => loc.id === actor.birth_place)?.country_id : '', 
        birth_place: actor.birth_place || '',
        death_place: actor.death_place || '',
        movies: selectedMovies || []
      } : createEmptyPerson()}
      validationSchema={schema}
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
            <ErrorMessage name="first_name" component="div" className="error" />

            <Field
              as={TextField}
              name="second_name"
              label="Second Name"
              fullWidth
              margin="normal"
              onChange={handleChange}
              value={values.second_name}
            />
            <ErrorMessage name="second_name" component="div" className="error" />

            <DatePicker
              label="Birth Date"
              value={values.birth_date}
              onChange={(newValue) => setFieldValue('birth_date', newValue)}
              textField={(params) => (
                <TextField {...params} name="birth_date" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="birth_date" component="div" className="error" />

            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                value={values.country_id || ''}
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
                value={values.birth_place || ''}
                onChange={(event) => setFieldValue('birth_place', event.target.value)}
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

            <ErrorMessage name="birth_place" component="div" className="error" />

            <DatePicker
              label="Death Year"
              value={values.death_year || null}
              onChange={(newValue) => setFieldValue('death_year', newValue)}
              textField={(params) => (
                <TextField {...params} name="death_year" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="death_year" component="div" className="error" />

            <FormControl fullWidth margin="normal">
              <InputLabel>Death Place</InputLabel>
              <Select
                value={values.death_place || ''}
                onChange={(event) => setFieldValue('death_place', event.target.value)}
                label="Death Place"
                disabled={!filteredDeathLocations.length}
              >
                {filteredDeathLocations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ErrorMessage name="death_place" component="div" className="error" />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Upload Photo</Typography>
              {preview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Avatar src={preview} sx={{ width: 150, height: 150, margin: '0 auto', border: '1px solid #ddd' }} />
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