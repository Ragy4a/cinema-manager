import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { ACTORS_SLICE_NAME, setPending, setRejected } from '../../constants';

const initialState = {
    actors: [],
    status: 'idle',
    error: null,
    total: 0, 
    filteredActors: [], 
};

export const getAllActors = createAsyncThunk(
    `${ACTORS_SLICE_NAME}/getAllActors`,
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
            const { status, data } = await api.get(`${ACTORS_SLICE_NAME}/`, { params })
            if (status >= 400) throw new Error(`Error with getting actors. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getActorById = createAsyncThunk(
    `${ACTORS_SLICE_NAME}/getActorById`,
    async (actorId, { rejectWithValue }) => {
        try {
            const { status, data } = await api.get(`${ACTORS_SLICE_NAME}/${actorId}`);
            if (status >= 400) throw new Error(`Error with getting actor. Error status is ${status}.`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createActor = createAsyncThunk(
    `${ACTORS_SLICE_NAME}/createActor`,
    async (formData, { rejectWithValue }) => {
      try {
        const { status, data } = await api.post(`${ACTORS_SLICE_NAME}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (status >= 400) throw new Error(`Error with creating actor. Error status is ${status}.`);
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const updateActor = createAsyncThunk(
    `${ACTORS_SLICE_NAME}/updateActor`,
    async (formData, { rejectWithValue }) => {
      try {
        for (let pair of formData.entries()) {
            if (pair[0] === 'photo') {
              console.log(`${pair[0]}: ${pair[1].name}`);
            } else {
              console.log(`${pair[0]}: ${pair[1]}`);
            }
          }
        const { status, data } = await api.put(`${ACTORS_SLICE_NAME}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (status >= 400) throw new Error(`Error with updating actor. Error status is ${status}.`);
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );  

export const deleteActor = createAsyncThunk(
    `${ACTORS_SLICE_NAME}/deleteActor`,
    async (actorId, { rejectWithValue }) => {
        try {
            const { status } = await api.delete(`${ACTORS_SLICE_NAME}/${actorId}`);
            if(status >= 400) throw new Error(`Error deleting actor with ID ${actorId}. Error status is ${status}.`);
            return actorId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const selectActors = createAsyncThunk(
  `${ACTORS_SLICE_NAME}/selectActors`,
  async (_, { rejectWithValue }) => {
    try {
      const { status, data } = await api.get(`${ACTORS_SLICE_NAME}/selectActors`);
      if(status >= 400) throw new Error(`Error with getting actors for select. Error status is ${status}.`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const actorsSlice = createSlice({
    name: ACTORS_SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllActors.fulfilled, (state, { payload }) => {
                state.total = payload.total;
                state.actors = payload.actors;
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getActorById.fulfilled, (state, { payload }) => {
                state.actors = [payload];
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(createActor.fulfilled, (state, { payload }) => {
                state.actors.push(payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(updateActor.fulfilled, (state, { payload }) => {
                state.actors = state.actors.map((actor) =>
                    actor.id === payload.id ? payload : actor
                );
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteActor.fulfilled, (state, { payload }) => {
                state.actors = state.actors.filter(actor => actor.id !== payload);
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(selectActors.fulfilled, (state, { payload }) => {
              state.actors = payload;
              state.status = 'fulfilled';
              state.error = null;
            })
            .addCase(getAllActors.pending, setPending)
            .addCase(getActorById.pending, setPending)
            .addCase(createActor.pending, setPending)
            .addCase(updateActor.pending, setPending)
            .addCase(deleteActor.pending, setPending)
            .addCase(selectActors.pending, setPending)
            .addCase(getAllActors.rejected, setRejected)
            .addCase(getActorById.rejected, setRejected)
            .addCase(createActor.rejected, setRejected)
            .addCase(updateActor.rejected, setRejected)
            .addCase(deleteActor.rejected, setRejected)
            .addCase(selectActors.rejected, setRejected)
    }
});

export default actorsSlice.reducer;