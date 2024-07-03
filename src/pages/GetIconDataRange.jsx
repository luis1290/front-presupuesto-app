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
import { getIconDataRangeThunk } from '../store/slices/getIncomeDataRange.slice';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaginationComponent from '../components/PaginationComponent';
import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import getConfig from '../helpers/getConfig';


const GetIconDataRange = ({ themeGlobal }) => {
  const dispatch = useDispatch();


  const spentsUser = useSelector((state) => state.spentsUser);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const id = localStorage.getItem("id")
  const [avatar, setAbatar] = useState('')

  const itemsPerPage = 6;

  const [currentItems, setCurrentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);


  const [searchQuery, setSearchQuery] = useState('');

  const handleChangePage = (event, value) => {
    setPage(value);
  };


  const [formValues, setFormValues] = useState({
    endDate: '',
    startDate: ''

  });

  useEffect(() => {
    dispatch(getSpentsUserThunk(id));
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedItems = filteredItems.slice(startIndex, endIndex);
    setCurrentItems(slicedItems);

  }, [id, dispatch, filteredItems, page]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSearch = () => {
    // Aquí deberías llamar a la API con las fechas seleccionadas
    axios.post(`http://localhost:8000/getincomdatarange/${id}`, formValues, getConfig())
      .then((response) => {
        console.log(response.data); // Verificar la estructura de response.data

        // Verificar si response.data es un arreglo antes de filtrar
        if (Array.isArray(response.data.rangeDateIncome)) {
          const filteredItems = response.data.rangeDateIncome.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setFilteredItems(filteredItems);


        } else {
          // Manejar caso donde response.data no es un arreglo
          console.error('La respuesta de la API no es un arreglo válido:', response.data);
          setCurrentItems([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setCurrentItems([]);
      });
  };


  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCategory(null);
    setEditModalOpen(false);
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

  return (
    <ThemeProvider theme={themeGlobal}>
      <CssBaseline />

      <NapBar nameUser={spentsUser.name} urlUser={avatar} />

      <main>
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
              Rango de Fecha Ingreso
            </Typography>


            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={10} md={6}  >
                <TextField
                  variant="outlined"
                  type="date"
                  label="Fecha de inicio"
                  name="startDate"
                  value={formValues.startDate}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={10} md={6}  >
                <TextField
                  variant="outlined"
                  type="date"
                  label="Fecha de fin"
                  name="endDate"
                  value={formValues.endDate}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={10} md={6} >
                <Button onClick={handleSearch} variant="contained" color="primary">
                  <SearchIcon />
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Monto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(currentItems) && currentItems.map((ico) => (
                  <TableRow key={ico?.id}>
                    <TableCell>{ico?.name}</TableCell>
                    {/* <TableCell>{ico?.categoryIncome?.name}</TableCell> */}
                    <TableCell>{ico?.description}</TableCell>
                    <TableCell>{formatCurrency(ico?.amount)}</TableCell>
                    <TableCell>{converDate(ico?.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationComponent
            totalItems={filteredItems?.length}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
          />
        </Container>
      </main>
    </ThemeProvider>
  );
};

export default GetIconDataRange;