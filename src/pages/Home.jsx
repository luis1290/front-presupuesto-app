
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
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { getSpentsTotalThunk } from '../store/slices/totalSpent.slice';
// import DetailtAplication from '../components/DetailtAplication';
import axios from 'axios';
import Swal from 'sweetalert2';
import getConfig from '../helpers/getConfig';
import { useNavigate } from 'react-router';



const Home = ({ themeGlobal }) => {
  const dispatch = useDispatch();
  const spentsUser = useSelector((state) => state.spentsUser);
  const totalSpents = useSelector((state) => state.totalSpents);
  const [open, setOpen] = useState(false);


  const id = localStorage.getItem("id")
  const [avatar, setAbatar] = useState('')
  const [name, setName] = useState('')
  const [totalSpent, setTotalSpent] = useState('')

  const navigate = useNavigate()


  const handleOpen = () => {
    setOpen(!open);
  };




  useEffect(() => {
    dispatch(getSpentsUserThunk(id));
    dispatch(getSpentsTotalThunk(id));
    setAbatar(spentsUser?.url_avatar)
    setName(spentsUser?.name)
    setTotalSpent(totalSpents)

  }, [spentsUser?.url_avatar, spentsUser?.name, id, dispatch]);

  function converDate(fechaISO) {
    try {
      // Crear un objeto Date a partir de la cadena ISO 8601
      let fecha = new Date(fechaISO);

      // Obtener partes individuales de la fecha
      let dia = fecha.getDate();
      let mes = fecha.getMonth() + 1; // Los meses son indexados desde 0
      let anio = fecha.getFullYear();
      let horas = fecha.getHours();
      let minutos = fecha.getMinutes();


      // Determinar AM o PM y ajustar las horas al formato de 12 horas
      let ampm = horas >= 12 ? 'PM' : 'AM';
      horas = horas % 12;
      horas = horas ? horas : 12; // La hora '0' debe ser '12'

      // Formatear las partes para que tengan siempre dos dígitos
      dia = dia < 10 ? '0' + dia : dia;
      mes = mes < 10 ? '0' + mes : mes;
      horas = horas < 10 ? '0' + horas : horas;
      minutos = minutos < 10 ? '0' + minutos : minutos;


      // Formatear la fecha en el formato deseado
      return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
    } catch (error) {
      console.error("Formato de fecha inválido:", error);
      return null;
    }
  }

  function formatCurrency(amount) {
    if (amount !== undefined) {
      return amount.toLocaleString('es-CR', {
        style: 'currency',
        currency: 'CRC',
      });
    } else {
      console.error('Value is undefined');
      return 'Invalid value';
    }

  }


  return (
    <ThemeProvider theme={themeGlobal}>
      <CssBaseline />

      {console.log('name', spentsUser?.name)}
      <NapBar nameUser={spentsUser?.name} urlUser={avatar} themeGlobal={themeGlobal} />

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
              Total Gastos: {formatCurrency(totalSpents.totalSpent)}
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
            {spentsUser?.spents?.map((apl) => (
              <Grid item key={apl?.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  elevation={4}
                >
                  <CardMedia
                    component="div"
                  >
                    <Typography textAlign="center" key={apl?.id} gutterBottom variant="h3" component="h3">
                      {apl?.name}
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography textAlign="center" gutterBottom variant="h5">
                      {formatCurrency(apl.amount)}
                    </Typography>
                    <Typography textAlign="center" variant="h5">
                      {apl.description}
                    </Typography>
                    <Typography textAlign="center" key={apl?.id} gutterBottom variant="h6" component="h6">
                      {converDate(apl?.createdAt)}
                    </Typography>
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