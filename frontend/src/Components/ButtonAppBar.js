import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Ensure to use the correct font
  },
  palette: {
    mode: 'dark',
  },
});


export default function ButtonAppBar() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar position="static" sx={{ height: '0%' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <FormatListNumberedRtlIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 0, color: 'white' }}>
              To-do Application
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}