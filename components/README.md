#to-do
- toggle navbar
- child nav
- vertical nav full height

#components
- navigation bar
    - side bar
    - top bar
    - items
    ``` props: {
        icon: @mdi,
        name: string,
        child: bool (if exist),
        link: path
    }
    ```

- image
    - round image
    ```props:{
        source: string,
        size: css style | width & height,
        alt: string (not necessary)
    }
    ```