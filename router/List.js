import { mdiAccount, mdiAdjust, mdiAdvertisements, mdiAirHorn, mdiAirplane, mdiInformationOutline, mdiFileDocumentOutline  } from "@mdi/js"

export default [
    {
        name: "Home",
        link: "/",
        icon: mdiInformationOutline,
    },
    {
        name: "Input",
        link: "/input",
        icon: mdiFileDocumentOutline,
    },
    {
        name: "Button",
        link: "/button",
        icon: mdiFileDocumentOutline,
    },
    {
        name: "Table",
        link: "/table",
        icon: mdiFileDocumentOutline,
    },
    {
        name: "Profile",
        link: "/profile",
        icon: mdiAccount,
    },
    {
        name: "Expand and Collapse",
        icon: mdiInformationOutline,
        child: [
            {
                name: "Home",
                link: "/",
                icon: mdiFileDocumentOutline,
            },
            {
                name: "Buttons",
                link: "/button",
                icon: mdiFileDocumentOutline,
            },
        ]
    },
]