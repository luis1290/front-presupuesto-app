import { Box } from '@mui/material';
import React from 'react';
import RegisterUser from '../components/loguin/RegisterUser';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const RegisterPage = ({ themeGlobal }) => {
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    const { email, name, password } = data
    axios.post('http://localhost:4500/users', { name, email, password })
      .then((res) => {
        console.log(res)
        navigate("/loguin")
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
        Swal.fire('Error al crear usuarios', errorMessage);
      }

      );
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