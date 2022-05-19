import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar >
          <Typography variant="h6" component="div">
            Transadance
          </Typography>
          <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            <Button variant="contained" color='primary' sx={{marginRight: '10px'}}>CHAT</Button>
            <Button variant="contained" color='secondary' sx={{marginRight: '10px'}}>GAME</Button>
            <Button variant="contained" color='secondary'>PROFIL</Button>
          </Box>

          <Button color="inherit">Login</Button>
          <Avatar alt="Remy Sharp" src="url('')" />
          {/* Avatar 19 a chercher sur l'api */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
