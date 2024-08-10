import Carousel from 'react-material-ui-carousel';
import { Box } from '@mui/material';
import { posters } from '../../constants';

const styles = {
  imgContainerStyle: {
    display: 'flex',
    position: 'relative',
    width: '700px',
    height: '1000px',
    overflow: 'hidden',
    color: "red",
    margin: 'auto',
  },
  imgStyle: {
    borderRadius: '15px',
    padding: '5px',
    width: 'inherit',
    height: 'inherit',
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    objectFit: 'contain'
  }
}

function HomePage() {
  return (
    <>
      <Carousel>
        {posters.map(({id, url, alt}) => (
          <Box style={styles.imgContainerStyle} key={id} >
            <img style={styles.imgStyle} src={url} alt={alt}/>
          </Box>
        ))}
      </Carousel>
    </>
  )
}

export default HomePage