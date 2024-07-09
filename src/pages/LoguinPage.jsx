import { Box } from '@mui/material';
import React from 'react';
import LoguinForm from '../components/loguin/SignInSide';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { ThemeProvider } from '@emotion/react';
import Swal from 'sweetalert2';

const LoguinPage = ({ themeGlobal }) => {

  const navigate = useNavigate()

  const handleSubmit = (data) => {
    axios.post('http://localhost:4500/users/login', data)
      .then((res) => {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("id", res.data.id)
        localStorage.setItem("name", res.data.name)
        navigate("/")
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error email o contraseñas incorrectas');
      });
  }

  const handleChage = (data) => {
    console.log(data)
  }
  return (
    <ThemeProvider theme={themeGlobal}>
      <Box >
        <LoguinForm themeGlobal={themeGlobal} clickableText="Registrate" path="/register" onSubmit={handleSubmit} onChange={handleChage} />
      </Box>
    </ThemeProvider>
  );
};

export default LoguinPage;