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
import axios from 'axios';
import getConfig from '../helpers/getConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { getCategorySpentThunk } from '../store/slices/categorySpent.slice';
import { getSpentsTotalThunk } from '../store/slices/totalSpent.slice';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';



const CreateSpent = ({ themeGlobal, setOpen }) => {

  const dispatch = useDispatch();
  const spentsUser = useSelector((state) => state.spentsUser);
  const totalSpents = useSelector((state) => state.totalSpents);

  const categorySpent = useSelector((state) => state?.categorySpent);
  const id = localStorage.getItem("id")

  const navigate = useNavigate()

  const [company, setCompany] = useState('');

  useEffect(() => {
    dispatch(getCategorySpentThunk())
  }, [dispatch]);

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    amount: '',
    category_id: '',
    user_id: parseInt(id)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'amount') {
      if (/^\d*$/.test(value)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos del formulario parseInt(numeroComoString);
    axios.post('http://localhost:8000/addspent', formValues, getConfig())
      .then((res) => {
        console.log(res)
        dispatch(getSpentsUserThunk(id));
        dispatch(getSpentsTotalThunk(id));
        Swal.fire('Gasto agregada con exito')
        setOpen(false)
      })
      .catch((error) => {

        Swal.fire(`Error al crear el Gasto ${error.response.data.message}`)
        console.error(error)
      });
    console.log('Valores del formulario:', formValues);
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
            Agregar Gasto
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
                  label="Nombre"
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
                  required
                  id="amount"
                  name="amount"
                  label="monto"
                  value={formValues.amount}
                  onChange={handleChange}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  rows={4}
                  autoFocus
                  fullWidth
                />
              </Grid>

              <Grid item xs={11} sm={11} md={11}>
                <InputLabel id="demo-simple-select-label">Categoria Gasto</InputLabel>
                <Select
                  labelId="categoryincome"
                  id="category_id"
                  name="category_id"
                  value={formValues.category_id}
                  label="Age"
                  onChange={handleChange}
                  sx={{ mt: 3, mb: 2, minWidth: 200 }}
                >
                  {Array.isArray(categorySpent) ? categorySpent?.map((cateSpe) => (
                    <MenuItem id="selectCategorySpent" key={cateSpe?.id} value={cateSpe?.id}>{cateSpe?.name}</MenuItem>
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
              Agregar Gasto
            </Button>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreateSpent;