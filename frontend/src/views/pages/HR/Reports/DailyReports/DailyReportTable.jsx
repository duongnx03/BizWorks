import React from "react";

const DailyReportTable = ({ data }) => {
  const formatTimeAMPM = (timeString) => {
    if (!timeString) return '00:00 AM';
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '00:00';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-warning text-dark';
      case 'Present':
        return 'bg-success text-white';
      case 'Absent':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fullname</th>
                <th>Department</th>
                <th>Attendance Date</th>
                <th>Check In Time</th>
                <th>Break Time Start</th>
                <th>Break Time End</th>
                <th>Check Out Time</th>
                <th>Total Work Time</th>
                <th>Overtime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee.fullname}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <span>{record.employee.department}</span>
                      <span className="text-muted">{record.employee.position}</span>
                    </div>
                  </td>
                  <td>{new Date(record.attendanceDate).toDateString()}</td>
                  <td>{formatTimeAMPM(record.checkInTime)}</td>
                  <td>{formatTimeAMPM(record.breakTimeStart)}</td>
                  <td>{formatTimeAMPM(record.breakTimeEnd)}</td>
                  <td>{formatTimeAMPM(record.checkOutTime)}</td>
                  <td>{formatTime(record.totalWorkTime)}</td>
                  <td>{formatTime(record.overtime)}</td>
                  <td className={`text-center ${getStatusClass(record.status)}`}>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyReportTable;
