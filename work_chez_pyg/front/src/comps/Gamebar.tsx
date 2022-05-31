import LiveWatch from '../pages/game/LiveWatch'
import Start from '../pages/game/Start'
import CustomOptions from '../pages/game/CustomOptions'

export default function Gamebar(props: any) {
    const { gamePage } = props;

    if (gamePage === "LiveWatch")
        return (<LiveWatch />)
    else if (gamePage === "Start")
        return (<Start />)
    else
        return (<CustomOptions />)
}