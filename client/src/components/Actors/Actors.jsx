import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Routes, Route, Link } from "react-router-dom";

import ActorsItem from "./ActorsItem";
import ActorsList from "./ActorsList";
import { getAllActors } from "../../store/slices/actorsSlice";

function Actors() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllActors());
  }, [dispatch]);

  return (
    <>
      <Card sx={{ height: '5dvh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CardActionArea component={Link} to="/actors/new">
          <CardContent>
            <Typography sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <AddCircleOutlineRoundedIcon sx={{ fontSize: '3rem' }} />
              NEW ACTOR
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Routes>
        <Route path="/:id" element={<ActorsItem />} />
        <Route path='/' element={<ActorsList />} />
      </Routes>
    </>
  );
}

export default Actors;