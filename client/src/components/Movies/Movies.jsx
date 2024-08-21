import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Routes, Route, Link, Navigate } from "react-router-dom";

import MoviesItem from './MoviesItem'
import MoviesList from './MoviesList'
import { getAllMovies } from '../../store/slices/moviesSlice'

function Movies() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMovies())
  }, [dispatch])

  return (
    <>
      <Card sx={{ height: '5dvh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CardActionArea component={Link} to="/movies/new">
          <CardContent>
            <Typography sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <AddCircleOutlineRoundedIcon sx={{ fontSize: '3rem' }} />
              NEW MOVIE
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Routes>
        <Route path='/:id' element={<MoviesItem />} />
        <Route path='/' element={<MoviesList />} />
        <Route path="new" element={<Navigate to='/movies/new/:id' />} />
      </Routes>
    </>
  )
}

export default Movies