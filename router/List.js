import { mdiIpOutline } from "@mdi/js";

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
            {
                name: "Container",
                link: "/components/container",
                icon: "/icons/layers.svg",
            },
            {
                name: "Popup Dialog",
                link: "/components/popup-dialog",
				icon: "/icons/window-maximize.svg",
            },
			{
				name: "Floating Dialog",
				link: "/components/float-dialog",
				icon: "/icons/window-maximize.svg",
			},
            {
                name: "Profile Floating Dialog",
                link: "/components/float-dialog/profile-dialog",
				icon: "/icons/window-maximize.svg",
            },
            {
                name: "Notification Floating Dialog",
                link: "/components/float-dialog/notification-dialog",
				icon: "/icons/window-maximize.svg",
            }
		],
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
			},
            {
                name: "Profile",
                link: "/profile",
				icon: "/icons/info.svg",
			},
            {
                name: "Database",
                link: "/database",
				icon: "/icons/database.svg",
            },
			{
				name: "New Document",
				link: "/new-document",
				icon: "/icons/file-document-outline.svg",
			},
			{
				name: "Connect to Database - New Document",
				link: "/database-new-document",
				icon: "/icons/file-document-outline.svg",
			},
            {
                name: "Upload File",
                link: "/upload-file",
				icon: "/icons/file-document-outline.svg",
            },
			{
                name: "Upload File - Review",
                link: "/upload-file-review",
				icon: "/icons/file-document-outline.svg",
            },
            {
                name: "Basin",
                link: "/basin",
				icon: "/icons/file-document-outline.svg",
            },
			{
				name: "Basin Edit",
				link: "/basin-edit",
				icon: "/icons/file-document-outline.svg"
			}

        ],
    },
	{
		name: "Error",
		icon: "/icons/info.svg",
		child: [
			{
				name: "403",
				link: "/403",
				icon: "/icons/info.svg",
			},
			{
				name: "404",
				link: "/404",
				icon: "/icons/info.svg",
			},
			{
				name: "500",
				link: "/500",
				icon: "/icons/info.svg",
			},
			{
				name: "502",
				link: "/502",
				icon: "/icons/info.svg",
			},
			{
				name: "503",
				link: "/503",
				icon: "/icons/info.svg",
			},
			{
				name: "504",
				link: "/504",
				icon: "/icons/info.svg",
			},
		]
	}
];
