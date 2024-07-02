import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Card, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Navigate, useNavigate } from 'react-router';

const LoguinForm = ({ clickableText, path, onSubmit, onChange, themeGlobal }) => {

  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [formData, setFormData] = useState({ email, password })
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const navigate = useNavigate()

  const handleClick = (route) => {
    // Navegar a otra ruta
    console.log(route)
    navigate(route);
  };


  useEffect(() => {
    if (emailError && email) {
      setEmailError(false)
    }
    if (passwordError && password) {
      setPasswordError(false)
    }
    setFormData({ email, password })
  }, [email, password])

  const validateImput = () => {
    setEmailError(!formData.email)
    setPasswordError(!formData.password)
    return formData.email && formData.password
  }

  // TODO remove, this demo shouldn't need to reset the theme. condición ? expresiónSiEsVerdadera : expresiónSiEsFalsa;

  const defaultTheme = createTheme();

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
              Iniciar sesión
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => { setEmail(e.target.value) }}
                error={emailError}
                helperText={emailError ? "El email es obligatoria" : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value) }}
                error={passwordError}
                helperText={passwordError ? "El password es obligatoria" : ""}
                InputProps={
                  {
                    endAdornment: <IconButton onClick={() => { setShowPassword(!showPassword) }}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  }
                }
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  if (validateImput()) {
                    onSubmit(formData)
                  }
                }}
              >
                Loguin
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button color="inherit" underline="none">
                    contraseña perdida?
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleClick('/register')} color="inherit" underline="none">
                    {clickableText}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoguinForm;