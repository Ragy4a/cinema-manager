import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api'
import { STUDIOS_SLICE_NAME, setPending, setRejected } from '../../constants';

const initialState = {
    studios: [],
    status: 'idle',
    error: null,
}

export const getStudios = createAsyncThunk(
    `${STUDIOS_SLICE_NAME}/getStudios`,
    async (_, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${STUDIOS_SLICE_NAME}/`);
            if(status >= 400) throw new Error(`Error with getting studios. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getStudioById = createAsyncThunk(
    `${STUDIOS_SLICE_NAME}/getStudioById`,
    async (studioId, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${STUDIOS_SLICE_NAME}/${studioId}`);
            if (status >= 400) throw new Error(`Error with getting studio. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const createStudio = createAsyncThunk(
    `${STUDIOS_SLICE_NAME}/createStudio`,
    async (studio, { rejectWithValue }) => {
        try {
            const { status, data } = await api.post(`${STUDIOS_SLICE_NAME}/`, studio);
            if (status >= 400) throw new Error(`Error with creating studio. Error status is ${status}.`)
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const editStudio = createAsyncThunk(
    `${STUDIOS_SLICE_NAME}/editStudio`,
    async (studio, { rejectWithValue }) => {
        try {
            const { status, data } = await api.put(`${STUDIOS_SLICE_NAME}/${studio.id}`, studio);
            if (status >= 400) throw new Error(`Error with editing studio. Error status is ${status}.`)
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteStudio = createAsyncThunk(
    `${STUDIOS_SLICE_NAME}/deleteStudio`,
    async (studioId, { rejectWithValue }) => {
      try {
        const { status } = await api.delete(`${STUDIOS_SLICE_NAME}/${studioId}`);
        if(status >= 400) throw new Error(`Error with deleting studio. Error status is ${status}.`);
        return studioId;
      } catch (error) {
        return rejectWithValue(error.message);
      }
  }
);

export const selectStudios = createAsyncThunk(
    `${STUDIOS_SLICE_NAME}/selectStudios`,
    async (_, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${STUDIOS_SLICE_NAME}/selectStudios`);
            if (status >= 400) throw new Error(`Error with getting studios for select. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const studiosSlice = createSlice({
    name: STUDIOS_SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getStudios.fulfilled, (state, { payload }) => {
                state.studios = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getStudioById.fulfilled, (state, { payload }) => {
                state.studios = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createStudio.fulfilled, (state, { payload }) => {
                state.studios.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(editStudio.fulfilled, (state, { payload }) => {
                state.studios = state.studios.map((studio) =>
                studio.id === payload.id ? payload : studio);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteStudio.fulfilled, (state, { payload }) => {
                state.studios = state.studios.filter(studio => studio.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(selectStudios.fulfilled, (state, { payload }) => {
                state.studios = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getStudios.pending, setPending)
            .addCase(getStudioById.pending, setPending)
            .addCase(createStudio.pending, setPending)
            .addCase(editStudio.pending, setPending)
            .addCase(deleteStudio.pending, setPending)
            .addCase(selectStudios.pending, setPending)
            .addCase(getStudios.rejected, setRejected)
            .addCase(getStudioById.rejected, setRejected)
            .addCase(createStudio.rejected, setRejected)
            .addCase(editStudio.rejected, setRejected)
            .addCase(deleteStudio.rejected, setRejected)
            .addCase(selectStudios.rejected, setRejected)
    }
})

export default studiosSlice.reducer;