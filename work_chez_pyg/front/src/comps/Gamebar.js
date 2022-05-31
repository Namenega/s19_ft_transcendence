import LiveWatch from '../pages/LiveWatch'

export default function ButtonAppBar(props) {
    const { currentPage } = props;

    if (currentPage === "LiveWatch") {
        return (
            <LiveWatch />
        )
    }
}