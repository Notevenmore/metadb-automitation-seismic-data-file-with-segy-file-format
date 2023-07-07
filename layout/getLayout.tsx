import LayoutBlank from './LayoutBlank';
import LayoutIcon from './LayoutIcon';
import LayoutTop from './LayoutTop';

export function getLayoutBlank(page) {
  return <LayoutBlank>{page}</LayoutBlank>;
}

export function getLayoutIcon(page) {
  return <LayoutIcon>{page}</LayoutIcon>;
}

export function getLayoutTop(page) {
  return <LayoutTop>{page}</LayoutTop>;
}
