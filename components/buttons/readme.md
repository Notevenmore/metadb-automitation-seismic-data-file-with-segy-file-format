## Navigation

This directory is separated into sub-directories based on components and their functions. For easier navigation, below list can be used to navigate through these directories. 

- 📁 [component](./)
    - 📁 [buttons](./buttons/)
        - 📄[buttons.js](./buttons/buttons.js)
        - 📄[Readme.md](./buttons/readme.md)
    - 📁 [input_form](../input_form/)
        - 📄[input.js](../input_form/input.js)
        - 📄[Readme.md](../input_form/readme.md)
    - 📁 [table](../table/)
        - 📄[table.js](../table/table.js)
        - 📄[Readme.md](../table/readme.md)
    - 📄[Readme.md](./readme.md)

## Description

The button component consists of two types, the general button and the sidebar button. The general button consists of following properties:
- `path: <string> | required` <br>
Used to determine the path for other pages or any kind of URL links.

- `button_description: <string> | required` <br>
Used to describe the button. The string that's passed to this prop will be used to display the button's descriptive text and its metadata.

- `children: <any> | optional` <br>
The children prop, meaning that any children that's wrapped using this component will be displayed beside the descriptive text.

- `additional_styles: <string> | optional` <br>
Additional styles to be applied to the component. Can only use Tailwind CSS' syntaxes. 

## Usage
```js
import Buttons, { Buttons_Sidebar } from '../components/buttons/buttons'

const Index = () => {
  return (
    <div>
        <Buttons_Sidebar path='' button_description='General information'>
            <img src='https://www.example.com'/>
        </Buttons_Sidebar>
        <Buttons path='/' button_description='Choose file manually' />
    </div>
  )
}

export default Index
```

## Demo
*There will be a link to the Vercel website here later on to showcase this component*