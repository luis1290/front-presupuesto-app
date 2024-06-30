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
import { getIncomeUserThunk } from '../store/slices/incomeUser.slice';
import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
import { getIncomeBalanceUserThunk } from '../store/slices/incomeBalance.slice';
import axios from 'axios';
import getConfig from '../helpers/getConfig';
import Swal from 'sweetalert2';
import { InputLabel, MenuItem, Select } from '@mui/material';





const CreateIncome = ({ themeGlobal, setOpen }) => {

    const dispatch = useDispatch();
    const categoryIncome = useSelector((state) => state.categoryIncome);

    const [income, setIncome] = useState('');

    const id = localStorage.getItem("id")

    useEffect(() => {
        dispatch(getIncomeUserThunk(id))
        dispatch(getCategoryIncomeThunk())
    }, [income, dispatch]);



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
        axios.post('http://localhost:8000/addincome', formValues, getConfig())
            .then((res) => {
                console.log(res)
                setOpen()
                dispatch(getIncomeUserThunk(id));
                dispatch(getIncomeBalanceUserThunk(id))
                Swal.fire('Ingreso agregada con exito')
            })
            .catch((error) => {
                setOpen()
                Swal.fire(`Error al crear el Ingreso ${error.response.data.message}`)
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
                        Agregar  Ingreso
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
                                <InputLabel id="demo-simple-select-label">Categoria Ingreso</InputLabel>
                                <Select
                                    labelId="categoryincome"
                                    id="category_id"
                                    name="category_id"
                                    value={formValues.category_id}
                                    label="Age"
                                    onChange={handleChange}
                                    sx={{ mt: 3, mb: 2, minWidth: 200 }}
                                >
                                    {Array.isArray(categoryIncome) ? categoryIncome?.map((cateIncome) => (
                                        <MenuItem id="selectCategoryIncome" key={cateIncome?.id} value={cateIncome?.id}>{cateIncome?.name}</MenuItem>
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
                            Agregar  Ingreso
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default CreateIncome;