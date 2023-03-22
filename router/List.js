const routing_list = [
	{
		name: "General Information",
		icon: "/icons/layers-outline.svg",
		child: [
			{
				name: "Basin",
				link: "/basin",
				icon: "/icons/format-text.svg",
			},
			{
				name: "Working area",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Field information",
				link: "",
				icon: "/icons/table.svg",
			},
		],
	},
	{
		name: "Seismic Data",
		icon: "/icons/format-vertical-align-center.svg",
		child: [
			{
				name: "2D Seismic",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "3D Seismic",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Printed 2D/3D Seismic Report",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Digital 2D/3D Seismic Report",
				link: "",
				icon: "/icons/info.svg",
			},
		],
	},
	{
		name: "Non-Seismic and Seismis Non-Conventional Data",
		icon: "/icons/login.svg",
		child: [
			{
				name: "Non-Seismic and Seismis Non-Conventional Data Summary",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Non-Seismic and Seismic Non-Conventional Data Stored in Media",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Non-Seismic and Seismic Non-Conventional Digital Data",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Printed Non-Seismic and Seismic Non-Conventional Report",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Digital Non-Seismic and Seismic Non-Conventional Report",
				link: "",
				icon: "/icons/info.svg",
			},
		],
	},
	{
		name: "Well Data",
		icon: "/icons/page-layout-body.svg",
		child: [
			{
				name: "Well Summary",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Well Logs",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Well Report",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Printed Well Report",
				link: "/well_data/edit",
				icon: "/icons/info.svg",
			},
			{
				name: "Well Seismic Profile",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},

		],
	},
	{
		name: "Well Sample and Well Core Sample",
		icon: "/icons/page-layout-body.svg",
		child: [
			{
				name: "Well Sample",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Well Core Sample",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
		],
	},
	{
		name: "Outcrop",
		link: "",
		icon: "/icons/page-layout-body.svg",
	},
	{
		name: "Technical Report",
		icon: "/icons/page-layout-body.svg",
		child: [
			{
				name: "Printed Technical Report",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Digital Technical Report",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
		],
	},
	{
		name: "Maps and Technical Drawing",
		icon: "/icons/page-layout-body.svg",
		child: [
			{
				name: "Printed Maps and Technical Drawing",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Digital Maps and Technical Drawing",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
		],
	},
	{
		name: "Project File",
		icon: "/icons/page-layout-body.svg",
		child: [
			{
				name: "Digital Project File",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
			{
				name: "Project File Stored in Media",
				link: "",
				icon: "/icons/well_sample_core.svg",
			},
		],
	},
	{
		name: "Bibliography",
		link: "",
		icon: "/icons/page-layout-body.svg",
	},
];
export default routing_list;