import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Avatar, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { getStudioById, createStudio, updateStudio } from '../../store/slices/studiosSlice';
import { getAllCountries } from '../../store/slices/countriesSlice';
import { getAllLocations } from '../../store/slices/locationsSlice';
import { StudioSchema } from '../../utils/validationSchemas';
import { createEmptyStudio, pathToImages } from '../../constants';
import { styled } from '@mui/material/styles';

const ErrorMessageStyled = styled('div')({
  color: 'red',
  fontWeight: 'bold',
  padding: '8px',
  borderRadius: '4px',
  marginTop: '8px',
});

const StudiosForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: urlId } = useParams();
  const id = (urlId && urlId !== ':id') ? Number(urlId) : false;

  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const studio = useSelector((state) =>
    state.studiosList.studios.find((studio) => studio.id === Number(id))
  );
  const countries = useSelector((state) => state.countriesList.countries);
  const locations = useSelector((state) => state.locationsList.locations);

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(getAllLocations());

    if (id) {
      dispatch(getStudioById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (studio) {
      if (studio.logo) {
        setPreview(studio.logo);
      }

      const selectedCountry = countries.find(country => country.title === studio.location?.country);
      if (selectedCountry) {
        const filteredLocationsList = locations.filter(location => location['Country.title'] === selectedCountry.title);
        setFilteredLocations(filteredLocationsList);
      }
    }
  }, [studio, countries, locations]);

  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCountryChange = (event, setFieldValue) => {
    const selectedCountry = countries.find(country => country.id === event.target.value);
    setFieldValue('country', selectedCountry ? selectedCountry.id : '');

    const filteredLocationsList = locations.filter(location => location['Country.title'] === selectedCountry?.title);
    setFilteredLocations(filteredLocationsList);
    setFieldValue('location', '');
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    if (id) {
      formData.append('id', id);
    }
    formData.append('title', values.title);
    formData.append('found_year', values.found_year ? values.found_year.toISOString() : '');
    formData.append('location', values.location);
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    if (id) {
      dispatch(updateStudio(formData));
    } else {
      dispatch(createStudio(formData));
    }
    navigate('/studios');
  };

  return (
    <Formik
      initialValues={studio ? {
        title: studio.title,
        found_year: studio.found_year ? new Date(studio.found_year) : null,
        country: countries.find((country) => country.title === studio.location?.country)?.id,
        location: locations.find(location => location.title === studio.location?.title)?.title || '',
      } : createEmptyStudio()}
      validationSchema={StudioSchema}
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
              label="Found Year"
              value={values.found_year ? new Date(values.found_year) : null}
              onChange={(newValue) => setFieldValue('found_year', newValue)}
              textField={(params) => (
                <TextField {...params} name="found_year" fullWidth margin="normal" />
              )}
            />
            <ErrorMessage name="found_year" component={ErrorMessageStyled} />

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
              <InputLabel>Location</InputLabel>
              <Select
                value={values.location || ''}
                onChange={(event) => setFieldValue('location', event.target.value)}
                label="Location"
                disabled={!filteredLocations.length}
              >
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <MenuItem key={location.id} value={location.title}>
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
            <ErrorMessage name="location" component={ErrorMessageStyled} />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Upload Logo</Typography>
              {preview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Avatar src={preview ? `${pathToImages}/studios/${preview}` : null} sx={{ width: 150, height: 150, margin: '0 auto', border: '1px solid #ddd' }} />
                </Box>
              )}
              <Button variant="contained" component="label">
                Select File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                {id ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="contained" color="secondary" onClick={() => navigate('/studios')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default StudiosForm;