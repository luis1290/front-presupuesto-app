import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategorySpentThunk } from '../store/slices/categorySpent.slice';
import axios from 'axios';
import getConfig from '../helpers/getConfig';
import Swal from 'sweetalert2';





const CreateCategorySpent = ({ themeGlobal, setOpen }) => {

    const dispatch = useDispatch();


    const [categorySpent, setCategorySpent] = useState('');

    useEffect(() => {
        dispatch(getCategorySpentThunk())
    }, [categorySpent, dispatch]);

    const [formValues, setFormValues] = useState({
        name: '',
        description: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes manejar la lógica para enviar los datos del formulario parseInt(numeroComoString);
        axios.post('http://localhost:4500/addcategoryspent', formValues, getConfig())
            .then((res) => {
                console.log(res)
                setOpen()
                dispatch(getCategorySpentThunk());
                Swal.fire('Categoria Gasto agregada con exito')
            })
            .catch((error) => {
                setOpen()
                Swal.fire(`Error al crear la Categoria Gasto ${error.response.data.message}`)
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
                        Agregar Categoria Gasto
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
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Agregar Categoria Gasto
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default CreateCategorySpent;