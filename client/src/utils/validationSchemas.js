import * as Yup from 'yup';

export const PersonSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  second_name: Yup.string().required('Second name is required'),
  birth_date: Yup.date().required('Birth date is required'),
  birth_place: Yup.string().required('Birth place is required'),
  death_date: Yup.date().nullable(),
  death_place: Yup.string().nullable(),
  photo: Yup.string().url('Must be a valid URL').nullable(),
});