import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { GENRE_SLICE_NAME, setPending, setRejected } from '../../constants';

const initialState = {
    genres: [],
    status: 'idle',
    error: null,
};

export const getAllGenres = createAsyncThunk(
    `${GENRE_SLICE_NAME}/getAllGenres`,
    async (_, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${GENRE_SLICE_NAME}`);
            if (status >= 400) throw new Error(`Error fetching genres. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createGenre = createAsyncThunk(
    `${GENRE_SLICE_NAME}/createGenre`,
    async (genre, { rejectWithValue }) => {
        try {
            const { status, data } = await api.post(`${GENRE_SLICE_NAME}`, genre);
            if (status >= 400) throw new Error(`Error creating genre. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateGenre = createAsyncThunk(
    `${GENRE_SLICE_NAME}/updateGenre`,
    async (genre, { rejectWithValue }) => {
        try {
            const { status, data } = await api.put(`/${GENRE_SLICE_NAME}`, genre);
            if (status >= 400) throw new Error(`Error updating genre. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteGenre = createAsyncThunk(
    `${GENRE_SLICE_NAME}/deleteGenre`,
    async (id, { rejectWithValue }) => {
        try {
            const { status } = await api.delete(`/${GENRE_SLICE_NAME}/${id}`);
            if (status >= 400) throw new Error(`Error deleting genre. Status: ${status}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const genresSlice = createSlice({
    name: GENRE_SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllGenres.fulfilled, (state, { payload }) => {
                state.genres = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createGenre.fulfilled, (state, { payload }) => {
                state.genres.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(updateGenre.fulfilled, (state, { payload }) => {
                state.genres = state.genres.map(genre => 
                    genre.id === payload.id ? payload : genre);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteGenre.fulfilled, (state, { payload }) => {
                state.genres = state.genres.filter(genre => genre.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getAllGenres.pending, setPending)
            .addCase(createGenre.pending, setPending)
            .addCase(updateGenre.pending, setPending)
            .addCase(deleteGenre.pending, setPending)
            .addCase(getAllGenres.rejected, setRejected)
            .addCase(createGenre.rejected, setRejected)
            .addCase(updateGenre.rejected, setRejected)
            .addCase(deleteGenre.rejected, setRejected);
    }
});

export default genresSlice.reducer;