import { tableData } from "./demodata"
import axios from "axios";

const TableComponent = ({ header, content, additional_styles }) => {
  const tableData = {
    header: header,
    content: content
  }
  return (
    <table className={`border-separate border-spacing-0 border-2 w-full rounded-lg overflow-hidden text-[15px] ${additional_styles}`}>
      <thead className="bg-gray-300">
        <tr className="text-left">
          {tableData.header.map((header, index) => {
            return (
              <th key={index} className="px-5 py-2">{header}</th>
            )
          })}
        </tr>
      </thead>
      <tbody className="">
        {tableData.content.map((content, index) =>
          <tr key={index} className="hover:bg-side_bar cursor-pointer">
            {tableData.header.map((header, index_2) => {
              return (
                <td key={index_2} className="px-5 py-2 border-t-2">
                  {content[header]}
                </td>)
            })}
          </tr>)}
      </tbody>
    </table>
  )
}

export default TableComponent