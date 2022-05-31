import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { useState } from "react";
import Gamebar from '../comps/Gamebar'

const Game = (props) => {

    // return (
    //     <div className="game-main-ctn">
    //     	<div className="game-banner-ctn">
    //     		<div className="game-banner-live-watch-ctn">
	//     			<div className="game-button-text">Live watch</div>
	//     		</div>
	// 		<div className="game-banner-start-ctn">
	//     			<div className="game-button-text">Start</div>
	//     		</div>
    //     		<div className="game-banner-custom-option-ctn">
	//     			<div className="game-button-text">Custom options</div>
	//     		</div>
    //     	</div>
    //     	<div className="game-game-frame-ctn">
	// 	</div>
    //     </div>
    // )
	const [gamePage, setGamePage] = useState("LiveWatch");

	/*const { setIsLoggedIn, setCurrentPage, currentPage } = props;*/

	const changePage = (page) => {
		setGamePage(page)
	  }
	return (
		<div>
			<div className="game-banner-ctn">
				<Box sx={{ flexGrow: 1 }}>
					<Toolbar >
					<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
							<Button className="game-banner-live-watch-ctn" variant="contained" size="large" color={gamePage === "LiveWatch" ? "secondary" : "game_color" } sx={{marginRight: '10px'}} onClick={() => changePage("LiveWatch")}>
									Live watch
							</Button>
							<Button className="game-banner-live-watch-ctn" variant="contained" size="large" color={gamePage === "start" ? "secondary" : "game_color" } sx={{marginRight: '10px'}} onClick={() => changePage("start")}>
									Start
							</Button>
							<Button className="game-banner-live-watch-ctn" variant="contained" size="large" color={gamePage === "custom_options" ? "secondary" : "game_color" } onClick={() => changePage("custom_options")}>
									Custom options
							</Button>
					</Box>
					</Toolbar>
				</Box>
			</div>
			<div>
				<Gamebar gamePage={gamePage}/>
			</div>
		</div>
	  );
}

export default Game
