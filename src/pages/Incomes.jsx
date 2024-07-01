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
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import NapBar from '../components/NapBar';
import { useDispatch, useSelector } from 'react-redux';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { getIncomeUserThunk } from '../store/slices/incomeUser.slice';
import { getIncomeBalanceUserThunk } from '../store/slices/incomeBalance.slice';
import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaginationComponent from '../components/PaginationComponent';
import ModalCreatIncome from '../components/ModalCreateIncome';
import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import getConfig from '../helpers/getConfig';
import ModalEditIncome from '../components/ModalEditIncome';
// Importa Chart.js
import Chart from 'chart.js/auto';



const Incomes = ({ themeGlobal }) => {

    const dispatch = useDispatch();
    const spentsUser = useSelector((state) => state.spentsUser);
    const categoryIncome = useSelector((state) => state.categoryIncome);
    const income = useSelector((state) => state?.incomeUser);
    const balance = useSelector((state) => state?.incomeBalance)

    // Estado para el modal de edición
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);

    // const [incomeBalance, setIncomeBalance] = useState('')
    const id = localStorage.getItem("id")


    const [avatar, setAbatar] = useState('')

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // paginacion
    const itemsPerPage = 6; // Define la cantidad de elementos por página
    const [page, setPage] = useState(1);

    // Filtra las categorías de ingreso según el término de búsqueda
    const filteredItems = Array.isArray(income) ? income.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Calcula el índice inicial y final de los elementos que se mostrarán en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // Referencia para el gráfico
    const chartRef = useRef(null);

    useEffect(() => {
        setAbatar(spentsUser.url_avatar)
        dispatch(getIncomeUserThunk(id))
        dispatch(getCategoryIncomeThunk())
        dispatch(getIncomeBalanceUserThunk(id))
        dispatch(getSpentsUserThunk(id));

        // Generar gráfico al cargar los ingresos
        generateChart();

    }, [dispatch, id, spentsUser.url_avatar]);

    useEffect(() => {
        if (Array.isArray(income)) {
            generateChart();
        } else {
            console.error("income is not an array", income);
        }
    }, [income]);

    // Función para generar el gráfico de ingresos por categoría
    const generateChart = () => {
        const ctx = document.getElementById('incomeChart');
        if (ctx) {
            // Destruir el gráfico anterior si existe
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            if (Array.isArray(income)) {
                const categories = {};
                income.forEach(income => {
                    const category = income.categoryIncome.name;
                    if (categories[category]) {
                        categories[category] += income.amount;
                    } else {
                        categories[category] = income.amount;
                    }
                });

                // Crear un nuevo gráfico y almacenar la referencia
                chartRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(categories),
                        datasets: [{
                            label: 'Ingresos por categoría',
                            data: Object.values(categories),
                            backgroundColor: themeGlobal.palette.primary.main,
                            borderColor: themeGlobal.palette.primary.dark,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return formatCurrency(value);
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            } else {
                console.error("income is not an array");
            }
        }
    };

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

    const deletIcome = (idIncome) => {
        Swal.fire({
            title: '¿Deseas eliminar este dato?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Eliminar',
            denyButtonText: `No Eliminado`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/deliteincome/${idIncome}`, getConfig())
                    .then((res) => {
                        dispatch(getIncomeUserThunk(id))
                        dispatch(getSpentsUserThunk(id));
                        Swal.fire('Ingreso eliminada con exito')
                    })
                    .catch((error) => {
                        Swal.fire('Error al eliminar el Ingreso', error.response.data.message)
                        console.error(error)
                    });
                Swal.fire('!Eliminado!', '', 'correctamente')
            } else if (result.isDenied) {
                Swal.fire('Ingreso no eliminada', '', 'info')
            }
        })
    }

    const handleSearch = () => {
        setSearchQuery(searchTerm);

    };
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

    const openEditModal = (income) => {
        setSelectedIncome(income);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedIncome(null);
        setEditModalOpen(false);
    };

    return (
        <ThemeProvider theme={themeGlobal}>
            <CssBaseline />

            <NapBar nameUser={spentsUser.name} urlUser={avatar} />

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
                            Balance:{formatCurrency(balance.balanceIncome)}
                        </Typography>

                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <ModalCreatIncome themeGlobal={themeGlobal} />
                        </Stack>
                        <Box sx={{ pt: 4 }} display="flex" justifyContent="center">
                            <TextField
                                variant="outlined"
                                label="Buscar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button onClick={handleSearch}>
                                                <SearchIcon />
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Categoría</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Descripción</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Monto</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Fecha</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(currentItems) && currentItems.map((ico) => (
                                    <TableRow key={ico?.id}>
                                        <TableCell>{ico?.name}</TableCell>
                                        <TableCell>{ico?.categoryIncome?.name}</TableCell>
                                        <TableCell>{ico?.description}</TableCell>
                                        <TableCell>{formatCurrency(ico?.amount)}</TableCell>
                                        <TableCell>{converDate(ico?.createdAt)}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => openEditModal(ico)} size="small">Editar</Button>
                                            <Button onClick={() => deletIcome(ico?.id)} size="small">Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <PaginationComponent
                        totalItems={income?.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={page}
                        onPageChange={handleChangePage}
                    />

                </Container>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Grid item xs={12}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={4}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h6" gutterBottom>
                                    Distribución de ingresos por categoría
                                </Typography>
                                <canvas id="incomeChart" width="400" height="200"></canvas>
                            </CardContent>
                        </Card>
                    </Grid>
                </Container>
            </main>


            <ModalEditIncome
                themeGlobal={themeGlobal}
                open={editModalOpen}
                handleClose={closeEditModal}
                income={selectedIncome}
            />
        </ThemeProvider>
    );
};

export default Incomes;