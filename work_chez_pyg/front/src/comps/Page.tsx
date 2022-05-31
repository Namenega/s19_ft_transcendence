import Game from '../pages/Game'
import Chat from '../pages/Chat'
import Profil from '../pages/Profil'

export default function ButtonAppBar(props: any) {
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