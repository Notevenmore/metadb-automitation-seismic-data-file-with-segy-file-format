# Sheet component

## Overview

The component used to display things inside the database. Call it by importing in another file

```js
import Sheets from '../components/sheets/sheets.js';

<Sheets />;
```

## Parameters:

> <code>existingID: string</code>

Used when the component does not need to be re-made again (such use case is when the page transitions from view document to edit document).

> <code>type: edit | new | review </code>

Self explanatory | WIP

> <code>documentID: string</code>

<strong>required if type is edit or review</strong><br/>
Self explanatory | WIP

> <code>form_type: string</code>

<strong>required</strong><br/>
[Click here to see <strong>`form_type`</strong> reference codes](https://docs.google.com/spreadsheets/d/1DvODJvgqoVp2Dxvv-0ebWVm65VLIzXD4ir8gULGKK6k/). Scroll down a bit and you will see the codes.<br/>
Self explanatory | WIP
