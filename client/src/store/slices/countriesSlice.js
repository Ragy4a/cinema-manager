import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { COUNTRY_SLICE_NAME, setPending, setRejected } from '../../constants';

export const getAllCountries = createAsyncThunk(
    `${COUNTRY_SLICE_NAME}/getAllCountries`,
    async (_, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get('/countries');
            if (status >= 400) throw new Error(`Error fetching countries. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCountry = createAsyncThunk(
    `${COUNTRY_SLICE_NAME}/createCountry`,
    async (country, { rejectWithValue }) => {
        try {
            const { status, data } = await api.post('/countries', country);
            if (status >= 400) throw new Error(`Error creating country. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCountry = createAsyncThunk(
    `${COUNTRY_SLICE_NAME}/updateCountry`,
    async (country, { rejectWithValue }) => {
        try {
            const { status, data } = await api.put(`/countries/${country.id}`, country);
            if (status >= 400) throw new Error(`Error updating country. Status: ${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCountry = createAsyncThunk(
    `${COUNTRY_SLICE_NAME}/deleteCountry`,
    async (id, { rejectWithValue }) => {
        try {
            const { status } = await api.delete(`/countries/${id}`);
            if (status >= 400) throw new Error(`Error deleting country. Status: ${status}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const countrySlice = createSlice({
    name: COUNTRY_SLICE_NAME,
    initialState: {
        countries: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCountries.fulfilled, (state, { payload }) => {
                state.countries = payload;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, { payload }) => {
                state.countries.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, { payload }) => {
                state.countries = state.countries.map(country => 
                    country.id === payload.id ? payload : country);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, { payload }) => {
                state.countries = state.countries.filter(country => country.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getAllCountries.pending, setPending)
            .addCase(createCountry.pending, setPending)
            .addCase(updateCountry.pending, setPending)
            .addCase(deleteCountry.pending, setPending)
            .addCase(getAllCountries.rejected, setRejected)
            .addCase(createCountry.rejected, setRejected)
            .addCase(updateCountry.rejected, setRejected)
            .addCase(deleteCountry.rejected, setRejected);
    }
});

export default countrySlice.reducer;