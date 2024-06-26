import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getCompaniesThunk } from '../store/slices/companies.slice';
import axios from 'axios';
import getConfig from '../helpers/getConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
// import { getJobAplicationThunk } from '../store/slices/jobAplication.slice';



const CreateSpent = ({ themeGlobal, setOpen }) => {

  const dispatch = useDispatch();
  const companiesArray = useSelector((state) => state?.companies);
  const id = localStorage.getItem("id")

  const navigate = useNavigate()

  const [company, setCompany] = useState('');

//   useEffect(() => {
//     dispatch(getCompaniesThunk())
//   }, [company, dispatch]);

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    date_share: '',
    company_id: '',
    uer_id: parseInt(id)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    // // Aquí puedes manejar la lógica para enviar los datos del formulario parseInt(numeroComoString);
    // axios.post('http://localhost:8000/aplicationjob', formValues, getConfig())
    //   .then((res) => {
    //     console.log(res)
    //     setOpen()
    //     // navigate("/")    dispatch(setJobAplication(res.data));
    //     dispatch(getJobAplicationThunk(id));
    //     Swal.fire('Aplicacion agregada con exito')
    //   })
    //   .catch((error) => {
    //     setOpen()
    //     Swal.fire(`Error al crear la aplicacion ${error.response.data.message}`)
    //     console.error(error)
    //   });
    // console.log('Valores del formulario:', formValues);
  };

  return (
    <ThemeProvider theme={themeGlobal}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}

        >

          <Typography component="h1" variant="h5">
            Crear una aplicación
          </Typography>
          <form onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={11} sm={11} md={11}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  value={formValues.name}
                  required
                  fullWidth
                  id="name"
                  label="Nombre Aplicación"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={11} sm={11} md={11}>

                <TextField
                  required
                  id="description"
                  name="description"
                  label="Descripción"
                  value={formValues.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  autoFocus
                  fullWidth
                />
              </Grid>
              <Grid item xs={11} sm={11} md={11}>

                <TextField
                  id="date_share"
                  label="fecha"
                  name="date_share"
                  type="date"
                  value={formValues.date_share}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={11} sm={11} md={11}>
                <InputLabel id="demo-simple-select-label">Empresas</InputLabel>
                <Select
                  labelId="company"
                  id="company_id"
                  name="company_id"
                  value={formValues.company_id}
                  label="Age"
                  onChange={handleChange}
                >
                  {Array.isArray(companiesArray) ? companiesArray?.map((company) => (
                    <MenuItem id="selectCompany" key={company?.id} value={company?.id}>{company?.name}</MenuItem>
                  )) : null}
                </Select>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Agregar aplicación
            </Button>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreateSpent;