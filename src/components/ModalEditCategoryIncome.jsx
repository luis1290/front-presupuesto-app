import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getCategoryIncomeThunk } from '../store/slices/categoryIncome.slice';
import Swal from 'sweetalert2';

const ModalEditCategoryIncome = ({ themeGlobal, open, handleClose, category }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
        }
    }, [category]);

    const handleSave = () => {
        axios.put(`http://localhost:4500/editcategoryincome/${category.id}`, { name, description })
            .then((res) => {
                dispatch(getCategoryIncomeThunk());
                Swal.fire('Categoria Ingreso editada con exito')
                handleClose();
            })
            .catch((error) => {
                console.error('Error updating category income:', error);
                Swal.fire('Error al editar categoria ingreso')
            });
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
                    <Typography variant="h6" gutterBottom>
                        Editar Categoría de Ingreso
                    </Typography>
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSave}
                    >
                        Guardar
                    </Button>
                </Box>
            </Modal>
        </ThemeProvider>
    );
};

export default ModalEditCategoryIncome;
