import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useState } from "react";
import Gamebar from '../comps/Gamebar';

export default function Game() {

	const [gamePage, setGamePage] = useState("Start");

	/*const { setIsLoggedIn, setCurrentPage, currentPage } = props;*/

	const changePage = (page: string) => {
		setGamePage(page)
	}
	return (
		<div>
			<div className="game-banner-ctn">
				<Box sx={{ flexGrow: 1 }}>
					<Toolbar >
					<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
							<Button className="game-banner-live-watch-ctn" variant="contained" size="large" color={gamePage === "LiveWatch" ? "secondary" : "error" } sx={{marginRight: '10px'}} onClick={() => changePage("LiveWatch")}>
									Live watch
							</Button>
							<Button className="game-banner-live-watch-ctn" variant="contained" size="large" color={gamePage === "Start" ? "secondary" : "error" } sx={{marginRight: '10px'}} onClick={() => changePage("Start")}>
									Start
							</Button>
							<Button className="game-banner-live-watch-ctn" variant="contained" size="large" color={gamePage === "CustomOptions" ? "secondary" : "error" } onClick={() => changePage("CustomOptions")}>
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
