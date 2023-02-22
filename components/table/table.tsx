import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"


const TableComponent = ({ header, content, with_checkbox = false, additional_styles = '', setSelectedRows }) => {
  const [Selected, setSelected] = useState([])
  const tableData = {
    header: header,
    content: content
  }

  const handleSelectAll = (e) => {
    const temp = []
    const checkbox = document.getElementById("checkbox_all") as HTMLInputElement
    const checkbox_all = document.getElementsByName("checkbox_row")
    checkbox_all.forEach((check: HTMLInputElement) => {
      if (checkbox.checked) {
        check.checked = true
        temp.push(check.parentElement.parentElement.getAttribute("id"))
      } else {
        check.checked = false
      }
    })
    setSelected(temp)
  }
  const handleSelectRow = (e, row_input_id: string, row_id: string) => {
    let temp = Selected
    const checkbox_header = document.getElementById("checkbox_all") as HTMLInputElement
    const checkbox_row = document.getElementById(row_input_id) as HTMLInputElement
    if (checkbox_header.checked && !checkbox_row.checked) {
      checkbox_header.checked = false
    }
    if (!checkbox_row.checked) {
      temp = temp.filter(item => item !== row_id)
      setSelected(temp)
    }
    else {
      setSelected(prev => ([...prev, row_id]))
    }
  }
  useEffect(() => {
    if (with_checkbox) {
      // directly using the setState function is prevented for performance sake 
      // (to prevent re-render, which is very expensive in resource in this case)
      setSelectedRows[0] = Selected
    }
  }, [Selected])

  return (
    <table className={twMerge('table-fixed break-words overflow-x-scroll border-separate border-spacing-0 border-2 min-w-0 w-full rounded-lg text-[15px]', additional_styles)}>
      <thead className="bg-gray-200">
        <tr className="text-left">
          {with_checkbox ? <th className="pl-[14px] pt-1 w-5"><input type="checkbox" id="checkbox_all" onClick={(e) => handleSelectAll(e)} /></th> : null}
          {tableData.header.map((header, index) => {
            return (
              <th key={index} className="pl-5 pr-2 py-2">{header}</th>
            )
          })}
        </tr>
      </thead>
      <tbody className="text-ellipsis break-words">
        {tableData.content.map((row, row_index) =>
          <tr key={row_index} id={'row_' + row_index} className="hover:bg-side_bar">
            {with_checkbox ? <td className="pl-[14px] pt-1 w-5 border-t-2"><input id={'row_input_' + row_index} name="checkbox_row" type="checkbox" onClick={(e) => handleSelectRow(e, "row_input_" + row_index, "row_" + row_index)} /></td> : null}
            {typeof row === 'object' && !Array.isArray(row) && row !== null ?
              Object.values(row).map((column: any, column_index: number) => {
                return (
                  <td key={column_index} className="pl-5 pr-2 py-2 border-t-2">
                    <div className="whitespace-nowrap text-ellipsis overflow-hidden">{column}</div>
                  </td>
                )
              })
              :
              row.map((column: any, column_index: number) => {
                return (
                  <td key={column_index} className="pl-5 pr-2 py-2 border-t-2">
                    <div className="whitespace-nowrap text-ellipsis overflow-hidden">{column}</div>
                  </td>
                )
              })
            }
          </tr>)}
      </tbody>
    </table>
  )
}

export default TableComponent