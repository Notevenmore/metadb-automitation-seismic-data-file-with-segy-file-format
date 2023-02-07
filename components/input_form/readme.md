## Navigation

This directory is separated into sub-directories based on components and their functions. For easier navigation, below list can be used to navigate through these directories. 

- 📁 [component](./components/)
    - 📁 [buttons](../buttons/)
        - 📄[buttons.js](../buttons/buttons.js)
        - 📄[Readme.md](../buttons/readme.md)
    - 📁 input_form
        - 📄[input.js](./input.js)
        - 📄[Readme.md](./readme.md)
    - 📁 [table](../table/)
        - 📄[table.js](../table/table.js)
        - 📄[Readme.md](../table/readme.md)
    - 📄[Readme.md](../readme.md)

    ## Description

The button component consists of two types, the general button and the sidebar button. The general button consists of following properties:
- `label: <string> | optional` <br>
Label of input.
- `label_loc: [above|beside] | required if label is defined`<br>
Location of the label of input, can either be `above` or `beside`.
- `type: [email|password|text|dropdown] | required`<br>
Type of input.
- `dropdown_items: <array> | required if type is dropdown` <br>
Array of the items for the dropdown menu.
- `name: <string> | required` <br>
Name of the input field.
- `placeholder: <string> | optional` <br>
Placeholder text for typeable input.
- `onChange: <function> | optional` <br>
OnChange function to handle when the input field's text has changed.
- `onClick: <function> | optional` <br>
OnClick function to handle when the element is clicked; is rarely used.
- `autoComplete: [none|auto] | optional` <br>
autoComplete prop of the input field. Usually the browser will display input recommendation. Disable by passing `none` to the prop.
- `required: [true|false] | optional` <br>
Determine the urgency of the field. Pass `true` if the field must not be empty.
- `additional_styles_label: <string> | optional` <br>
Additional styles to be applied to the input label.
- `additional_styles_input: <string> | optional` <br> 
Additional styles to be applied to the input field.
- `additional_styles_menu_container: <string> | optional` <br> 
Additional styles to be applied to the dropdown menu container.

- `additional_styles: <string> | optional` <br> 
Additional styles to be applied to the whole element. 


## Usage
```js
import Input from '../components/input_form/input'

const Index = () => {
  const dropdownItems = ['Demo item 1', 'Demo item 2', 'Demo item 3', 'Demo item 4', 'Demo item 5', 'Demo item 6', 'Demo item 7', 'Demo item 8', 'Demo item 9']
  return (
    <div>
        <Input
            label="E-mail"
            label_loc="beside"
            type="email"
            name={"email"}
            autoComplete="none"
            placeholder={"E-mail"}
            required={true}
            />
        <Input
            type="text"
            name={"email"}
            autoComplete="none"
            placeholder={"Label-less input"}
            required={true}
            />
        <Input
            label='Choose an item'
            label_loc='above'
            type="dropdown"
            dropdown_items={dropdownItems}
            required={true}
        />
    </div>
  )
}

export default Index
```

## Demo
*There will be a link to the Vercel website here later on to showcase this component*