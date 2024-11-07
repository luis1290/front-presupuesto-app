
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import { getSpentsTotalThunk } from '../store/slices/totalSpent.slice';
import axios from 'axios';
import Swal from 'sweetalert2';
import getConfig from '../helpers/getConfig';
import { useNavigate } from 'react-router';
import ModalCreatSpent from '../components/ModalCreatSpent';
import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import PaginationComponent from '../components/PaginationComponent';
import SearchIcon from '@mui/icons-material/Search';

// Importa Chart.js
import Chart from 'chart.js/auto';
import ModalEditSpent from '../components/ModalEditSpent';



const Home = ({ themeGlobal }) => {
  const dispatch = useDispatch();
  const spentsUser = useSelector((state) => state.spentsUser);
  const totalSpents = useSelector((state) => state.totalSpents);
  const [open, setOpen] = useState(false);

  // Estado para el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSpent, setSelectedSpent] = useState(null);


  const id = localStorage.getItem("id")
  const names = localStorage.getItem("name")
  const [avatar, setAbatar] = useState('')
  const [name, setName] = useState('')
  const [totalSpent, setTotalSpent] = useState('')

  const [arraySpents, setArraySpents] = useState([]);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  //paginacion
  const itemsPerPage = 6; // Define la cantidad de elementos por página
  const [page, setPage] = useState(1);

  // Filtra las categorías de ingreso según el término de búsqueda
  const filteredItems = Array.isArray(arraySpents) ? arraySpents.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calcula el índice inicial y final de los elementos que se mostrarán en la página actual
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const navigate = useNavigate()


  const handleOpen = () => {
    setOpen(!open);
  };


  // Referencia para el gráfico
  const chartRef = useRef(null);


  useEffect(() => {
    dispatch(getSpentsUserThunk(id));
    dispatch(getSpentsTotalThunk(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (spentsUser) {
      setArraySpents(spentsUser.spents);
      setAbatar(spentsUser.url_avatar);
      setName(spentsUser.name);
    }
    generateChart();
  }, [spentsUser]);

 

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  // Función para generar el gráfico de ingresos por categoría
  const generateChart = () => {
    const ctx = document.getElementById('incomeChart');
    if (ctx) {
      // Destruir el gráfico anterior si existe
      if (chartRef.current) {
        chartRef.current.destroy();
      }


      if (spentsUser && Array.isArray(spentsUser.spents)) {
        const categories = {};
        spentsUser?.spents.forEach(spent => {
          const category = spent?.categoryspent?.name;
          if (categories[category]) {
            categories[category] += spent?.amount;
          } else {
            categories[category] = spent?.amount;
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
        console.error("No se encontraron datos válidos para generar el gráfico.");
      }
    }
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

  function formatCurrency(amount) {
    if (amount === undefined || amount === null) {
      amount = 0;
    }

    return amount.toLocaleString('es-CR', {
      style: 'currency',
      currency: 'CRC',
    });
  }

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const deletIcome = (idSpent) => {
    Swal.fire({
      title: '¿Deseas eliminar este dato?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Eliminar',
      denyButtonText: `No Eliminado`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4500/delitespent/${idSpent}`, getConfig())
          .then((res) => {
            dispatch(getSpentsUserThunk(id));
            dispatch(getSpentsTotalThunk(id));
            setArraySpents(spentsUser?.spents)
            Swal.fire('Gasto eliminada con exito')
          })
          .catch((error) => {
            Swal.fire('Error al eliminar el Gasto', error.response.data.message)
            console.error(error)
          });
        Swal.fire('!Eliminado!', '', 'correctamente')
      } else if (result.isDenied) {
        Swal.fire('Gasto no eliminada', '', 'info')
      }
    })
  }

  const openEditModal = (spe) => {

    setSelectedSpent(spe);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedSpent(null);
    setEditModalOpen(false);
  };

  const updateArraySpents = (updatedSpent) => {
    const updatedArray = arraySpents.map(item =>
      item.id === updatedSpent.id ? updatedSpent : item
    );
    setArraySpents(updatedArray);
  };

  const getSpent = () => {
    setArraySpents(spentsUser.spents);
  };


  return (
    <ThemeProvider theme={themeGlobal}>
      <CssBaseline />

      <NapBar nameUser={names} urlUser={avatar} themeGlobal={themeGlobal} />

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
              Total Gastos: {formatCurrency(totalSpents.totalSpent)}
            </Typography>

            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {<Box xs={12} sm={6} md={4}>
                <Grid>
                  <ModalCreatSpent themeGlobal={themeGlobal} updateArraySpents={getSpent} />
                </Grid>
              </Box>}
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="spents table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }} align="center">Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }} align="center">Monto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }} align="center">Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }} align="center">Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }} align="center">Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'GrayText' }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(currentItems) && currentItems.map((spe) => (
                  <TableRow key={spe?.id}>
                    <TableCell component="th" scope="row" align="center">
                      {spe?.name}
                    </TableCell>
                    <TableCell align="center">{formatCurrency(spe.amount)}</TableCell>
                    <TableCell align="center">Descripcion: {spe.description}</TableCell>
                    <TableCell align="center"> {spe?.categoryspent?.name}</TableCell>
                    <TableCell align="center">{converDate(spe?.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => openEditModal(spe)} size="small">Editar</Button>
                      <Button onClick={() => deletIcome(spe?.id)} size="small">Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationComponent
            totalItems={Array.isArray(arraySpents) ? arraySpents.length : 0}
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
                  Distribución de gasto por categoría
                </Typography>
                <canvas id="incomeChart" width="400" height="200"></canvas>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">

        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      <ModalEditSpent
        themeGlobal={themeGlobal}
        open={editModalOpen}
        handleClose={closeEditModal}
        spent={selectedSpent}
        updateArraySpents={updateArraySpents}
      />
      {/* End footer */}
    </ThemeProvider>
  );
};

export default Home;