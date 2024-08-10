import { Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from './Header/Header';
import NavBar from "./Navigation/Navigation";
import CinemaService from './Service/CinemaService';
import Footer from './Footer/Footer';

function Layout() {
  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Grid container sx={{ flex: 1 }}>
        <Grid item lg={2} md={2} xl={2} sm={3} xs={12}>
          <NavBar />
        </Grid>
        <Grid item lg={6} md={6} xl={6} sm={9} xs={12} sx={{ padding: 2 }}>
          <Outlet />
        </Grid>
        <Grid item lg={4} md={4} xl={4} sm={12} xs={12} sx={{ padding: 2 }}>
          <CinemaService />
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default Layout;