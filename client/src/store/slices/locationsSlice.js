import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { LOCATION_SLICE_NAME, setPending, setRejected } from '../../constants';

export const getAllLocations = createAsyncThunk(
    `${LOCATION_SLICE_NAME}/getAllLocations`,
    async (countryId, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get('/locations', {
                params: { country_id: countryId }
            });
            if (status >= 400) throw new Error(`Error fetching locations. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createLocation = createAsyncThunk(
    `${LOCATION_SLICE_NAME}/createLocation`,
    async (location, { rejectWithValue }) => {
        try {
            const { status, data } = await api.post('/locations', location);
            if (status >= 400) throw new Error(`Error creating location. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateLocation = createAsyncThunk(
    `${LOCATION_SLICE_NAME}/updateLocation`,
    async (location, { rejectWithValue }) => {
        try {
            const { status, data } = await api.put(`/locations/${location.id}`, location);
            if (status >= 400) throw new Error(`Error updating location. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteLocation = createAsyncThunk(
    `${LOCATION_SLICE_NAME}/deleteLocation`,
    async (id, { rejectWithValue }) => {
        try {
            const { status } = await api.delete(`/locations/${id}`);
            if (status >= 400) throw new Error(`Error deleting location. Status: ${status}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const locationSlice = createSlice({
    name: LOCATION_SLICE_NAME,
    initialState: {
        locations: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllLocations.fulfilled, (state, { payload }) => {
                state.locations = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createLocation.fulfilled, (state, { payload }) => {
                state.locations.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(updateLocation.fulfilled, (state, { payload }) => {
                state.locations = state.locations.map(location => 
                    location.id === payload.id ? payload : location);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteLocation.fulfilled, (state, { payload }) => {
                state.locations = state.locations.filter(location => location.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getAllLocations.pending, setPending)
            .addCase(createLocation.pending, setPending)
            .addCase(updateLocation.pending, setPending)
            .addCase(deleteLocation.pending, setPending)
            .addCase(getAllLocations.rejected, setRejected)
            .addCase(createLocation.rejected, setRejected)
            .addCase(updateLocation.rejected, setRejected)
            .addCase(deleteLocation.rejected, setRejected);
    }
});

export default locationSlice.reducer;