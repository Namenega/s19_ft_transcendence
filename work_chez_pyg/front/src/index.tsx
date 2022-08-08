import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { green, orange, yellow } from '@mui/material/colors';

const outerTheme = createTheme({
  palette: {
    primary: {
      main: green[400],
      dark: green[800]
    },
    secondary: {
      main: green[600]
    },
    error: {
      main: "#66bb6a",
      //writing: "#1f4e60"
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
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
