# Navigation Bar

- [Side Bar](#side-bar)
- [Top Bar](#top-bar)
- [Navigation Item](./navigation_item/)

## Side Bar

This vertical navigaiton bar will have it's data provided from [here](../../router/List.js) where it provides the data for:

- icon used
- name
- path
- children navigation (not yet developed)
  To add more into the vertical navigation menu, add/sort/modify the data in the link above.
  Props:

```
{
    collapse: bool (not required),
    half: bool (not required)
}
```

collapse props is for collapsing the navigation name, leaving only icons behind.
Example:

```
import SideBar from '../SideBar'
...
<SideBar
    collapse={false}
    half={true}
></SideBar>
```

## Top Bar

This top bar will be used to display the title, notification, and user profile. The button to toggle open and closing the vertical navigation menu (side bar) is in this component while the control will be in the [layout component](../../layout/)

Props:

```
handleClick: toggle function (not required)
```

Example:

```
import Topbar from '../TopBar'
...
<TopBar handleClick={toggleNavBar}></TopBar>
```
