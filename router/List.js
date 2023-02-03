import { mdiAccount, mdiAdjust, mdiAdvertisements, mdiAirHorn, mdiAirplane,  } from "@mdi/js"

export default [
    {
        name: "Home",
        link: "/",
        icon: mdiAccount,
    },
    {
        name: "Test1",
        link: "/test",
        icon: mdiAdjust,
    },
    {
        name: "Test2",
        link: "/test",
        icon: mdiAdvertisements,
    },
    {
        name: "Test3",
        link: "/test",
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
                link: "/test",
                icon: mdiAccount,
            },
        ]
    },
]