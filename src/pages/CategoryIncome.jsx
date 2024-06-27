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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import NapBar from '../components/NapBar';
import { useDispatch, useSelector } from 'react-redux';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
import ModalCreatCategoryIncome from '../components/ModalCreateCategoryIncome';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaginationComponent from '../components/PaginationComponent';



const CategoryIncomes = ({ themeGlobal }) => {

    const dispatch = useDispatch();
    const categoryIncome = useSelector((state) => state.categoryIncome);
    const spentsUser = useSelector((state) => state.spentsUser);
    const id = localStorage.getItem("id")
    const [avatar, setAbatar] = useState('')

    // paginacion
    const itemsPerPage = 6; // Define la cantidad de elementos por página
    const [page, setPage] = useState(1);

    // Calcula el índice inicial y final de los elementos que se mostrarán en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = Array.isArray(categoryIncome) ? categoryIncome.slice(startIndex, endIndex) : [];

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        setAbatar(spentsUser.url_avatar)
        dispatch(getCategoryIncomeThunk())
        dispatch(getSpentsUserThunk(id));

    }, []);

    const deletCategoryIncome = (id) => {
        Swal.fire({
            title: '¿Deseas eliminar este dato?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Eliminar',
            denyButtonText: `No Eliminado`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/delitecategoryincome/${id}`)
                    .then((res) => {
                        dispatch(getCategoryIncomeThunk())
                        Swal.fire('categoria ingreso eliminada con exito')
                    })
                    .catch((error) => {
                        Swal.fire('Error al eliminar la categoria ingreso', error.response.data.message)
                        console.error(error)
                    });
                Swal.fire('!Eliminado!', '', 'correctamente')
            } else if (result.isDenied) {
                Swal.fire('categoria ingreso no eliminada', '', 'info')
            }
        })
    }

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
                            <ModalCreatCategoryIncome themeGlobal={themeGlobal} />
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {Array.isArray(currentItems) ? currentItems?.map((cateIcom) => (
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
                                        <Button onClick={() => deletCategoryIncome(cateIcom?.id)} size="small">Eliminar</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )) : null}
                    </Grid>
                    <PaginationComponent
                        totalItems={categoryIncome?.length}
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