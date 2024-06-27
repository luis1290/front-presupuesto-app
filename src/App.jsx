import { useMemo, useState } from 'react'
// import logo from './logo.svg';
import './App.css';
// import RegisterUser from './components/loguin/RegisterUser'
import { Box, IconButton, Toolbar, Typography, createTheme } from '@mui/material'
import LoguinForm from './components/loguin/SignInSide'
import LoguinPage from './pages/LoguinPage'

import RegisterPage from './pages/RegisterPage'
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProtectedRoutes from './components/ProtectedRoutes'

import Loader from './components/Loader'
import { useSelector } from 'react-redux'
import Index from './pages/Index'
import Incomes from './pages/Incomes'


import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CategoryIncomes from './pages/CategoryIncome';




function App() {

  const [count, setCount] = useState(0)
  const isLoading = useSelector(state => state.isLoading)

  const [mode, setMode] = useState('light');

  //modo oscuro
  // const theme = useTheme();
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {

        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        console.log(mode)
      },
    }),
    [],
  );

  const themeGlobal = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <>
      <HashRouter>
        {
          isLoading && <Loader />
        }
        <Toolbar>
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {themeGlobal.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Typography>Modo {mode}</Typography>
        </Toolbar>

        <Routes>
          <Route path='/loguin' element={<LoguinPage themeGlobal={themeGlobal} />} />
          <Route path='/register' element={<RegisterPage themeGlobal={themeGlobal} />} />

          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<Home themeGlobal={themeGlobal} />} />
            <Route path='/incomes' element={<Incomes themeGlobal={themeGlobal} />} />
            <Route path='/categoryincome' element={<CategoryIncomes themeGlobal={themeGlobal} />} />
            {/* <Route path='/companies' element={<Companies themeGlobal={themeGlobal} />} /> */}
          </Route>
        </Routes>
      </HashRouter>
    </>
  )

}

export default App;
