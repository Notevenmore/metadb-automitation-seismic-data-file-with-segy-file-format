export default {
	bibliography: {
		workspace: "http://localhost:9090/api/v1/bibliography-workspace/",
		afe: "http://localhost:9090/api/v1/bibliography-workspace-afe/",
		view: "http://localhost:9090/api/v1/bibliography/"
	},
	printed_well_report: {
		workspace: "http://localhost:8080/api/v1/print-well-report-workspace/",
		afe: "http://localhost:8080/api/v1/print-well-report-workspace-afe/",
		view: "http://localhost:8080/api/v1/print-well-report/"
	},
	services: {
		sheets: "http://localhost:5050"
	}
}

export const datatypes = {
	"Basin": "basin",
	"Working Area": "working_area",
	"Field Information ": "field_information",
	"2D Seismic Summary": "2d_seismic_summary",
	"2D Seismic Section": "2d_seismic_section",
	"Digital 2D Seismic Section": "digital_2d_seismic_section",
	"2D Seismic Field Data Stored In Media": "2d_seismic_field_data_stored_in_media",
	"2D Seismic Process Data Stored In Media": "2d_seismic_process_data_stored_in_media",
	"2D Seismic Field Digital Data": "2d_seismic_field_digital_data",
	"2D Seismic Processed Digital Data": "2d_seismic_processed_digital_data",
	"2D Seismic Navigation Digital Data": "2d_seismic_navigation_digital_data",
	"2D Seismic Navigation Data Stored In Media": "2d_seismic_navigation_data_stored_in_media",
	"3D Seismic Summary": "3d_seismic_summary",
	"3D Seismic Field Data Stored In Media": "3d_seismic_field_data_stored_in_media",
	"3D Seismic Process Data Stored In Media": "3d_seismic_process_data_stored_in_media",
	"3D Seismic Field Digital Data": "3d_seismic_field_digital_data",
	"3D Seismic Processed Digital Data": "3d_seismic_processed_digital_data",
	"3D Seismic Navigation Digital Data": "3d_seismic_navigation_digital_data",
	"3D Seismic Navigation Data Stored In Media": "3d_seismic_navigation_data_stored_in_media",
	"2D/3D Seismic Printer Report": "2d_3d_seismic_printer_report",
	"2D/3D Seismic Digital Report": "2d_3d_seismic_digital_report",
	"Seismic Interpretation Data": "seismic_interpretation_data",
	"Non-Seismic And Seismic Unconventional Survey Summary": "non-seismic_and_seismic_unconventional_survey_summary",
	"Non-Seismic And Seismic Unconventional Data Stored In Media": "non-seismic_and_seismic_unconventional_data_stored_in_media",
	"Non-Seismic And Seismic Unconventional Digital Data": "non-seismic_and_seismic_unconventional_digital_data",
	"Non-Seismic And Seismic Unconventional Printed Report": "non-seismic_and_seismic_unconventional_printed_report",
	"Non-Seismic And Seismic Unconventional Digital Report": "non-seismic_and_seismic_unconventional_digital_report",
	"Well Summary": "well_summary",
	"Printed Well Log": "printed_well_log",
	"Digital Image Well Log": "digital_image_well_log",
	"Digital Well Log": "digital_well_log",
	"Printed Well Report": "printed_well_report",
	"Digital Well Report": "digital_well_report",
	"Digital Well Seismic Profile": "digital_well_seismic_profile",
	"Well Seismic Profile Stored In Media": "well_seismic_profile_stored_in_media",
	"Well Sample": "well_sample",
	"Well Core Sample": "well_core_sample",
	"Outcrop Sample": "outcrop_sample",
	"Printed Technical Report": "printed_technical_report",
	"Digital Technical Report": "digital_technical_report",
	"Printed Maps And Technical Drawing": "printed_maps_and_technical_drawing",
	"Digital Maps And Technical Drawing": "digital_maps_and_technical_drawing",
	"Digital Project File": "digital_project_file",
	"Project File Data Stored In Media": "project_file_data_stored_in_media",
	"Bibliography": "bibliography"
}