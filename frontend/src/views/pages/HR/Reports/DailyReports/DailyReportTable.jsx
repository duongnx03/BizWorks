import { format } from "date-fns";
import React from "react";

const DailyReportTable = ({data}) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fullname</th>
              <th>Department</th>
              <th>Position</th>
              <th>Check In Time</th>
              <th>Check Out Time</th>
              <th>Total Work Time</th>
              <th>Overtime</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
               <tr key={item.id}>
               <td>{item.employee.fullname}</td>
               <td>{item.employee.department}</td>
               <td>{item.employee.position}</td>
               <td>{format(new Date(item.checkInTime), 'hh:mm:ss a dd-MM-yyyy')}</td>
               <td>{format(new Date(item.checkOutTime), 'hh:mm:ss a dd-MM-yyyy')}</td>
               <td>{item.totalWorkTime}</td>
               <td>{item.overtime}</td>
               <td>{item.status}</td>
             </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyReportTable;
