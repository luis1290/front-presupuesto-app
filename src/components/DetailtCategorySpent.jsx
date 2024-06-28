import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';



const DetailCategorySpent = ({ name, description }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <div >
            <Button onClick={handleOpen}>Detalles</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box className="DetailModal" sx={{ bgcolor: 'background.paper' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={11} sm={11} md={11}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Categoria {name}
                            </Typography>
                        </Grid>
                        <Grid item xs={11} sm={11} md={11}>
                            <Typography id="modal-modal-description" >
                                Descripcion {description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default DetailCategorySpent;