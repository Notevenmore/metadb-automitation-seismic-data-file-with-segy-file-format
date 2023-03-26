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
		icon: "/icons/seismic.svg",
		child: [
			{
				name: "2D Seismic",
				link: "",
				icon: "/icons/seismic.svg",
			},
			{
				name: "3D Seismic",
				link: "",
				icon: "/icons/seismic.svg",
			},
			{
				name: "Printed 2D/3D Seismic Report",
				link: "",
				icon: "/icons/seismic.svg",
			},
			{
				name: "Digital 2D/3D Seismic Report",
				link: "",
				icon: "/icons/seismic.svg",
			},
		],
	},
	{
		name: "Non-Seismic and Seismis Non-Conventional Data",
		icon: "/icons/non_seismic.svg",
		child: [
			{
				name: "Non-Seismic and Seismis Non-Conventional Data Summary",
				link: "",
				icon: "/icons/non_seismic.svg",
			},
			{
				name: "Non-Seismic and Seismic Non-Conventional Data Stored in Media",
				link: "",
				icon: "/icons/non_seismic.svg",
			},
			{
				name: "Non-Seismic and Seismic Non-Conventional Digital Data",
				link: "",
				icon: "/icons/non_seismic.svg",
			},
			{
				name: "Printed Non-Seismic and Seismic Non-Conventional Report",
				link: "",
				icon: "/icons/non_seismic.svg",
			},
			{
				name: "Digital Non-Seismic and Seismic Non-Conventional Report",
				link: "",
				icon: "/icons/non_seismic.svg",
			},
		],
	},
	{
		name: "Well Data",
		icon: "/icons/well_data.svg",
		child: [
			{
				name: "Well Summary",
				link: "",
				icon: "/icons/well_data.svg",
			},
			{
				name: "Well Logs",
				link: "",
				icon: "/icons/well_data.svg",
			},
			{
				name: "Well Report",
				link: "",
				icon: "/icons/well_data.svg",
			},
			{
				name: "Printed Well Report",
				link: "/well_data/printed_report",
				icon: "/icons/well_data.svg",
			},
			{
				name: "Well Seismic Profile",
				link: "",
				icon: "/icons/well_data.svg",
			},

		],
	},
	{
		name: "Well Sample and Well Core Sample",
		icon: "/icons/well_sample_core.svg",
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
		icon: "/icons/info.svg",
	},
	{
		name: "Technical Report",
		icon: "/icons/info.svg",
		child: [
			{
				name: "Printed Technical Report",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Digital Technical Report",
				link: "",
				icon: "/icons/info.svg",
			},
		],
	},
	{
		name: "Maps and Technical Drawing",
		icon: "/icons/info.svg",
		child: [
			{
				name: "Printed Maps and Technical Drawing",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Digital Maps and Technical Drawing",
				link: "",
				icon: "/icons/info.svg",
			},
		],
	},
	{
		name: "Project File",
		icon: "/icons/info.svg",
		child: [
			{
				name: "Digital Project File",
				link: "",
				icon: "/icons/info.svg",
			},
			{
				name: "Project File Stored in Media",
				link: "",
				icon: "/icons/info.svg",
			},
		],
	},
	{
		name: "Bibliography",
		link: "",
		icon: "/icons/info.svg",
	},
];
export default routing_list;