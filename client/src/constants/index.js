export const BASE_URL = 'http://localhost:5000/api';

export const ACTORS_SLICE_NAME = 'actors';
export const DIRECTORS_SLICE_NAME = 'directors';
export const MOVIES_SLICE_NAME = 'movies';
export const STUDIOS_SLICE_NAME = 'studios';
export const COUNTRY_SLICE_NAME = 'countries';
export const LOCATION_SLICE_NAME = 'locations';

export const setPending = (state) => {
  state.status = 'pending';
  state.error = null;
};

export const setRejected = (state, { payload }) => {
  state.status = 'rejected';
  state.error = payload;
};

export const createEmptyPerson = () => {
  return {
    first_name: '',
    second_name: '',
    birth_place: '',
    birth_date: null,
    death_place: '',
    death_date: null,
    photo: '',
    movies: [],
  }
}
export const pathToImages = 'http://localhost:5000/images';
export const posters =[
  { id: 1, url: "https://pluggedin.ru/images/upload/1655926482.jpg", alt: 'poster', title: 'House of Dragon' },
  {  id: 2, url: "https://www.combook.ru/imgrab/0068/9785041165246.jpg", alt: 'poster', title: 'Game of Thrones' },
  { id: 3, url: "https://www.themoviedb.org/t/p/original/9AhKm1JP67ZvuUTCmYs3SVlHm0c.jpg", alt: 'poster', title: 'Vikings' },
  {  id: 4, url: "https://xage.ru/media/uploads/2017/08/thor_ragnarok_04_01.jpg", alt: 'poster', title: 'Thor Ragnarok' },
  {  id: 5, url: "https://upload.wikimedia.org/wikipedia/ru/f/fe/Gladiatorteaser.jpg", alt: 'poster', title: 'Gladiator' },
  {  id: 6, url: "https://xage.ru/media/uploads/2008/2/posteryi-luchshih-filmov-poluchivshih-oskar/posteryi-luchshih-filmov-poluchivshih-oskar_1.jpg", alt: 'poster', title: 'The Lord of the Rings: The Return of the King' },
  {  id: 7, url: "https://megaobzor.com/uploads/stories/66059/poster40933_1.jpg", alt: 'poster', title: 'Maleficent' },
];