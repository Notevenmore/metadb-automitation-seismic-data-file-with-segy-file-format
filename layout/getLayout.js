import Blank from './Blank';
import LayoutIcon from './LayoutIcon';
import LayoutWidget from './LayoutWidget';
import LayoutTop from './LayoutTop';

export function getLayoutBlank(page) {
  return <Blank>{page}</Blank>;
}

export function getLayoutIcon(page) {
  return <LayoutIcon>{page}</LayoutIcon>;
}

export function getLayoutWidget(page) {
  return <LayoutWidget>{page}</LayoutWidget>;
}

export function getLayoutTop(page) {
  return <LayoutTop>{page}</LayoutTop>;
}
