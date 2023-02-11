import Blank from "./Blank";
import LayoutIcon from "./LayoutIcon";

function getLayoutBlank(page) {
    return(<Blank>{page}</Blank>)
}

function getLayoutIcon(page) {
    return(<LayoutIcon>{page}</LayoutIcon>)
}

export {getLayoutBlank, getLayoutIcon}