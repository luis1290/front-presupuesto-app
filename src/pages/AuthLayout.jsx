import { Box, Typography } from '@mui/material';
import React from 'react';
import NapBar from '../components/NapBar';

const AuthLayout = ({ Children, message }) => {
  return (
    <Box    >

      <NapBar nameUser={jobAplication.name} urlUser={avatar} />

    </Box>
  );
};

export default AuthLayout;