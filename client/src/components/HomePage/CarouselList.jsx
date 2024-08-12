import { Box, Typography, Grid, Avatar } from '@mui/material';
import { posters } from '../../constants';

const CarouselGrid = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Movies in Carousel
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {posters.map(({ id, url, alt, title }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                variant="square"
                src={url}
                alt={alt}
                sx={{ width: 200, height: 300, margin: '0 auto', border: '2px solid #ddd' }}
              />
              <Typography
                variant="subtitle1"
                mt={1}
                sx={{
                  height: '60px',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0 10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  wordWrap: 'break-word',
                  fontSize: '0.875rem',
                  lineHeight: '1.2',
                }}
              >
                {title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CarouselGrid;