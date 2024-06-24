
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
// import ModalCreatAplication from '../components/ModalCreatAplication';
import NapBar from '../components/NapBar';
import { useDispatch, useSelector } from 'react-redux';
// import { getJobAplicationThunk } from '../store/slices/jobAplication.slice';
// import DetailtAplication from '../components/DetailtAplication';
import axios from 'axios';
import Swal from 'sweetalert2';
import getConfig from '../helpers/getConfig';
import { useNavigate } from 'react-router';



const Home = ({ themeGlobal }) => {
  const dispatch = useDispatch();
  const jobAplication = useSelector((state) => state.jobAplication);
  const [open, setOpen] = useState(false);


  const id = localStorage.getItem("id")
  const [avatar, setAbatar] = useState('')
  const [name, setName] = useState('')

  const navigate = useNavigate()


  const handleOpen = () => {
    setOpen(!open);
  };




  // useEffect(() => {
  //   dispatch(getJobAplicationThunk(id));
  //   setAbatar(jobAplication?.url_avatar)
  //   setName(jobAplication?.name)

  // }, [jobAplication?.url_avatar, jobAplication?.name, id, dispatch]);


  return (
    <ThemeProvider theme={themeGlobal}>
      <CssBaseline />


      <NapBar nameUser={jobAplication?.name} urlUser={avatar} themeGlobal={themeGlobal} />

      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Aplicaciones de trabajo
            </Typography>

            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {/* <Box xs={12} sm={6} md={4}>
                <Grid>
                  <ModalCreatAplication themeGlobal={themeGlobal} />
                </Grid>
              </Box> */}

            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {jobAplication?.aplicatio_jobs?.map((apl) => (
              <Grid item key={apl?.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  elevation={4}
                >
                  <CardMedia
                    component="div"
                  >
                    <Typography textAlign="center" key={apl?.id} gutterBottom variant="h5" component="h2">
                      {apl?.name}
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography textAlign="center">
                      {apl.description}
                    </Typography>
                    {apl?.interviews?.map((int) => (
                      <Typography key={int?.date_interview} textAlign="center">Fecha Entrevista: {int?.date_interview}</Typography>
                    ))}
                  </CardContent>
                  <CardActions >
                    {/* <DetailtAplication key={apl?.company?.id} themeGlobal={themeGlobal} company={apl?.company?.name} email={apl?.company?.email} location={apl?.company?.location} interviews={apl?.interviews} /> */}
                    <Button size="small">Editar</Button>
                    {/* <Button onClick={() => deletAplication(apl?.id)} size="small">Eliminar</Button> */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">

        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
};

export default Home;