import React from 'react';
import  Spline  from '@splinetool/react-spline';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import ButtonAppBar from './Components/ButtonAppBar';
import FullFeaturedCrudGrid from './Components/FullFeaturedCrudGrid';
import Clock from './Components/Clock';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <Spline className="background-spline" scene="https://prod.spline.design/DQNMG8eeMrq3scDp/scene.splinecode" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main className="App-content">
          <ButtonAppBar className="appBar"/>
          <Clock className="clockComponent"/>
          <div className= "callToAction "> What will you be doing today? </div>
          <FullFeaturedCrudGrid className="taskTable" />
        </main>
      </ThemeProvider>
    </div>
  );
}


export default App;