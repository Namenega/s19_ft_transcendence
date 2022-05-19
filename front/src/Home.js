import { useState } from "react";
import ButtonAppBar from "./comps/Header"
import Page from "./comps/Page"

const Home = (props) => {

    const { setIsLoggedIn } = props;

    const [currentPage, setCurrentPage] = useState("game");

    return (
        <div className="home-main-ctn">
            <ButtonAppBar setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} currentPage={currentPage}/>           
            <div className="home-ctn">
                <Page currentPage={currentPage}/>
            </div>
        </div>
    )
}

export default Home