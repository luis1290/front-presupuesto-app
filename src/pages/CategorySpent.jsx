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
import { getCategorySpentThunk } from '../store/slices/categorySpent.slice';
import ModalCreatCategoryIncome from '../components/ModalCreateCategoryIncome';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaginationComponent from '../components/PaginationComponent';
import DetailCategoryIncome from '../components/DetailtCategoryIncome';
import ModalEditCategorySpent from '../components/ModalEditCategorySpent';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ModalCreatCategorySpent from '../components/ModalCreateCategorySpent';
import DetailCategorySpent from '../components/DetailtCategorySpent';



const CategorySpent = ({ themeGlobal }) => {

    const dispatch = useDispatch();
    const categorySpent = useSelector((state) => state.categorySpent);
    const spentsUser = useSelector((state) => state.spentsUser);

    const names = localStorage.getItem("name")
    const id = localStorage.getItem("id")
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
    const filteredItems = Array.isArray(categorySpent) ? categorySpent.filter((item) =>
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
        dispatch(getCategorySpentThunk())
        dispatch(getSpentsUserThunk(id));

    }, []);

    const deletCategorySpent = (id) => {
        Swal.fire({
            title: '¿Deseas eliminar este dato?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Eliminar',
            denyButtonText: `No Eliminado`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(`http://localhost:4500/delitecategoryspent/${id}`)
                    .then((res) => {
                        dispatch(getCategorySpentThunk())
                        Swal.fire('categoria gasto eliminada con exito')
                    })
                    .catch((error) => {
                        Swal.fire('Error al eliminar la categoria gasto', error.response.data.message)
                        console.error(error)
                    });
                Swal.fire('!Eliminado!', '', 'correctamente')
            } else if (result.isDenied) {
                Swal.fire('categoria gasto no eliminada', '', 'info')
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

    // Calcula totalItems después de que categorySpent esté disponible
    const totalItems = Array.isArray(categorySpent) ? categorySpent.length : 0;

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
                            Categoria de Gastos
                        </Typography>

                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <ModalCreatCategorySpent themeGlobal={themeGlobal} />
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
                        {Array.isArray(currentItems) ? currentItems?.map((cateSpe) => (
                            <Grid item key={cateSpe?.id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    elevation={4}
                                >
                                    <CardMedia
                                        component="div"
                                    >
                                        <Typography textAlign="center" key={cateSpe?.id} gutterBottom variant="h5" component="h2">
                                            {cateSpe?.name}
                                        </Typography>
                                    </CardMedia>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography textAlign="center">
                                            Descripcion: {cateSpe?.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <DetailCategorySpent key={cateSpe?.id} name={cateSpe?.name} description={cateSpe?.description} />
                                        <Button onClick={() => openEditModal(cateSpe)} size="small">Editar</Button>
                                        <Button onClick={() => deletCategorySpent(cateSpe?.id)} size="small">Eliminar</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )) : null}
                    </Grid>
                    <PaginationComponent
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={page}
                        onPageChange={handleChangePage}
                    />
                </Container>
            </main>

            <ModalEditCategorySpent
                themeGlobal={themeGlobal}
                open={editModalOpen}
                handleClose={closeEditModal}
                category={selectedCategory}
            />
        </ThemeProvider>
    );
};

export default CategorySpent;