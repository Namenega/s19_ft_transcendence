import LiveWatch from '../pages/LiveWatch'
import Start from '../pages/Start'
import CustomOptions from '../pages/CustomOptions'

export default function ButtonAppBar(props) {
    const { gamePage } = props;

    if (gamePage === "LiveWatch")
        return (<LiveWatch />)
    else if (gamePage === "Start")
        return (<Start />)
    else if (gamePage === "CustomOptions")
        return (<CustomOptions />) 
}