import { mdiAccount, mdiAdjust, mdiAdvertisements, mdiAirHorn, mdiAirplane,  } from "@mdi/js"

export default [
    {
        name: "Test0",
        link: "/test",
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
        link: "/test",
        icon: mdiAirplane,
        children: [
            {
                name: "Test3",
                link: "/test",
                icon: mdiAccount,
            },
        ]
    },
]