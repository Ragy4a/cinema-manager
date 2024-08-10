import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { MOVIES_SLICE_NAME, setPending, setRejected } from '../../constants';

const initialState = {
    movies: [],
    status: 'idle',
    error: null,
}

export const getMovies = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/getMovies`,
    async (_, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${MOVIES_SLICE_NAME}/`);
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
            const { status, data } = await api.post(`${MOVIES_SLICE_NAME}/`, movie);
            if (status >= 400) throw new Error(`Error with creating movie. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const editMovie = createAsyncThunk(
    `${MOVIES_SLICE_NAME}/editMovie`,
    async (movie, { rejectWithValue }) => {
        try {
            const { status, data } = await api.put(`${MOVIES_SLICE_NAME}/${movie.id}`, movie);
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

const moviesSlice = createSlice({
    name: MOVIES_SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getMovies.fulfilled, (state, { payload }) => {
                state.movies = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getMovieById.fulfilled, (state, { payload }) => {
                state.movies = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createMovie.fulfilled, (state, { payload }) => {
                state.movies.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(editMovie.fulfilled, (state, { payload }) => {
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
            .addCase(getMovies.pending, setPending)
            .addCase(getMovieById.pending, setPending)
            .addCase(createMovie.pending, setPending)
            .addCase(editMovie.pending, setPending)
            .addCase(deleteMovie.pending, setPending)
            .addCase(getMovies.rejected, setRejected)
            .addCase(getMovieById.rejected, setRejected)
            .addCase(createMovie.rejected, setRejected)
            .addCase(editMovie.rejected, setRejected)
            .addCase(deleteMovie.rejected, setRejected)
    }
})

export default moviesSlice.reducer;