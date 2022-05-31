import Game from '../pages/Game'
import Chat from '../pages/Chat'
import Profil from '../pages/Profil'
import LiveWatch from '../pages/LiveWatch'

export default function ButtonAppBar(props) {
    const { currentPage } = props;

    if (currentPage === "game") {
        return (
            <Game />
        )
    }
    else if (currentPage === 'chat') {
        return (
            <Chat />
        )
    }
    else {
        return (
            <Profil />
        )
    }
}