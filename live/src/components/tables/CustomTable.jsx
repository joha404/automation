import ProjectStatusBadge from "@/page/dashboard/home/components/ProjectStatusBadge";
import CommonWrapper from "../wrappers/CommonWrapper";
import CommonParagraph from "../texts/CommonParagraph";
import { BsThreeDots } from "react-icons/bs";
import ProgressBar from "@/page/dashboard/subjectManagement/components/ProgressBar";

const CustomTable = ({ 
  data = [], 
  columns = [], 
  showStatusBadge = false,
  statusKey = 'status',
  statusLabel = 'Status',
  showProgressBar = false, // New prop
  progressKey = 'progress', // New prop
  progressLabel = 'Progress', // New prop
  actions = true
}) => {


  const tableColumns = columns.length > 0 ? columns : []

  return (
    <CommonWrapper variant="section">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-mediumBlack">
              {tableColumns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
              
              {showStatusBadge && (
                <th className="px-4 py-3 font-medium"> {statusLabel}</th>
              )}

               {showProgressBar && (
                <th className="px-4 py-3 font-medium">{progressLabel}</th>
              )}
              
              {actions && (
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-lightGrey">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {tableColumns.map((column) => (
                  <td key={`${item.id}-${column.key}`} className={`px-4 py-3 ${column.className || ''}`}>
                  <CommonParagraph variant="small">
                      {item[column.key]}
                  </CommonParagraph>
                  </td>
                ))}
                
                {showStatusBadge && (
                  <td className="px-4 py-3">
                    <ProjectStatusBadge status={item[statusKey]} />
                  </td>
                )}

                 {showProgressBar && (
                  <td className="px-4 py-3">
                    <ProgressBar value={item[progressKey]} />
                  </td>
                )}
                
                {actions && (
                  <td className="px-4 py-3 text-right">
                    <button className="text-mediumBlack hover:text-darkBlue cursor-pointer transition-colors duration-200">
                      <BsThreeDots size={20}/>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CommonWrapper>
  );
};

export default CustomTable;