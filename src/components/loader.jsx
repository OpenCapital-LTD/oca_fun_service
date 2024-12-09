// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: '3px'
  }
}));

// ==============================|| Loader ||============================== //

const Loader = () => (
  // <LoaderWrapper>
  //   <LinearProgress color="primary" />
  // </LoaderWrapper>
  <div>loading</div>
);

export default Loader;
