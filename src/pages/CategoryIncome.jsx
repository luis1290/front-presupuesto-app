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
import { useEffect, useState } from 'react';
import NapBar from '../components/NapBar';
import { useDispatch, useSelector } from 'react-redux';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
import ModalCreatCategoryIncome from '../components/ModalCreateCategoryIncome';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaginationComponent from '../components/PaginationComponent';
import DetailCategoryIncome from '../components/DetailtCategoryIncome';
import ModalEditCategoryIncome from '../components/ModalEditCategoryIncome';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';



const CategoryIncomes = ({ themeGlobal }) => {

    const dispatch = useDispatch();
    const categoryIncome = useSelector((state) => state.categoryIncome);
    const spentsUser = useSelector((state) => state.spentsUser);

    const id = localStorage.getItem("id")
    const names = localStorage.getItem("name")

    const [avatar, setAbatar] = useState('')

    // Estado para el modal de edición
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // paginacion
    const itemsPerPage = 6; // Define la cantidad de elementos por página
    const [page, setPage] = useState(1);

    // Filtra las categorías de ingreso según el término de búsqueda
    const filteredItems = Array.isArray(categoryIncome) ? categoryIncome.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Calcula el índice inicial y final de los elementos que se mostrarán en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex); // Usar filteredItems en lugar de categoryIncome

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        setAbatar(spentsUser.url_avatar)
        dispatch(getCategoryIncomeThunk())
        dispatch(getSpentsUserThunk(id));

    }, [dispatch, id, spentsUser.url_avatar]);

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
                axios.delete(`http://localhost:4500/delitecategoryincome/${id}`)
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

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedCategory(null);
        setEditModalOpen(false);
    };

    const handleSearch = () => {
        setSearchQuery(searchTerm);

    };

    return (
        <ThemeProvider theme={themeGlobal}>
            <CssBaseline />

            <NapBar nameUser={names} urlUser={avatar} />

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
                        {/* TextField y Button para la búsqueda */}
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
                                        <DetailCategoryIncome key={cateIcom?.id} name={cateIcom?.name} description={cateIcom?.description} />
                                        <Button onClick={() => openEditModal(cateIcom)} size="small">Editar</Button>
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

            <ModalEditCategoryIncome
                themeGlobal={themeGlobal}
                open={editModalOpen}
                handleClose={closeEditModal}
                category={selectedCategory}
            />
        </ThemeProvider>
    );
};

export default CategoryIncomes;