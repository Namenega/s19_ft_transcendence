import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login.tsx';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { green, orange } from '@mui/material/colors';

const outerTheme = createTheme({
  palette: {
    primary: {
      main: green[500],
      dark: green[800]
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={outerTheme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>    
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
