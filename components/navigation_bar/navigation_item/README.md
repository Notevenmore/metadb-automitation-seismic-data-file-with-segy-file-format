# Navigation Item
Props:
```
{
    icon: material design icon (mdi) from @mdi/js,
    name: string,
    link: path (not required if contain child),
    child: bool (default: false),
    collapse: bool (not required)
}
```

Example:
```
import Item from '../Item'
import {mdiIcon} from '@mdi/js'
...
<Item
    icon: mdiIcon,
    name: "Home",
    link: "/",
    collapse: true || false,
></Item>
or
<Item
    icon: mdiIcon,
    name: "Home",
    child: true,
></Item>
```