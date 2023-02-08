import { mdiAccount, mdiAdjust, mdiAdvertisements, mdiAirHorn, mdiAirplane,  } from "@mdi/js"

export default [
    {
        name: "Home",
        link: "/",
        icon: mdiAccount,
    },
    {
        name: "Input",
        link: "/input",
        icon: mdiAdjust,
    },
    {
        name: "Button",
        link: "/button",
        icon: mdiAdvertisements,
    },
    {
        name: "Table",
        link: "/table",
        icon: mdiAirHorn,
    },
    {
        name: "Test4 ahuyfgbueb",
        icon: mdiAirplane,
        child: [
            {
                name: "Home 2",
                link: "/",
                icon: mdiAccount,
            },
            {
                name: "Test55",
                link: "/button",
                icon: mdiAccount,
            },
        ]
    },
    {
        name: "Test5",
        link: "/input",
        icon: mdiAirHorn,
    },
]