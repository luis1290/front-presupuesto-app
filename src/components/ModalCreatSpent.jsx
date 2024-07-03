import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import CreateSpent from './CreateSpent';
import { getSpentsUserThunk } from '../store/slices/spentsUser.slice';
import { useDispatch, useSelector } from 'react-redux';

const ModalCreatSpent = ({ themeGlobal, updateArraySpents }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  return (
    <div className='modalCreateSpent'>
      <Button onClick={handleOpen} variant="contained">Agregar Gasto</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modalCreate' sx={{ bgcolor: 'background.paper' }}  >
          <CreateSpent themeGlobal={themeGlobal} setOpen={setOpen} updateArraySpents={updateArraySpents} />
          <Button onClick={handleClose}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            cerrar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCreatSpent;