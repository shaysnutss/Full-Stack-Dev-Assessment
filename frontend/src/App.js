import React from 'react';
import logo from './logo.svg';
import './App.css';

// Importing Custom Components
import ButtonAppBar from './Components/ButtonAppBar';
import FullFeaturedCrudGrid from './Components/FullFeaturedCrudGrid';

// Importing Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Declare Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (

    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <ButtonAppBar/>
        <FullFeaturedCrudGrid/>
      </main>
    </ThemeProvider>
  
  );
}
export default App;