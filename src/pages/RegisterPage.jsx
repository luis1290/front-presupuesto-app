import { Box } from '@mui/material';
import React from 'react';
import RegisterUser from '../components/loguin/RegisterUser';
import axios from 'axios';
import { useNavigate } from 'react-router';

const RegisterPage = ({themeGlobal}) => {
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    const { email, name, password } = data
    axios.post('http://localhost:8000/users', { name, email, password })
      .then((res) => {
        console.log(res)
        navigate("/loguin")
      })
      .catch((error) => console.error(error));
  }

  const handleChage = (data) => {
    console.log(data)
  }


  return (
    <Box>
      <RegisterUser themeGlobal={themeGlobal} clickableText="Inicia seción" path="/loguin" onSubmit={handleSubmit} onChange={handleChage} />
    </Box>
  );
};

export default RegisterPage;