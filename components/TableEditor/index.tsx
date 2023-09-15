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
import { dateRegex } from './Helper';

interface TableProps {
  data: RowObject[];
  columns: ColumnDefinition[];
  tableRef: any;
  options: ReactTabulatorOptions;
  hideButton?: boolean;
  onDateValidationError?: () => void;
  onMaxNumericLimitError?: () => void;
}

export default function TableEditor({
  data,
  columns,
  tableRef,
  options,
  hideButton,
  onDateValidationError,
  onMaxNumericLimitError
}: TableProps) {
  const downloadData = () => {
    tableRef.current.download('csv', 'report.csv');
  };

  return (
    <div className="m-8">
      {
        data.length > 0 && 
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
            validationFailed: (cell, value, validators) => {
              if (validators.length === 0) return;
              const validator = validators[0];
              if (validator.type === "regex" && validator.parameters === dateRegex) {
                if (onDateValidationError) onDateValidationError();
              }
              if (validator.type === "max" && validator.parameters === "9000000000000000") {
                if (onMaxNumericLimitError) onMaxNumericLimitError();
              }
            }
          }}
        />
      }
      <Button
        onClick={downloadData}
        additional_styles={`${
          hideButton && 'hidden'
        } bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p min-w-max justify-center mt-4`}>
        <div className="flex space-x-2 items-center">
          <DownloadFolder className="w-5 h-5" />
          <p>Download record</p>
        </div>
      </Button>
    </div>
  );
}
