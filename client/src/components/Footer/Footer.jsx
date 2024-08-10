import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box sx={{ backgroundColor: '#333', color: '#fff', padding: 2, textAlign: 'center' }}>
      <Typography variant="body1">© 2024 Cinema App</Typography>
    </Box>
  );
}

export default Footer;