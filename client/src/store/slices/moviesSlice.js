import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { MOVIES_SLICE_NAME, setPending, setRejected } from '../../constants';

const initialState = {
    movies: [],
    status: 'idle',
    error: null,
    total: 0,
};

export const getAllMovies = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/getAllMovies`,
    async ({ search, filter, page = 1, itemsPerPage = 10 }, { rejectWithValue }) => {
        try {
            const params = {
                page,
                result: itemsPerPage,
            };
            if (search) {
                params.search = search;
            }
            if (filter) {
                params.filter = filter;
            }
            const { status, data } = await api.get(`${MOVIES_SLICE_NAME}/`, { params });
            if (status >= 400) throw new Error(`Error with getting movies. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getMovieById = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/getMovieById`,
    async (movieId, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${MOVIES_SLICE_NAME}/${movieId}`);
            if (status >= 400) throw new Error(`Error with getting movie. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createMovie = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/createMovie`,
    async (movie, { rejectWithValue }) => {
        try {
            const { status, data } = await api.post(`${MOVIES_SLICE_NAME}/`, movie, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            if (status >= 400) throw new Error(`Error with creating movie. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateMovie = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/updateMovie`,
    async (movie, { rejectWithValue }) => {
        try {
            const { status, data } = await api.put(`${MOVIES_SLICE_NAME}`, movie, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            if (status >= 400) throw new Error(`Error with editing movie. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteMovie = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/deleteMovie`,
    async (movieId, { rejectWithValue }) => {
        try {
            const { status } = await api.delete(`${MOVIES_SLICE_NAME}/${movieId}`);
            if (status >= 400) throw new Error(`Error with deleting movie. Error status is ${status}.`);
            return movieId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const selectMovies = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/selectMovies`,
    async(_, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${MOVIES_SLICE_NAME}/selectMovies`);
            if (status >= 400) throw new Error(`Error with getting movies for select. Error status is ${status}.`)
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const moviesSlice = createSlice({
    name: MOVIES_SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllMovies.fulfilled, (state, { payload }) => {
                state.movies = payload.movies;
                state.total = payload.total;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getMovieById.fulfilled, (state, { payload }) => {
                state.movies = [payload];
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createMovie.fulfilled, (state, { payload }) => {
                state.movies.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(updateMovie.fulfilled, (state, { payload }) => {
                state.movies = state.movies.map((movie) =>
                movie.id === payload.id ? payload : movie);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteMovie.fulfilled, (state, { payload }) => {
                state.movies = state.movies.filter(movie => movie.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(selectMovies.fulfilled, (state, { payload }) => {
                state.movies = payload
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getAllMovies.pending, setPending)
            .addCase(getMovieById.pending, setPending)
            .addCase(createMovie.pending, setPending)
            .addCase(updateMovie.pending, setPending)
            .addCase(deleteMovie.pending, setPending)
            .addCase(selectMovies.pending, setPending)
            .addCase(getAllMovies.rejected, setRejected)
            .addCase(getMovieById.rejected, setRejected)
            .addCase(createMovie.rejected, setRejected)
            .addCase(updateMovie.rejected, setRejected)
            .addCase(deleteMovie.rejected, setRejected)
            .addCase(selectMovies.rejected, setRejected)
    }
})

export default moviesSlice.reducer;