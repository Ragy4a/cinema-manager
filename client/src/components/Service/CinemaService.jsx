import { Box, Typography } from "@mui/material";
import { Routes, Route } from "react-router-dom"

import ActorsForm from '../Actors/ActorsForm'
import DirectorsForm from "../Directors/DirectorsForm"
import MoviesForm from '../Movies/MoviesForm'
import StudiosForm from '../Studios/StudiosForm'

function CinemaService() {
  return (
    <>
      <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, height: '100%' }}>
        <Typography variant="h6">Cinema Service</Typography>
      </Box>
      <Routes>
        <Route path='/actors/add-new' element={<ActorsForm />} />
        <Route path='/actors/edit/:id' element={<ActorsForm />} />
        <Route path='/directors/add-new' element={<DirectorsForm />} />
        <Route path='/directors/edit/:id' element={<DirectorsForm />} />
        <Route path='/movies/add-new' element={<MoviesForm />} />
        <Route path='/movies/edit/:id' element={<MoviesForm />} />
        <Route path='/studios/add-new' element={<StudiosForm />} />
        <Route path='/studios/edit/:id' element={<StudiosForm />} />
      </Routes>
    </>
  );
}

export default CinemaService;