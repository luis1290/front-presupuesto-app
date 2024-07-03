import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { getCategorySpentThunk } from '../store/slices/categorySpent.slice';
import Swal from 'sweetalert2';
import getConfig from '../helpers/getConfig';

const ModalEditSpent = ({ themeGlobal, open, handleClose, spent, updateArraySpents }) => {
  const dispatch = useDispatch();


  const id = localStorage.getItem("id")
  const categorySpent = useSelector((state) => state.categorySpent);

  const [formValues, setFormValues] = useState({
    name: '',
    category_id: '',
    amount: '',
    description: '',
    user_id: parseInt(id)
  });


  useEffect(() => {
    console.log(spent)
    if (spent) {
      setFormValues({
        user_id: parseInt(id),
        name: spent.name,
        category_id: spent.category_id,
        amount: spent.amount,
        description: spent.description
      });
      dispatch(getCategorySpentThunk());
    }
  }, [dispatch, spent, id]);

  const handleSubmit = () => {

    axios.put(`http://localhost:8000/editspent/${spent.id}`, formValues, getConfig())
      .then((res) => {
        dispatch(getSpentsUserThunk(id));
        updateArraySpents(res.data);
        Swal.fire('Gasto editada con exito')
        handleClose();
      })
      .catch((error) => {
        console.error('Error updating category spent:', error);
        Swal.fire('Error al editar  Gasto')
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
              Editar  Gasto
            </Typography>
            <TextField
              label="Nombre"
              fullWidth
              name="name"
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
            <InputLabel id="demo-simple-select-label">Categoria Gasto</InputLabel>
            <Select
              labelId="categoryincome"
              id="category_id"
              name="category_id"
              value={formValues.category_id}
              label="Age"
              onChange={handleChange}
              sx={{ mt: 3, mb: 2, minWidth: 200 }}
            >
              {Array.isArray(categorySpent) ? categorySpent?.map((cateSpe) => (
                <MenuItem id="selectCategorySpent" key={cateSpe?.id} value={cateSpe?.id}>{cateSpe?.name}</MenuItem>
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

export default ModalEditSpent;