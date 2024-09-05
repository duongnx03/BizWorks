import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { format, getDaysInMonth } from "date-fns";
import axios from "axios";
import { Link } from "react-router-dom";
import AttendanceComplaintPopup from "../../../components/modelpopup/AttendanceComplaintPopup";

const formatTime = (timeString) => {
  if (!timeString) return '00:00';
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

const formatTimeAMPM = (timeString) => {
  if (!timeString) return '00:00 AM';
  return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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

const fetchAttendanceData = async (setAttendanceData, month, year) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/attendance/getForMonth`, {
      params: { month, year },
      withCredentials: true
    });
    if (response.data.data) {
      const data = response.data.data;
      setAttendanceData(data.sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate)));
    } else {
      setAttendanceData([]); // Reset data if no data returned
    }
  } catch (error) {
    console.error("Error fetching attendance data: ", error);
  }
};

const AttendenceAdmin = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // tháng là 1-based
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);

  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth - 1));
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

  const handleOpenModal = (attendanceId) => {
    setSelectedAttendanceId(attendanceId);
    setShowComplaintModal(true);
  };
  const handleCloseModal = () => setShowComplaintModal(false);

  useEffect(() => {
    fetchAttendanceData(setAttendanceData, currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const getAttendanceStatusForDay = (day) => {
    const dateString = format(new Date(currentYear, currentMonth - 1, day), "yyyy-MM-dd");
    const attendanceForDay = attendanceData.find(
      (attendance) => attendance.attendanceDate === dateString
    );
    return attendanceForDay ? attendanceForDay.status : null;
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedAttendances = attendanceData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleMonthYearSubmit = (e) => {
    e.preventDefault();
    const month = parseInt(e.target.month.value, 10);
    const year = parseInt(e.target.year.value, 10);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // Inline styles
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '1px solid #ccc',
      padding: '8px',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    td: {
      border: '1px solid #ccc',
      padding: '8px',
      textAlign: 'center',
      height: '50px',
      width: '50px',
    },
    statusIcon: {
      fontSize: '20px',
    },
    monthYearTitle: {
      textAlign: 'center',
      marginBottom: '20px',
    },
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs maintitle="Attendance Data" title="Dashboard" subtitle="Attendance Data" />
          {/* /Page Header */}

          <form className="d-flex align-items-end mb-4" onSubmit={handleMonthYearSubmit}>
            <div className="form-group me-3 flex-fill">
              <label htmlFor="month" className="form-label">Month</label>
              <select id="month" name="month" className="form-control" defaultValue={currentMonth}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {format(new Date(2024, i), 'MMMM')}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group me-3 flex-fill">
              <label htmlFor="year" className="form-label">Year</label>
              <select id="year" name="year" className="form-control" defaultValue={currentYear}>
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={currentYear - 2 + i} value={currentYear - 2 + i}>
                    {currentYear - 2 + i}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>

          <h3 style={styles.monthYearTitle}>
            {format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}
          </h3>

          {attendanceData.length === 0 ? (
            <div className="alert alert-warning">No data found</div>
          ) : (
            <>
              <div className="row">
                <div className="col-lg-12">
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {Array.from({ length: daysInMonth }, (_, i) => (
                          <th key={i + 1} style={styles.th}>{i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const day = i + 1;
                          const status = getAttendanceStatusForDay(day);
                          return (
                            <td key={day} style={styles.td}>
                              {status === "Present" ? (
                                <AiOutlineCheckCircle color="green" style={styles.statusIcon} />
                              ) : status === "Absent" ? (
                                <AiOutlineCloseCircle color="red" style={styles.statusIcon} />
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In Time</th>
                        <th>Break Time Start</th>
                        <th>Break Time End</th>
                        <th>Check Out Time</th>
                        <th>Total Work Time</th>
                        <th>Overtime</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAttendances.map(attendance => (
                        <tr key={attendance.id}>
                          <td>{new Date(attendance.attendanceDate).toDateString()}</td>
                          <td>
                            {attendance.checkInTime ?
                              formatTimeAMPM(attendance.checkInTime)
                              : ""}
                          </td>
                          <td>
                            {attendance.breakTimeStart ?
                              formatTimeAMPM(attendance.breakTimeStart)
                              : ""}
                          </td>
                          <td>
                            {attendance.breakTimeEnd ?
                              formatTimeAMPM(attendance.breakTimeEnd)
                              : ""}
                          </td>
                          <td>
                            {attendance.checkOutTime ?
                              formatTimeAMPM(attendance.checkOutTime)
                              : ""}
                          </td>
                          <td>{formatTime(attendance.totalWorkTime)}</td>
                          <td>{formatTime(attendance.overtime)}</td>
                          <td className={`text-center ${getStatusClass(attendance.status)}`}>
                            {attendance.status}
                          </td>
                          <td>
                            <div className="dropdown dropdown-action text-end">
                              <Link
                                to="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="material-icons">more_vert</i>
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <p className="dropdown-item" onClick={() => handleOpenModal(attendance.id)}>Complaint</p>
                              </div>
                            </div>
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
              <AttendanceComplaintPopup
                show={showComplaintModal}
                onClose={handleCloseModal}
                attendanceId={selectedAttendanceId}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendenceAdmin;
