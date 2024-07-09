import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Paper, Typography, IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = ({ themeGlobal, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    setEmailError(!email);
    return email;
  }

  const handleClick = (route) => {
    // Navegar a otra ruta
    navigate(route);
  };

  useEffect(() => {
    if (emailError && email) {
      setEmailError(false);
    }
  }, [email]);

  const handleChangePage = (event, value) => {
    navigate('/login');
  };

  const handleSubmit = () => {
    if (validateInput()) {
      // onSubmit({ email });
      axios.post('http://localhost:4500/emailreset', { email })
        .then((res) => {
          Swal.fire('email enviado para restablecer contraseña')

        })
        .catch((error) => {
          console.error(error)
          // Obtener el mensaje de error específico
          let errorMessage = 'Ocurrió un error inesperado';

          if (error.response) {
            // El servidor respondió con un estado diferente de 2xx
            if (Array.isArray(error.response.data.message)) {
              errorMessage = error.response.data.message.join('\n');
            } else {
              errorMessage = error.response.data.message || errorMessage;
            }
          } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            errorMessage = 'No se recibió respuesta del servidor';
          } else {
            // Algo pasó al configurar la petición que desencadenó un error
            errorMessage = error.message;
          }

          // Mostrar el error en el modal de SweetAlert
          Swal.fire('Error al enviar el email', errorMessage);
        }

        );
      console.log({ email });
    }
  };

  return (
    <ThemeProvider theme={themeGlobal}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(/${themeGlobal.palette.mode === 'dark' ? 'dark_theme.jpg' : 'litgth_theme.jpg'})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Restablecer Contraseña
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => { setEmail(e.target.value) }}
                error={emailError}
                helperText={emailError ? "El email es obligatorio" : ""}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Enviar
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleClick('/loguin')}
              >
                Regresar
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ResetPassword;
