module.exports = {
    countries: [
        { id: 1, title: 'United States of America', abbreviation: 'USA' },
        { id: 2, title: 'United Kingdom', abbreviation: 'UK' },
        { id: 3, title: 'Canada', abbreviation: 'CAN' },
        { id: 4, title: 'Australia', abbreviation: 'AUS' },
        { id: 5, title: 'France', abbreviation: 'FRA' },
        { id: 6, title: 'Germany', abbreviation: 'GER' },
        { id: 7, title: 'Japan', abbreviation: 'JPN' },
        { id: 8, title: 'South Korea', abbreviation: 'KOR' },
        { id: 9, title: 'India', abbreviation: 'IND' },
        { id: 10, title: 'Brazil', abbreviation: 'BRA' },
        { id: 11, title: 'Mexico', abbreviation: 'MEX' },
    ],
    locations: [
        { id: 1, title: 'Los Angeles', country_id: 1 },
        { id: 2, title: 'New York', country_id: 1 },
        { id: 3, title: 'London', country_id: 2 },
        { id: 4, title: 'Toronto', country_id: 3 },
        { id: 5, title: 'Sydney', country_id: 4 },
        { id: 6, title: 'Paris', country_id: 5 },
        { id: 7, title: 'Berlin', country_id: 6 },
        { id: 8, title: 'Tokyo', country_id: 7 },
        { id: 9, title: 'Seoul', country_id: 8 },
        { id: 10, title: 'Mumbai', country_id: 9 },
        { id: 11, title: 'São Paulo', country_id: 10 },
    ],
    genres: [
        {
            id: 1,
            title: 'Fantasy',
            description: 'Fantasy is characterized by imaginary and unrealistic elements. Fantasies typically involve supernatural powers, like magic and magical creatures. Fantasy stories often contain elements of Medievalism, such as castles, knights, kings, magical swords, and references to ancient spells.'
        },
        {
            id: 2,
            title: 'Science Fiction',
            description: 'Science fiction often explores the potential consequences of scientific innovations and asks what if questions about the future or alternate realities.'
        },
        {
            id: 3,
            title: 'Action',
            description: 'Action films typically feature a resourceful hero struggling against incredible odds, including life-threatening situations, a villain, or a pursuit which usually concludes in victory for the hero.'
        },
        {
            id: 4,
            title: 'Comedy',
            description: 'Comedy films are designed to elicit laughter from the audience. These films are light-hearted dramas, crafted to amuse and entertain.'
        },
        {
            id: 5,
            title: 'Drama',
            description: 'Drama films are serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.'
        },
        {
            id: 6,
            title: 'Horror',
            description: 'Horror films are designed to frighten and to invoke our hidden worst fears, often in a terrifying, shocking finale.'
        },
        {
            id: 7,
            title: 'Thriller',
            description: 'Thriller films are defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation, and anxiety.'
        },
        {
            id: 8,
            title: 'Romance',
            description: 'Romance films are love stories, or affairs of the heart that center on passion, emotion, and the romantic, affectionate involvement of the main characters.'
        },
        {
            id: 9,
            title: 'Documentary',
            description: 'Documentary films focus on real-life subjects and tell factual stories or provide informative material in an entertaining format.'
        },
        {
            id: 10,
            title: 'Animated',
            description: 'Animated films are ones in which individual drawings, paintings, or illustrations are photographed frame by frame (stop-frame cinematography).'
        },
        {
            id: 11,
            title: 'Mystery',
            description: 'Mystery films revolve around the solution of a problem or a crime. These films focus on the efforts of the detective, private investigator, or amateur sleuth to solve the mysterious circumstances of an issue by means of clues, investigation, and clever deduction.'
        },
    ],
    actors: [
        {
            id: 1,
            first_name: 'John',
            second_name: 'Doe',
            birth_date: '2000-01-01',
            birth_place: 1,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 2,
            first_name: 'Emma',
            second_name: 'Watson',
            birth_date: '1990-04-15',
            birth_place: 3,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 3,
            first_name: 'Robert',
            second_name: 'Downey Jr.',
            birth_date: '1965-04-04',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 4,
            first_name: 'Scarlett',
            second_name: 'Johansson',
            birth_date: '1984-11-22',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 5,
            first_name: 'Chris',
            second_name: 'Evans',
            birth_date: '1981-06-13',
            birth_place: 4,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 6,
            first_name: 'Tom',
            second_name: 'Hiddleston',
            birth_date: '1981-02-09',
            birth_place: 3,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 7,
            first_name: 'Jennifer',
            second_name: 'Lawrence',
            birth_date: '1990-08-15',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 8,
            first_name: 'Chris',
            second_name: 'Hemsworth',
            birth_date: '1983-08-11',
            birth_place: 5,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 9,
            first_name: 'Natalie',
            second_name: 'Portman',
            birth_date: '1981-06-09',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 10,
            first_name: 'Leonardo',
            second_name: 'DiCaprio',
            birth_date: '1974-11-11',
            birth_place: 1,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 11,
            first_name: 'Meryl',
            second_name: 'Streep',
            birth_date: '1949-06-22',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
    ],
    directors: [
        {
            id: 1,
            first_name: 'Jane',
            second_name: 'Tomarz',
            birth_date: '1999-01-01',
            birth_place: 1,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 2,
            first_name: 'Christopher',
            second_name: 'Nolan',
            birth_date: '1970-07-30',
            birth_place: 3,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 3,
            first_name: 'Steven',
            second_name: 'Spielberg',
            birth_date: '1946-12-18',
            birth_place: 1,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 4,
            first_name: 'Martin',
            second_name: 'Scorsese',
            birth_date: '1942-11-17',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 5,
            first_name: 'Quentin',
            second_name: 'Tarantino',
            birth_date: '1963-03-27',
            birth_place: 1,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 6,
            first_name: 'James',
            second_name: 'Cameron',
            birth_date: '1954-08-16',
            birth_place: 4,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 7,
            first_name: 'Peter',
            second_name: 'Jackson',
            birth_date: '1961-10-31',
            birth_place: 5,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 8,
            first_name: 'Ridley',
            second_name: 'Scott',
            birth_date: '1937-11-30',
            birth_place: 3,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 9,
            first_name: 'Tim',
            second_name: 'Burton',
            birth_date: '1958-08-25',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
        {
            id: 10,
            first_name: 'Alfred',
            second_name: 'Hitchcock',
            birth_date: '1899-08-13',
            birth_place: 3,
            death_date: '1980-04-29',
            death_place: 1,
            photo: null,
        },
        {
            id: 11,
            first_name: 'Francis',
            second_name: 'Ford Coppola',
            birth_date: '1939-04-07',
            birth_place: 2,
            death_date: null,
            death_place: null,
            photo: null,
        },
    ],
    studios: [
        {
            id: 1,
            title: 'Best Studio',
            found_year: '2001-02-02',
            logo: null,
            location_id: 1,
        },
        {
            id: 2,
            title: 'Universal Pictures',
            found_year: '1912-06-08',
            logo: null,
            location_id: 2,
        },
        {
            id: 3,
            title: 'Warner Bros.',
            found_year: '1923-04-04',
            logo: null,
            location_id: 1,
        },
        {
            id: 4,
            title: '20th Century Fox',
            found_year: '1935-05-31',
            logo: null,
            location_id: 2,
        },
        {
            id: 5,
            title: 'Paramount Pictures',
            found_year: '1912-05-08',
            logo: null,
            location_id: 2,
        },
        {
            id: 6,
            title: 'Columbia Pictures',
            found_year: '1924-01-10',
            logo: null,
            location_id: 2,
        },
        {
            id: 7,
            title: 'Walt Disney Pictures',
            found_year: '1923-10-16',
            logo: null,
            location_id: 1,
        },
        {
            id: 8,
            title: 'Pixar',
            found_year: '1986-02-03',
            logo: null,
            location_id: 1,
        },
        {
            id: 9,
            title: 'Sony Pictures',
            found_year: '1987-11-03',
            logo: null,
            location_id: 2,
        },
        {
            id: 10,
            title: 'New Line Cinema',
            found_year: '1967-10-13',
            logo: null,
            location_id: 1,
        },
        {
            id: 11,
            title: 'DreamWorks',
            found_year: '1994-10-12',
            logo: null,
            location_id: 1,
        },
    ],
    movies: [
        {   
            id: 1,
            title: 'Best Film',
            release_year: '2017-06-12',
            genre_id: 1,
            studio_id: 1,
            poster: null,
        },
        {
            id: 2,
            title: 'Inception',
            release_year: '2010-07-16',
            genre_id: 2,
            studio_id: 3,
            poster: null,
        },
        {
            id: 3,
            title: 'The Dark Knight',
            release_year: '2008-07-18',
            genre_id: 3,
            studio_id: 3,
            poster: null,
        },
        {
            id: 4,
            title: 'Pulp Fiction',
            release_year: '1994-10-14',
            genre_id: 3,
            studio_id: 3,
            poster: null,
        },
        {
            id: 5,
            title: 'Avatar',
            release_year: '2009-12-18',
            genre_id: 2,
            studio_id: 2,
            poster: null,
        },
        {
            id: 6,
            title: 'The Lord of the Rings: The Fellowship of the Ring',
            release_year: '2001-12-19',
            genre_id: 1,
            studio_id: 7,
            poster: null,
        },
        {
            id: 7,
            title: 'The Godfather',
            release_year: '1972-03-24',
            genre_id: 5,
            studio_id: 5,
            poster: null,
        },
        {
            id: 8,
            title: 'Star Wars: Episode IV - A New Hope',
            release_year: '1977-05-25',
            genre_id: 2,
            studio_id: 4,
            poster: null,
        },
        {
            id: 9,
            title: 'The Matrix',
            release_year: '1999-03-31',
            genre_id: 2,
            studio_id: 1,
            poster: null,
        },
        {
            id: 10,
            title: 'Jurassic Park',
            release_year: '1993-06-11',
            genre_id: 2,
            studio_id: 2,
            poster: null,
        },
        {
            id: 11,
            title: 'Schindler\'s List',
            release_year: '1993-12-15',
            genre_id: 5,
            studio_id: 2,
            poster: null,
        },
    ],
    movies_actors: [
        { movie_id: 1, actor_id: 1 },
        { movie_id: 2, actor_id: 10 },
        { movie_id: 3, actor_id: 3 },
        { movie_id: 3, actor_id: 5 },
        { movie_id: 4, actor_id: 5 },
        { movie_id: 4, actor_id: 6 },
        { movie_id: 5, actor_id: 8 },
        { movie_id: 6, actor_id: 8 },
        { movie_id: 6, actor_id: 7 },
        { movie_id: 7, actor_id: 10 },
        { movie_id: 8, actor_id: 9 },
    ],
    movies_directors: [
        { movie_id: 1, director_id: 2 },
        { movie_id: 2, director_id: 2 },
        { movie_id: 3, director_id: 2 },
        { movie_id: 4, director_id: 5 },
        { movie_id: 5, director_id: 6 },
        { movie_id: 6, director_id: 7 },
        { movie_id: 7, director_id: 4 },
        { movie_id: 8, director_id: 3 },
        { movie_id: 9, director_id: 3 },
        { movie_id: 10, director_id: 3 },
        { movie_id: 11, director_id: 3 },
    ]
};
