const ROUTING_LIST = [
  {
    name: 'General Information',
    icon: '/icons/layers-outline.svg',
    child: [
      {
        name: 'Basin',
        link: '/datatype/general_data/basin',
        icon: '/icons/format-text.svg',
      },
      {
        name: 'Working area',
        link: '/datatype/general_data/working_area',
        icon: '/icons/info.svg',
      },
      {
        name: 'Field information',
        link: '/datatype/general_data/field_information',
        icon: '/icons/table.svg',
      },
    ],
  },
  {
    name: 'Seismic Data',
    icon: '/icons/seismic.svg',
    child: [
      {
        name: '2D Seismic Field Digital Data',
        link: '/datatype/seismic_data/2d_seismic_field_digital_data',
        icon: '/icons/seismic.svg',
      },
      {
        name: '2D Seismic',
        link: '..',
        icon: '/icons/seismic.svg',
      },
      {
        name: '3D Seismic',
        link: '..',
        icon: '/icons/seismic.svg',
      },
      {
        name: 'Printed 2D/3D Seismic Report',
        link: '/datatype/seismic_data/2d_3d_seismic_printed_report',
        icon: '/icons/seismic.svg',
      },
      {
        name: 'Digital 2D/3D Seismic Report',
        link: '/datatype/seismic_data/2d_3d_seismic_digital_report',
        icon: '/icons/seismic.svg',
      },
    ],
  },
  {
    name: 'Non-Seismic and Seismis Non-Conventional Data',
    icon: '/icons/non_seismic.svg',
    child: [
      {
        name: 'Non-Seismic and Seismis Non-Conventional Data Summary',
        link: '/datatype/non_seismic_and_seismis_non_conventional_data/non-seismic_and_seismic_unconventional_survey_summary',
        icon: '/icons/non_seismic.svg',
      },
      {
        name: 'Non-Seismic and Seismic Non-Conventional Data Stored in Media',
        link: '/datatype/non_seismic_and_seismis_non_conventional_data/non-seismic_and_seismic_unconventional_data_stored_in_media',
        icon: '/icons/non_seismic.svg',
      },
      {
        name: 'Non-Seismic and Seismic Non-Conventional Digital Data',
        link: '/datatype/non_seismic_and_seismis_non_conventional_data/non-seismic_and_seismic_unconventional_digital_data',
        icon: '/icons/non_seismic.svg',
      },
      {
        name: 'Printed Non-Seismic and Seismic Non-Conventional Report',
        link: '/datatype/non_seismic_and_seismis_non_conventional_data/non-seismic_and_seismic_unconventional_printed_report',
        icon: '/icons/non_seismic.svg',
      },
      {
        name: 'Digital Non-Seismic and Seismic Non-Conventional Report',
        link: '/datatype/non_seismic_data/non-seismic_and_seismic_unconventional_digital_report',
        icon: '/icons/non_seismic.svg',
      },
    ],
  },
  {
    name: 'Well Data',
    icon: '/icons/well_data.svg',
    child: [
      {
        name: 'Well Summary',
        link: '/datatype/well_data/well_summary',
        icon: '/icons/well_data.svg',
      },
      {
        name: 'Well Logs',
        link: '/datatype/well_data/printed_well_log',
        icon: '/icons/well_data.svg',
      },
      {
        name: 'Well Report',
        link: '/datatype/well_data/..',
        icon: '/icons/well_data.svg',
      },
      {
        name: 'Printed Well Report',
        link: '/datatype/well_data/printed_well_report',
        icon: '/icons/well_data.svg',
      },
      {
        name: 'Well Seismic Profile',
        link: '/datatype/well_data/..',
        icon: '/icons/well_data.svg',
      },
    ],
  },
  {
    name: 'Well Sample and Well Core Sample',
    icon: '/icons/well_sample_core.svg',
    child: [
      {
        name: 'Well Sample',
        link: '/datatype/well_sample_and_well_core_sample/well_sample',
        icon: '/icons/well_sample_core.svg',
      },
      {
        name: 'Well Core Sample',
        link: '/datatype/well_sample_and_well_core_sample/well_core_sample',
        icon: '/icons/well_sample_core.svg',
      },
    ],
  },
  {
    name: 'Outcrop',
    link: '/datatype/outcrop_sample',
    icon: '/icons/outcrop.svg',
  },
  {
    name: 'Technical Report',
    icon: '/icons/technical_report.svg',
    child: [
      {
        name: 'Printed Technical Report',
        link: '/datatype/technical_report/printed_technical_report',
        icon: '/icons/technical_report.svg',
      },
      {
        name: 'Digital Technical Report',
        link: '/datatype/technical_report/digital_technical_report',
        icon: '/icons/technical_report.svg',
      },
    ],
  },
  {
    name: 'Maps and Technical Drawing',
    icon: '/icons/maps.svg',
    child: [
      {
        name: 'Printed Maps and Technical Drawing',
        link: '/datatype/maps_and_technical_drawing/printed_maps_and_technical_drawing',
        icon: '/icons/maps.svg',
      },
      {
        name: 'Digital Maps and Technical Drawing',
        link: '/datatype/maps_and_technical_drawing/digital_maps_and_technical_drawing',
        icon: '/icons/maps.svg',
      },
    ],
  },
  {
    name: 'Project File',
    icon: '/icons/project_file.svg',
    child: [
      {
        name: 'Digital Project File',
        link: '/datatype/project_file/digital_project_file',
        icon: '/icons/project_file.svg',
      },
      {
        name: 'Project File Stored in Media',
        link: '/datatype/project_file/project_file_data_stored_in_media',
        icon: '/icons/project_file.svg',
      },
    ],
  },
  {
    name: 'Bibliography',
    link: '/datatype/bibliography',
    icon: '/icons/bibliography.svg',
  },
];
export default ROUTING_LIST;
