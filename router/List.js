import Blank from "../layout/Blank";

export default [
    {
        name: "Home",
        link: "/",
        icon: "/icons/home-outline.svg",
    },
    {
        name: "Input",
        link: "/input",
        icon: "/icons/format-text.svg",
    },
    {
        name: "Button",
        link: "/button",
        icon: "/icons/info.svg",
    },
    {
        name: "Table",
        link: "/table",
        icon: "/icons/table.svg",
    },
    {
        name: "Navigation bar",
        icon: "/icons/format-vertical-align-center.svg",
        child: [
            {
                name: "Topbar",
                link: "/",
                icon: "/icons/info.svg",
            },
            {
                name: "Sidebar",
                link: "/button",
                icon: "/icons/info.svg",
            },
        ]
    },
    {
        name: "Login",
        icon: "/icons/format-vertical-align-center.svg",
        child: [
            {
                name: "Sign in",
                link: "/login/signin",
                icon: "/icons/info.svg",
                layout: "blank"
            },
            {
                name: "Sign up",
                link: "/login/signup",
                icon: "/icons/info.svg",
            },
        ]
    },
]