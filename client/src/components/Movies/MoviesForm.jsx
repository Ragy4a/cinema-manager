import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Avatar, Typography, Chip } from '@mui/material';
import { getMovieById, createMovie, updateMovie } from '../../store/slices/moviesSlice';
import { getAllCountries } from '../../store/slices/countriesSlice';
import { selectStudios } from '../../store/slices/studiosSlice';
import { getAllGenres } from '../../store/slices/genresSlice';
import { selectActors } from '../../store/slices/actorsSlice';
import { selectDirectors } from '../../store/slices/directorsSlice';
import { DatePicker } from '@mui/x-date-pickers';
import { MovieSchema } from '../../utils/validationSchemas';
import { createEmptyMovie, pathToImages } from '../../constants';
import { styled } from '@mui/material/styles';

const ErrorMessageStyled = styled('div')({
  color: 'red',
  fontWeight: 'bold',
  padding: '8px',
  borderRadius: '4px',
  marginTop: '8px',
});

const MoviesForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: urlId } = useParams();
  const id = (urlId && urlId !== ':id') ? Number(urlId) : false;

  const [posterFile, setPosterFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedActors, setSelectedActors] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [filteredStudios, setFilteredStudios] = useState([]); 

  const movie = useSelector((state) =>
    state.moviesList.movies.find((movie) => movie.id === Number(id))
  );
  const countries = useSelector((state) => state.countriesList.countries);
  const studios = useSelector((state) => state.studiosList.studios);
  const genres = useSelector((state) => state.genresList.genres);
  const actors = useSelector((state) => state.actorsList.actors);
  const directors = useSelector((state) => state.directorsList.directors);

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(selectStudios());
    dispatch(getAllGenres());
    dispatch(selectActors());
    dispatch(selectDirectors());

    if (id) {
      dispatch(getMovieById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (movie) {
      if (movie.poster) {
        setPreview(movie.poster);
      }
      if (movie.actors) {
        setSelectedActors(movie.actors.map(actor => actor.id));
      }
      if (movie.directors) {
        setSelectedDirectors(movie.directors.map(director => director.id));
      }

      const selectedCountry = countries.find(country => country.title === movie.country);
      if (selectedCountry) {
        const filteredStudiosList = studios.filter(studio => studio['Location.Country.id'] === selectedCountry.id);
        setFilteredStudios(filteredStudiosList);
      }
    }
  }, [movie, countries, studios]);

  const handlePosterChange = (event) => {
    const file = event.currentTarget.files[0];
    setPosterFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleActorSelection = (event) => {
    const selectedActor = event.target.value;
    if (!selectedActors.includes(selectedActor)) {
      setSelectedActors([...selectedActors, selectedActor]);
    }
  };

  const handleDirectorSelection = (event) => {
    const selectedDirector = event.target.value;
    if (!selectedDirectors.includes(selectedDirector)) {
      setSelectedDirectors([...selectedDirectors, selectedDirector]);
    }
  };

  const removeSelectedActor = (actorId) => {
    setSelectedActors(selectedActors.filter(id => id !== actorId));
  };

  const removeSelectedDirector = (directorId) => {
    setSelectedDirectors(selectedDirectors.filter(id => id !== directorId));
  };

  const handleCountryChange = (event, setFieldValue) => {
    const selectedCountry = countries.find(country => country.id === event.target.value);
    setFieldValue('country', selectedCountry ? selectedCountry.id : '');

    const filteredStudiosList = studios.filter(studio => studio['Location.Country.id'] === selectedCountry?.id);
    setFilteredStudios(filteredStudiosList);
    setFieldValue('studio', '');
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    if (id) {
      formData.append('id', id);
    }
    formData.append('title', values.title);
    formData.append('release_year', values.release_year ? values.release_year.toISOString() : '');
    const selectedCountry = countries.find(country => country.id === values.country);
    formData.append('country', selectedCountry ? selectedCountry.title : '');
    const selectedGenre = genres.find(genre => genre.id === values.genre);
    formData.append('genre', selectedGenre ? selectedGenre.title : '');
    const selectedStudio = studios.find(studio => studio.title === values.studio);
    formData.append('studio', selectedStudio ? selectedStudio.title : '');
    selectedActors.forEach(actorId => formData.append('actors[]', actorId));
    selectedDirectors.forEach(directorId => formData.append('directors[]', directorId));
    if (posterFile) {
        formData.append('poster', posterFile);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    if (id) {
        dispatch(updateMovie(formData));
    } else {
        dispatch(createMovie(formData));
    }
    navigate('/movies');
  };
  return (
    <Formik
      initialValues={movie ? {
        ...movie,
        release_year: movie.release_year ? new Date(movie.release_year) : null,
        country: countries.find(country => country.title === movie.country)?.id || '',
        genre: genres.find(genre => genre.title === movie.genre)?.id || '',
        studio: studios.find(studio => studio.title === movie.studio)?.title || '',
        actors: selectedActors || [],
        directors: selectedDirectors || [],
      } : createEmptyMovie()}
      validationSchema={MovieSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleChange, setFieldValue, isValid }) => (
        <Form>
          <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
            <Field
              as={TextField}
              name="title"
              label="Title"
              fullWidth
              margin="normal"
              onChange={handleChange}
              value={values.title}
            />
            <ErrorMessage name="title" component={ErrorMessageStyled} />

            <DatePicker
              label="Release Year"
              value={values.release_year ? new Date(values.release_year) : null}
              onChange={(newValue) => setFieldValue('release_year', newValue)}
              textField={(params) => (
                <TextField {...params} name="release_year" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="release_year" component={ErrorMessageStyled} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                value={values.country || ''}
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
            <ErrorMessage name="country" component={ErrorMessageStyled} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Studio</InputLabel>
              <Select
                value={values.studio || ''}
                onChange={(event) => setFieldValue('studio', event.target.value)}
                label="Studio"
                disabled={!filteredStudios.length}
              >
                {filteredStudios.length > 0 ? (
                  filteredStudios.map((studio) => (
                    <MenuItem key={studio.id} value={studio.title}>
                      {studio.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No available studios
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <ErrorMessage name="studio" component={ErrorMessageStyled} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Genre</InputLabel>
              <Select
                value={values.genre || ''}
                onChange={(event) => setFieldValue('genre', event.target.value)}
                label="Genre"
              >
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ErrorMessage name="genre" component={ErrorMessageStyled} />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Upload Poster</Typography>
              {preview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Avatar src={`${pathToImages}/movies/${preview}`} sx={{ width: 150, height: 150, margin: '0 auto', border: '1px solid #ddd' }} />
                </Box>
              )}
              <Button variant="contained" component="label">
                Select File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePosterChange}
                />
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Directors</Typography>
              <FormControl fullWidth>
                <Select
                  value=""
                  onChange={handleDirectorSelection}
                  label="Select Director"
                >
                  {directors.map((director) => (
                    <MenuItem key={director.id} value={director.id}>
                      {director.first_name} {director.second_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedDirectors.map((directorId) => (
                  <Chip
                    key={directorId}
                    label={directors.find(director => director.id === directorId)?.first_name + ' ' + directors.find(director => director.id === directorId)?.second_name}
                    onDelete={() => removeSelectedDirector(directorId)}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Actors</Typography>
              <FormControl fullWidth>
                <Select
                  value=""
                  onChange={handleActorSelection}
                  label="Select Actor"
                >
                  {actors.map((actor) => (
                    <MenuItem key={actor.id} value={actor.id}>
                      {actor.first_name} {actor.second_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedActors.map((actorId) => (
                  <Chip
                    key={actorId}
                    label={actors.find(actor => actor.id === actorId)?.first_name + ' ' + actors.find(actor => actor.id === actorId)?.second_name}
                    onDelete={() => removeSelectedActor(actorId)}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                {id ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="contained" color="secondary" onClick={() => navigate('/movies')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default MoviesForm;