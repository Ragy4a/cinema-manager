import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Routes, Route, Link, Navigate } from "react-router-dom";

import StudiosItem from './StudiosItem';
import StudiosList from './StudiosList';
import { getAllStudios } from '../../store/slices/studiosSlice'

function Studios() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllStudios());
  }, [dispatch]);

  return (
    <>
      <Card sx={{ height: '5dvh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CardActionArea component={Link} to="/studios/new">
          <CardContent>
            <Typography sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <AddCircleOutlineRoundedIcon sx={{ fontSize: '3rem' }} />
              NEW STUDIO
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Routes>
        <Route path='/:id' element={<StudiosItem />} />
        <Route path='/' element={<StudiosList />} />
        <Route path="new" element={<Navigate to='/studios/new/:id' />} />
      </Routes>
    </>
  )
}

export default Studios