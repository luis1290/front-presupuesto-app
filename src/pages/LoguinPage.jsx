import { Box } from '@mui/material';
import React from 'react';
import LoguinForm from '../components/loguin/SignInSide';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { ThemeProvider } from '@emotion/react';

const LoguinPage = ({ themeGlobal }) => {

  const navigate = useNavigate()

  const handleSubmit = (data) => {
    axios.post('http://localhost:8000/users/login', data)
      .then((res) => {
        console.log(res)
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("id", res.data.id)
        navigate("/")
      })
      .catch((error) => console.error(error));
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