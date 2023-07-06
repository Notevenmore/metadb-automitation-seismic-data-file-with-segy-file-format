import {twMerge} from 'tailwind-merge';
import {useState, useEffect} from 'react';

interface TableComponentProps {
  header: any,
  content: any,
  with_checkbox?: boolean,
  additional_styles?: string,
  additional_styles_header?: string,
  additional_styles_row?: string,
  additional_styles_column?: string,
  setSelectedRows?: any,
  contentAlignWithHeader?: boolean,
}

const TableComponent = ({
  header,
  content,
  with_checkbox = false,
  additional_styles = '',
  additional_styles_header = '',
  additional_styles_row = '',
  additional_styles_column = '',
  setSelectedRows,
  contentAlignWithHeader = false,
}: TableComponentProps) => {
  const [Selected, setSelected] = useState([]);
  const tableData = {
    header: header,
    content: content,
  };

  const handleSelectAll = () => {
    const temp = [];
    const checkbox = document.getElementById(
      'checkbox_all',
    ) as HTMLInputElement;
    const checkbox_all = document.getElementsByName('checkbox_row');
    checkbox_all.forEach((check: HTMLInputElement) => {
      if (checkbox.checked) {
        check.checked = true;
        temp.push(check.parentElement.parentElement.getAttribute('id'));
      } else {
        check.checked = false;
      }
    });
    setSelected(temp);
  };

  const handleSelectRow = (row_input_id: string, row_id: string) => {
    let temp = Selected;
    const checkbox_header = document.getElementById(
      'checkbox_all',
    ) as HTMLInputElement;
    const checkbox_row = document.getElementById(
      row_input_id,
    ) as HTMLInputElement;
    if (checkbox_header.checked && !checkbox_row.checked) {
      checkbox_header.checked = false;
    }
    if (!checkbox_row.checked) {
      temp = temp.filter(item => item !== row_id);
      setSelected(temp);
    } else {
      setSelected(prev => [...prev, row_id]);
    }
  };

  useEffect(() => {
    if (with_checkbox) {
      // directly using the setState function is prevented for performance sake
      // (to prevent re-render, which is very expensive in resource in this case)
      setSelectedRows[0] = Selected;
    }
  }, [Selected]);

  return (
    <table
      className={twMerge(
        `table-fixed break-words overflow-x-scroll
        border-separate border-spacing-0 border-2 border-solid border-black/20
        min-w-0 w-full rounded-lg text-[15px]`,
        additional_styles,
      )}>
      <thead className="bg-gray-200">
        <tr className="text-left">
          {with_checkbox && (
            <th
              className={twMerge(
                'pl-[14px] pt-1 w-5',
                additional_styles_header,
              )}>
              <input
                type="checkbox"
                id="checkbox_all"
                onClick={() => handleSelectAll()}
              />
            </th>
          )}
          {tableData.header.map((header, index) => {
            return (
              <th
                key={index}
                className={twMerge('pl-5 pr-2 py-2', additional_styles_header)}>
                {header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="text-ellipsis break-words">
        {tableData.content.map((row, row_index) => (
          <tr
            key={row_index}
            id={'row_' + row_index}
            className="hover:bg-side_bar">
            {with_checkbox && (
              <td
                className={twMerge(
                  'pl-[14px] pt-1 w-5 border-t-2 border-solid border-black/20',
                  additional_styles_row,
                )}>
                <input
                  id={'row_input_' + row_index}
                  name="checkbox_row"
                  type="checkbox"
                  onClick={() =>
                    handleSelectRow(
                      'row_input_' + row_index,
                      'row_' + row_index,
                    )
                  }
                />
              </td>
            )}
            {contentAlignWithHeader
              ? tableData.header.map((header, idx) => {
                  return (
                    <td
                      key={String(row) + header + idx}
                      className={twMerge(
                        'pl-5 pr-2 py-2 border-t-2 border-solid border-black/20',
                        additional_styles_row,
                      )}>
                      <div
                        className={twMerge(
                          'whitespace-nowrap text-ellipsis overflow-hidden',
                          additional_styles_column,
                        )}
                        title={row[header]}>
                        {row[header]}
                      </div>
                    </td>
                  );
                })
              : typeof row === 'object' && !Array.isArray(row) && row !== null
              ? Object.values(row).map((column: any, column_index: number) => {
                  return (
                    <td
                      key={column_index}
                      className={twMerge(
                        'pl-5 pr-2 py-2 border-t-2 border-solid border-black/20',
                        additional_styles_row,
                      )}>
                      <div
                        className={twMerge(
                          'whitespace-nowrap text-ellipsis overflow-hidden',
                          additional_styles_column,
                        )}
                        title={column}>
                        {column}
                      </div>
                    </td>
                  );
                })
              : row.map((column: any, column_index: number) => {
                  return (
                    <td
                      key={column_index}
                      className={twMerge(
                        'pl-5 pr-2 py-2 border-t-2 border-solid border-black/20',
                        additional_styles_row,
                      )}>
                      <div
                        className={twMerge(
                          'whitespace-nowrap text-ellipsis overflow-hidden',
                          additional_styles_column,
                        )}
                        title={column}>
                        {column}
                      </div>
                    </td>
                  );
                })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
