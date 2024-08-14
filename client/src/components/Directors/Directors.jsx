import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Routes, Route, Link, Navigate } from "react-router-dom";
 
import DirectorsItem from './DirectorsItem';
import DirectorsList from './DirectorsList';
import { getAllDirectors } from "../../store/slices/directorsSlice";

function Directors() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDirectors())
  }, [dispatch])

  return (
    <>
      <Card sx={{ height: '5dvh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CardActionArea component={Link} to="/directors/new">
          <CardContent>
            <Typography sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <AddCircleOutlineRoundedIcon sx={{ fontSize: '3rem' }} />
              NEW DIRECTOR
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Routes>
        <Route path='/:id' element={<DirectorsItem />} />
        <Route path='/' element={<DirectorsList />} />
        <Route path="new" element={<Navigate to='/directors/new/:id' />} />
      </Routes>
    </>
  )
}

export default Directors