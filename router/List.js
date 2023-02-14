import Blank from "../layout/Blank";

export default [
    {
        name: "Home",
        link: "/",
        icon: "/icons/home-outline.svg",
    },
    {
        name: "Small Components",
        icon: "/icons/layers-outline.svg",
        child: [
            {
                name: "Input",
                link: "/components/input",
                icon: "/icons/format-text.svg",
            },
            {
                name: "Button",
                link: "/components/button",
                icon: "/icons/info.svg",
            },
            {
                name: "Table",
                link: "/components/table",
                icon: "/icons/table.svg",
            },
            {
                name: "Layout",
                link: "/components/layout",
                icon: "/icons/layers.svg",
            },
        ],
    },
    {
        name: "Navigation bar",
        icon: "/icons/format-vertical-align-center.svg",
        child: [
            {
                name: "Topbar",
                link: "/navigation/topbar",
                icon: "/icons/info.svg",
            },
            {
                name: "Sidebar",
                link: "/navigation/navbar",
                icon: "/icons/info.svg",
            },
        ],
    },
    {
        name: "Login",
        icon: "/icons/login.svg",
        child: [
            {
                name: "Sign in",
                link: "/login/signin",
                icon: "/icons/info.svg",
                layout: "blank",
            },
            {
                name: "Sign up",
                link: "/login/signup",
                icon: "/icons/info.svg",
            },
        ],
    },
    {
        name: "Pages",
        icon: "/icons/page-layout-body.svg",
        child: [
            {
                name: "Drafts",
                link: "/drafts",
                icon: "/icons/well_sample_core.svg",
            },
            {
                name: "Bokeh",
                link: "/bokeh",
                icon: "/icons/chart-line-variant.svg",
            },],
    },
];
