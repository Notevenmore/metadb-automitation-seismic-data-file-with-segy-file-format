import Blank from './Blank';
import LayoutIcon from './LayoutIcon';
import LayoutWidget from './LayoutWidget';
import LayoutTop from './LayoutTop';

function getLayoutBlank(page) {
  return <Blank>{page}</Blank>;
}

function getLayoutIcon(page) {
  return <LayoutIcon>{page}</LayoutIcon>;
}

function getLayoutWidget(page) {
  return <LayoutWidget>{page}</LayoutWidget>;
}

function getLayoutTop(page) {
  return <LayoutTop>{page}</LayoutTop>;
}

export {getLayoutBlank, getLayoutIcon, getLayoutWidget, getLayoutTop};
