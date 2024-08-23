import * as Yup from 'yup';

const TITLE_CHECK = Yup.string().required('Title is required');
const COUNTRY_CHECK = Yup.string().required('Country is required');
const nullableUrl = Yup.string().url('Must be a valid URL').nullable()

export const PersonSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  second_name: Yup.string().required('Second name is required'),
  birth_date: Yup.date().required('Birth date is required'),
  country: COUNTRY_CHECK,
  birth_place: Yup.string().required('Birth place is required'),
  death_date: Yup.date().nullable(),
  death_place: Yup.string().nullable(),
  photo: nullableUrl,
});

export const MovieSchema = Yup.object().shape({
  title: TITLE_CHECK,
  release_year: Yup.date().required('Release year is required'),
  country: COUNTRY_CHECK,
  genre: Yup.string().required('Genre is required'),
  studio: Yup.string().required('Studio is required'),
  poster: nullableUrl,
  actors: Yup.array(),
  directors: Yup.array(),
})

export const StudioSchema = Yup.object().shape({
  title: TITLE_CHECK,
  found_year: Yup.date().required('Found year is required'),
  country: COUNTRY_CHECK,
  location: Yup.string().required('Location is required'),
  movies: Yup.array(),
  logo: nullableUrl,
});