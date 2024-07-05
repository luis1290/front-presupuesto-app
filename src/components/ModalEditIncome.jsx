import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getIncomeUserThunk } from '../store/slices/incomeUser.slice';
import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
import Swal from 'sweetalert2';
import getConfig from '../helpers/getConfig';

const ModalEditIncome = ({ themeGlobal, open, handleClose, income }) => {
  const dispatch = useDispatch();


  const id = localStorage.getItem("id")
  const categoryIncome = useSelector((state) => state.categoryIncome);

  const [formValues, setFormValues] = useState({
    category_id: '',
    amount: '',
    description: '',
    user_id: parseInt(id),
    name: ''
  });


  useEffect(() => {
    if (income) {
      setFormValues({
        user_id: parseInt(id),
        category_id: income.category_id,
        amount: income.amount,
        description: income.description,
        name: income.name
      });
      dispatch(getCategoryIncomeThunk());
    }
  }, [dispatch, income, id]);

  const handleSubmit = () => {
    console.log(income.id)
    axios.put(`http://localhost:4500/editincome/${income.id}`, formValues, getConfig())
      .then((res) => {
        dispatch(getIncomeUserThunk(id));
        Swal.fire('Ingreso editada con exito')
        handleClose();
      })
      .catch((error) => {
        console.error('Error updating category income:', error);
        Swal.fire('Error al editar  ingreso')
      });
  };



  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'amount') {
      if (/^\d*$/.test(value)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  return (
    <ThemeProvider theme={themeGlobal}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modalCreate' sx={{ p: 4, bgcolor: 'background.paper', margin: 'auto', width: '50%' }}>
          <form sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Editar  Ingreso
            </Typography>
            <TextField
              label="Nombre"
              name="name"
              fullWidth
              value={formValues.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="monto"
              fullWidth
              name="amount"
              value={formValues.amount}
              onChange={handleChange}
              margin="normal"

            />
            <TextField
              label="Descripción"
              name="description"
              fullWidth
              value={formValues.description}
              onChange={handleChange}
              margin="normal"
              rows={4}
              multiline
            />
            <InputLabel id="demo-simple-select-label">Categoria Ingreso</InputLabel>
            <Select
              labelId="categoryincome"
              id="category_id"
              name="category_id"
              value={formValues.category_id}
              label="Age"
              onChange={handleChange}
              sx={{ mt: 3, mb: 2, minWidth: 200 }}
            >
              {Array.isArray(categoryIncome) ? categoryIncome?.map((cateIncome) => (
                <MenuItem id="selectCategoryIncome" key={cateIncome?.id} value={cateIncome?.id}>{cateIncome?.name}</MenuItem>
              )) : null}
            </Select>
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              Guardar
            </Button>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ModalEditIncome;