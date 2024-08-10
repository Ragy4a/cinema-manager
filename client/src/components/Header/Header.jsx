import { Box, Typography } from "@mui/material";

function Header() {
  return (
    <Box sx={{ backgroundColor: '#333', color: '#fff', padding: 2 }}>
      <Typography variant="h4">My Cinema App</Typography>
    </Box>
  );
}

export default Header;