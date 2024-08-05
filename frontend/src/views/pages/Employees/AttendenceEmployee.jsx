import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import AttendanceEmployeeFilter from "../../../components/AttendanceEmployeeFilter";
import axios from "axios";

const formatTime = (timeString) => {
  if (!timeString) return '00:00';
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

const getHours = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};

const calculateWorkTime = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return "00:00";

  const checkInDate = new Date(checkInTime);
  const checkOutDate = new Date(checkOutTime);
  const diffInMilliseconds = checkOutDate - checkInDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return `${hours}.${minutes < 10 ? '0' : ''}${minutes} hrs`;
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

const getCurrentWorkTime = (checkInTime) => {
  if (!checkInTime) return "00:00";
  
  const checkInDate = new Date(checkInTime);
  const now = new Date();
  const diffInMilliseconds = now - checkInDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  
  return `${hours}.${minutes < 10 ? '0' : ''}${minutes} hrs`;
};

const fetchAttendanceData = async (setAttendances, setTodayActivity, fromDate, toDate) => {
  try {
    const response = await axios.get('http://localhost:8080/api/attendance/getByEmail', { withCredentials: true });
    if (response.data.data) {
      const data = response.data.data;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      const endOfDay = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

      const filteredData = data
        .filter(attendance => {
          const attendanceDate = new Date(attendance.attendanceDate);
          return (!startDate || attendanceDate >= startDate) &&
            (!endOfDay || attendanceDate <= endOfDay);
        })
        .filter(attendance => new Date(attendance.attendanceDate) >= startOfMonth)
        .sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate));

      setAttendances(filteredData);

      const today = now.toISOString().split('T')[0];
      const todayAttendance = data.find(attendance => attendance.attendanceDate.startsWith(today));

      setTodayActivity({
        checkInTime: todayAttendance?.checkInTime ? new Date(todayAttendance.checkInTime).toLocaleString() : "",
        checkOutTime: todayAttendance?.checkOutTime ? new Date(todayAttendance.checkOutTime).toLocaleString() : "",
        workTime: todayAttendance?.checkInTime && todayAttendance?.checkOutTime
          ? calculateWorkTime(todayAttendance.checkInTime, todayAttendance.checkOutTime)
          : "00:00"
      });
    }
  } catch (error) {
    console.error("Error fetching attendance data: ", error);
  }
};

const AttendanceEmployee = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendances, setAttendances] = useState([]);
  const [totalWorkTime, setTotalWorkTime] = useState({
    totalWorkTimeInWeek: 0,
    totalWorkTimeInMonth: 0,
    totalOvertimeInMonth: 0
  });
  const [todayActivity, setTodayActivity] = useState({
    checkInTime: "",
    checkOutTime: "",
    workTime: "00:00"
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);

  const totalPages = Math.ceil(attendances.length / recordsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceData(setAttendances, setTodayActivity, fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    const fetchTotalWorkTime = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/attendance/totalWorkAndOvertime', { withCredentials: true });
        if (response.data.data) {
          setTotalWorkTime(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching total work time: ", error);
      }
    };
    fetchTotalWorkTime();
  }, []);

  const handleCheckIn = async () => {
    try {
      await axios.post('http://localhost:8080/api/attendance/checkIn', {}, { withCredentials: true });
      await fetchAttendanceData(setAttendances, setTodayActivity, fromDate, toDate);
    } catch (error) {
      console.error("Error during check-in: ", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post('http://localhost:8080/api/attendance/checkOut', {}, { withCredentials: true });
      await fetchAttendanceData(setAttendances, setTodayActivity, fromDate, toDate);
    } catch (error) {
      console.error("Error during check-out: ", error);
    }
  };

  const isCheckOutAvailable = () => {
    const today = currentTime.toISOString().split('T')[0];
    const todayAttendance = attendances.find(attendance => attendance.attendanceDate.startsWith(today));

    const checkOutStartTime = new Date(currentTime);
    checkOutStartTime.setHours(16, 25, 0);

    return todayAttendance && todayAttendance.checkInTime && currentTime >= checkOutStartTime;
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedAttendances = attendances.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const calculateWorkTimeDisplay = () => {
    if (todayActivity.checkInTime) {
      return todayActivity.checkOutTime
        ? calculateWorkTime(todayActivity.checkInTime, todayActivity.checkOutTime)
        : getCurrentWorkTime(todayActivity.checkInTime);
    }
    return "00:00";
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs maintitle="Attendance" title="Dashboard" subtitle="Attendance" />

        <div className="row">
          <div className="col-md-4">
            <div className="card punch-status">
              <div className="card-body">
                <h5 className="card-title">
                  Timesheet <small className="text-muted"> {currentTime.toLocaleString()}</small>
                </h5>
                <div className="punch-info">
                  <div className="punch-hours">
                    <span>{calculateWorkTimeDisplay()}</span>
                  </div>
                </div>
                <div className="punch-btn-section">
                  {todayActivity.checkInTime && !todayActivity.checkOutTime ? (
                    <button
                      type="button"
                      className={`btn ${isCheckOutAvailable() ? 'btn-primary' : 'btn-secondary'} punch-btn`}
                      onClick={handleCheckOut}
                      disabled={!isCheckOutAvailable()}
                    >
                      Check Out
                    </button>
                  ) : todayActivity.checkOutTime ? (
                    <button
                      type="button"
                      className="btn btn-success punch-btn"
                      disabled
                    >
                      Has Checked Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary punch-btn"
                      onClick={handleCheckIn}
                    >
                      Check In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card att-statistics">
              <div className="card-body">
                <h5 className="card-title">Statistics</h5>
                <div className="stats-list">
                  <div className="stats-info">
                    <p>
                      This Week
                      <strong>
                        {totalWorkTime?.totalWorkTimeInWeek || 0} <small>/ 40 hrs</small>
                      </strong>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${(getHours(totalWorkTime?.totalWorkTimeInWeek || '0:00') / 40) * 100}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  <div className="stats-info">
                    <p>
                      This Month
                      <strong>
                        {totalWorkTime?.totalWorkTimeInMonth || 0} <small>/ 160 hrs</small>
                      </strong>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${(getHours(totalWorkTime?.totalWorkTimeInMonth || '0:00') / 160) * 100}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  <div className="stats-info">
                    <p>
                      Overtime in Month
                      <strong>
                        {totalWorkTime?.totalOvertimeInMonth || 0} <small>/ 8 hrs</small>
                      </strong>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${(getHours(totalWorkTime?.totalOvertimeInMonth || '0:00') / 8) * 100}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card recent-activity">
              <div className="card-body">
                <h5 className="card-title">Today Activity</h5>
                <ul className="res-activity-list">
                  {todayActivity.checkInTime &&
                    <li>
                      <p className="mb-0">Check In at</p>
                      <p className="res-activity-time">
                        <i className="fa-regular fa-clock"></i> {todayActivity.checkInTime}
                      </p>
                    </li>
                  }
                  {todayActivity.checkOutTime &&
                    <li>
                      <p className="mb-0">Check Out at</p>
                      <p className="res-activity-time">
                        <i className="fa-regular fa-clock"></i> {todayActivity.checkOutTime}
                      </p>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>

          <AttendanceEmployeeFilter onDateRangeChange={(from, to) => {
            setFromDate(from);
            setToDate(to);
          }} />

          <div className="row">
            <div className="col-lg-12">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In Time</th>
                    <th>Check Out Time</th>
                    <th>Total Work Time</th>
                    <th>Overtime</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAttendances.map(attendance => (
                    <tr key={attendance.id}>
                      <td>{new Date(attendance.attendanceDate).toDateString()}</td>
                      <td>{attendance.checkInTime ? new Date(attendance.checkInTime).toLocaleString() : ""}</td>
                      <td>{attendance.checkOutTime ? new Date(attendance.checkOutTime).toLocaleString() : ""}</td>
                      <td>{formatTime(attendance.totalWorkTime)}</td>
                      <td>{formatTime(attendance.overtime)}</td>
                      <td className={`text-center ${getStatusClass(attendance.status)}`}>
                        {attendance.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
                <nav>
                  <ul className="pagination" style={{ margin: 0 }}>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                        style={{ margin: '0 2px' }}
                      >
                        <button
                          onClick={() => handlePageChange(index + 1)}
                          className="page-link"
                          style={{
                            backgroundColor: index + 1 === currentPage ? '#FF902F' : '#fff',
                            borderColor: index + 1 === currentPage ? '#FF902F' : '#dee2e6',
                            color: index + 1 === currentPage ? '#fff' : '#373B3E',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceEmployee;
