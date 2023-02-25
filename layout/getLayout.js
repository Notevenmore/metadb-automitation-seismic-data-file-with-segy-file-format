import Blank from "./Blank";
import LayoutIcon from "./LayoutIcon";
import LayoutWidget from './LayoutWidget'

function getLayoutBlank(page) {
    return(<Blank>{page}</Blank>)
}

function getLayoutIcon(page) {
    return(<LayoutIcon>{page}</LayoutIcon>)
}

function getLayoutWidget(page) {
    return(<LayoutWidget>{page}</LayoutWidget>)
}

export {getLayoutBlank, getLayoutIcon, getLayoutWidget}