import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { DIRECTORS_SLICE_NAME, setPending, setRejected } from '../../constants';

const initialState = {
    directors: [],
    status: 'idle',
    error: null,
    total: 0,
    filteredDirectors: []
};

export const getAllDirectors = createAsyncThunk(
    `${DIRECTORS_SLICE_NAME}/getAllDirectors`,
    async ({ page = 1, itemsPerPage = 5, search, filter }, { rejectWithValue }) => {
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
            const { status, data } = await api.get(`${DIRECTORS_SLICE_NAME}/`, { params });
            if (status >= 400) throw new Error(`Error with getting directors. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getDirectorById = createAsyncThunk(
    `${DIRECTORS_SLICE_NAME}/getDirectorById`,
    async (directorId, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${DIRECTORS_SLICE_NAME}/${directorId}`);
            if (status >= 400) throw new Error(`Error with getting director. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDirector = createAsyncThunk(
    `${DIRECTORS_SLICE_NAME}/createDirector`,
    async (formData, { rejectWithValue }) => {
        try {
            const { status, data } = await api.post(`${DIRECTORS_SLICE_NAME}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (status >= 400) throw new Error(`Error with creating director. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateDirector = createAsyncThunk(
    `${DIRECTORS_SLICE_NAME}/updateDirector`,
    async (formData, { rejectWithValue }) => {
        try {
            for (let pair of formData.entries()) {
                if (pair[0] === 'photo') {
                    console.log(`${pair[0]}: ${pair[1].name}`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }
            const { status, data } = await api.put(`${DIRECTORS_SLICE_NAME}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (status >= 400) throw new Error(`Error with updating director. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteDirector = createAsyncThunk(
    `${DIRECTORS_SLICE_NAME}/deleteDirector`,
    async (directorId, { rejectWithValue }) => {
        try {
            const { status } = await api.delete(`${DIRECTORS_SLICE_NAME}/${directorId}`);
            if (status >= 400) throw new Error(`Error deleting director with ID ${directorId}. Error status is ${status}.`);
            return directorId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const directorsSlice = createSlice({
    name: DIRECTORS_SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllDirectors.fulfilled, (state, { payload }) => {
                state.total = payload.total;
                state.directors = payload.directors;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getDirectorById.fulfilled, (state, { payload }) => {
                state.directors = [payload];
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createDirector.fulfilled, (state, { payload }) => {
                state.directors.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(updateDirector.fulfilled, (state, { payload }) => {
                state.directors = state.directors.map((director) =>
                    director.id === payload.id ? payload : director
                );
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteDirector.fulfilled, (state, { payload }) => {
                state.directors = state.directors.filter(director => director.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getAllDirectors.pending, setPending)
            .addCase(getDirectorById.pending, setPending)
            .addCase(createDirector.pending, setPending)
            .addCase(updateDirector.pending, setPending)
            .addCase(deleteDirector.pending, setPending)
            .addCase(getAllDirectors.rejected, setRejected)
            .addCase(getDirectorById.rejected, setRejected)
            .addCase(createDirector.rejected, setRejected)
            .addCase(updateDirector.rejected, setRejected)
            .addCase(deleteDirector.rejected, setRejected);
    }
});

export default directorsSlice.reducer;