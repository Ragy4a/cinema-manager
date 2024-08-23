import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom"

import ActorsForm from '../Actors/ActorsForm'
import DirectorsForm from "../Directors/DirectorsForm"
import MoviesForm from '../Movies/MoviesForm'
import StudiosForm from '../Studios/StudiosForm'
import CarouselList from "../HomePage/CarouselList";

function CinemaService() {
  return (
    <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, height: '100%' }}>
      <Routes>
        <Route path='/actors/new/:id' element={<ActorsForm />} />
        <Route path='/actors/edit/:id' element={<ActorsForm />} />
        <Route path='/directors/new/:id' element={<DirectorsForm />} />
        <Route path='/directors/edit/:id' element={<DirectorsForm />} />
        <Route path='/movies/new/:id' element={<MoviesForm />} />
        <Route path='/movies/edit/:id' element={<MoviesForm />} />
        <Route path='/studios/new/:id' element={<StudiosForm />} />
        <Route path='/studios/edit/:id' element={<StudiosForm />} />
        <Route index element={<CarouselList />} />
      </Routes>
    </Box>
  );
}

export default CinemaService;