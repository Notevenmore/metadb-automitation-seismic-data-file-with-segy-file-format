import Button from '@components/button';
import {
  ColumnDefinition,
  ReactTabulator,
  ReactTabulatorOptions,
} from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator.min.css'; //import Tabulator stylesheet
import DownloadFolder from '../../public/icons/download-folder.svg';
import {RowObject} from './Type';

interface TableProps {
  data: RowObject[];
  columns: ColumnDefinition[];
  tableRef: any;
  options: ReactTabulatorOptions;
}

export default function TableEditor({
  data,
  columns,
  tableRef,
  options,
}: TableProps) {
  const downloadData = () => {
    tableRef.current.download('csv', 'report.csv');
  };

  return (
    <div className="m-8">
      <ReactTabulator
        data={data}
        columns={columns}
        layout={'fitData'}
        onRef={ref => (tableRef = ref)}
        options={options}
        events={{
          downloadComplete: () => {
            // console.log('Callback for done downloading!');
          },
          ajaxError: function (error: any) {
            console.log('ajaxError', error);
          },
        }}
      />
      <Button
        onClick={downloadData}
        additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p min-w-max justify-center mt-4">
        <div className="flex space-x-2 items-center">
          <DownloadFolder className="w-5 h-5" />
          <p>Download record</p>
        </div>
      </Button>
    </div>
  );
}
