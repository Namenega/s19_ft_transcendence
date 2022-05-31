import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';

export default function ButtonAppBar(props: any) {

  const { setIsLoggedIn, setCurrentPage, currentPage } = props;

  const isLogout = () => {
    window.location.href = 'http://localhost:3000'
    setIsLoggedIn(false)
  }

  const changePage = (page: string) => {
    setCurrentPage(page)
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar >
          <Typography variant="h6" component="div">
            Transcendence - Pong Game
          </Typography>
          <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            <Button variant="contained" color={currentPage === "chat" ? "secondary" : "primary" } sx={{marginRight: '10px'}} onClick={() => changePage("chat")}>CHAT</Button>
            <Button variant="contained" color={currentPage === "game" ? "secondary" : "primary" } sx={{marginRight: '10px'}} onClick={() => changePage("game")}>GAME</Button>
            <Button variant="contained" color={currentPage === "profil" ? "secondary" : "primary" } onClick={() => changePage("profil")}>PROFILE</Button>
          </Box>
          <Button color="inherit" onClick={() => isLogout()}>Logout</Button>
          <Avatar alt="Remy Sharp" src="url('')" />
          {/* Avatar 19 a chercher sur l'api */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
