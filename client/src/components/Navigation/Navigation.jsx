import { List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import CameraIndoorRoundedIcon from '@mui/icons-material/CameraIndoorRounded';
import { styled } from "@mui/system";

const NavBarContainer = styled(List)({
  backgroundColor: '#2c3e50',
  height: '100%',
  padding: '20px',
  color: '#ecf0f1',
});

const NavItem = styled(ListItem)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#34495e',
  },
  textDecoration: 'none',  
  color: '#ecf0f1', 
});

function NavBar() {
  return (
    <NavBarContainer>
      <NavItem button component={Link} to=''>
        <HomeRoundedIcon fontSize="large" />
        <span style={{ marginLeft: '15px' }}>Home</span>
      </NavItem>
      <NavItem button component={Link} to='/actors'>
        <RecentActorsIcon fontSize="large" />
        <span style={{ marginLeft: '15px' }}>Actors</span>
      </NavItem>
      <NavItem button component={Link} to='/movies'>
        <MovieCreationIcon fontSize="large" />
        <span style={{ marginLeft: '15px' }}>Movies</span>
      </NavItem>
      <NavItem button component={Link} to='/directors'>
        <PaidRoundedIcon fontSize="large" />
        <span style={{ marginLeft: '15px' }}>Directors</span>
      </NavItem>
      <NavItem button component={Link} to='/studios'>
        <CameraIndoorRoundedIcon fontSize="large" />
        <span style={{ marginLeft: '15px' }}>Studios</span>
      </NavItem>
    </NavBarContainer>
  );
}

export default NavBar;