## Navigation

This directory is separated into sub-directories based on components and their functions. For easier navigation, below list can be used to navigate through these directories. 

- 📁 [component](../)
    - 📁 [buttons](../buttons/)
        - 📄[buttons.js](../buttons/buttons.js)
        - 📄[Readme.md](../buttons/readme.md)
    - 📁 [input_form](../input_form/)
        - 📄[input.js](../input_form/input.js)
        - 📄[Readme.md](../input_form/readme.md)
    - 📁 [table](./)
        - 📄[table.js](./table.js)
        - 📄[Readme.md](./readme.md)
    - 📄[Readme.md](../readme.md)

## Description

The button component consists of two types, the general button and the sidebar button. The general button consists of following properties:
- `header: <array> | required` <br>
The table headers. 
- `content: <array of objects> | required` <br>
The table rows. **The rows' object sizes must be the same with the header array size and must contain keys that match the corresponding header names**.
- `additional_styles: <string> | optional` <br>
Additional styles to be applied to the table.

## Usage
```js
import Buttons, { Buttons_Sidebar } from '../components/buttons/buttons'

const Index = () => {
    const tableData = {
    header: ["id", "email", "first_name", "last_name", "avatar"],
    content: [
      {
        "id": 1,
        "email": "george.bluth@reqres.in",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://reqres.in/img/faces/1-image.jpg"
      },
      {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
      }
    ]
  }
  return (
    <div>
        <TableComponent header={tableData.header} content={tableData.content} />
    </div>
  )
}

export default Index
```

## Demo
*There will be a link to the Vercel website here later on to showcase this component*