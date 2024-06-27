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
import NapBar from '../components/NapBar';
import { useDispatch, useSelector } from 'react-redux';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { getIncomeUserThunk } from '../store/slices/incomeUser.slice';
// import { getIncomeBalanceUserThunk } from '../store/slices/incomeBalance.slice';

import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
// import ModalCreateRecluter from '../components/ModalCreateRecluter';
// import DetailRecluter from '../components/DetailRecluter';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaginationComponent from '../components/PaginationComponent';



const CategoryIncomes = ({ themeGlobal }) => {

    const dispatch = useDispatch();
    //   const jobAplication = useSelector((state) => state?.jobAplication);
    const categoryIncome = useSelector((state) => state.categoryIncome);
    const spentsUser = useSelector((state) => state.spentsUser);

 

    // const [incomeBalance, setIncomeBalance] = useState('')



    const id = localStorage.getItem("id")


    const [avatar, setAbatar] = useState('')

    // paginacion
    const itemsPerPage = 6; // Define la cantidad de elementos por página
    const [page, setPage] = useState(1);

    // Calcula el índice inicial y final de los elementos que se mostrarán en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = spentsUser?.spents?.slice(startIndex, endIndex);
    
    const handleChangePage = (event, value) => {
        setPage(value);
      };

    useEffect(() => {
        setAbatar(spentsUser.url_avatar)
        dispatch(getCategoryIncomeThunk())
        dispatch(getSpentsUserThunk(id));

    }, []);

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

    // const deletRecluter = (id) => {
    //     Swal.fire({
    //         title: '¿Deseas eliminar este dato?',
    //         showDenyButton: true,
    //         showCancelButton: false,
    //         confirmButtonText: 'Eliminar',
    //         denyButtonText: `No Eliminado`,
    //     }).then((result) => {
    //         /* Read more about isConfirmed, isDenied below */
    //         if (result.isConfirmed) {
    //             axios.delete(`http://localhost:8000/deliterecruiter/${id}`)
    //                 .then((res) => {
    //                     dispatch(getRecluitersThunk())
    //                     Swal.fire('Reclutador eliminada con exito')
    //                 })
    //                 .catch((error) => {
    //                     Swal.fire('Error al eliminar el Reclutador', error.response.data.message)
    //                     console.error(error)
    //                 });
    //             Swal.fire('!Eliminado!', '', 'correctamente')
    //         } else if (result.isDenied) {
    //             Swal.fire('Reclutador no eliminada', '', 'info')
    //         }
    //     })
    // }



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
                            Categoria de Ingresos
                        </Typography>

                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            {/* <ModalCreateRecluter themeGlobal={themeGlobal} /> */}
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {Array.isArray(categoryIncome) ? categoryIncome?.map((cateIcom) => (
                            <Grid item key={cateIcom?.id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    elevation={4}
                                >
                                    <CardMedia
                                        component="div"
                                    >
                                        <Typography textAlign="center" key={cateIcom?.id} gutterBottom variant="h5" component="h2">
                                            {cateIcom?.name}
                                        </Typography>
                                    </CardMedia>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography textAlign="center">
                                            Descripcion: {cateIcom?.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        {/* <DetailRecluter key={reclu?.id} company={reclu?.company} name={reclu?.name} /> */}
                                        <Button size="small">Editar</Button>
                                        {/* <Button onClick={() => deletRecluter(reclu?.id)} size="small">Eliminar</Button> */}
                                    </CardActions>
                                </Card>
                            </Grid>
                        )) : null}
                    </Grid>
                    <PaginationComponent
                        totalItems={spentsUser?.spents?.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={page}
                        onPageChange={handleChangePage}
                    />
                </Container>
            </main>
        </ThemeProvider>
    );
};

export default CategoryIncomes;