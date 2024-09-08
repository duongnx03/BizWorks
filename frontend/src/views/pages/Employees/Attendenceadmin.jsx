import React, { useCallback, useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { format, getDaysInMonth } from "date-fns";
import axios from "axios";
import AttendanceComplaintPopup from "../../../components/modelpopup/AttendanceComplaintPopup";
import { Button, Modal } from "react-bootstrap";

const formatTime = (timeString) => {
  if (!timeString) return "00:00";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const formatTimeAMPM = (timeString) => {
  if (!timeString) return "00:00 AM";
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "In Progress":
      return "bg-warning text-dark";
    case "Present":
      return "bg-success text-white";
    case "Absent":
      return "bg-danger text-white";
    default:
      return "bg-secondary text-white";
  }
};

const getType = (type) => {
  switch (type) {
    case "noon_overtime":
      return "Overtime noon from 12:00 to 13:00";
    case "30m_overtime":
      return "Overtime after work 30 minutes";
    case "1h_overtime":
      return "Overtime after work 1 hour";
    case "1h30":
      return "Overtime after work 1 hour 30 minutes";
    case "2h_overtime":
      return "Overtime after work 2 hours";
    default:
      return "bg-secondary";
  }
};

const fetchAttendanceData = async (setAttendanceData, month, year) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/attendance/getForMonth`,
      {
        params: { month, year },
        withCredentials: true,
      }
    );
    if (response.data.data) {
      const data = response.data.data;
      setAttendanceData(
        data.sort(
          (a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate)
        )
      );
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
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [overtimeType, setOvertimeType] = useState("");
  const [overtimeReason, setOvertimeReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);

  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth - 1));
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

  const handleOpenModal = useCallback((attendanceId) => {
    setSelectedAttendanceId(attendanceId);
    setShowComplaintModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowComplaintModal(false);
    setSelectedAttendanceId(null);
  };

  const handleOpenOvertimeModal = useCallback((attendanceId) => {
    setSelectedAttendanceId(attendanceId);
    setShowOvertimeModal(true);
  }, []);

  const handleOvertimeSubmit = () => {
    axios
      .post(
        "http://localhost:8080/api/overtime/create",
        {
          type: overtimeType,
          reason: overtimeReason,
          attendanceId: selectedAttendanceId,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Complaint submitted successfully:", response.data);
        handleCloseOvertimeModal();
      })
      .catch((error) => {
        console.error("Error submitting complaint:", error);
      });
  };

  const handleCloseOvertimeModal = () => {
    setSelectedAttendanceId(null);
    setShowOvertimeModal(false);
    setOvertimeType("");
    setOvertimeReason("");
  };

  useEffect(() => {
    fetchAttendanceData(setAttendanceData, currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const getAttendanceStatusForDay = (day) => {
    const dateString = format(
      new Date(currentYear, currentMonth - 1, day),
      "yyyy-MM-dd"
    );
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
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      border: "1px solid #ccc",
      padding: "8px",
      textAlign: "center",
      fontWeight: "bold",
    },
    td: {
      border: "1px solid #ccc",
      padding: "8px",
      textAlign: "center",
      height: "50px",
      width: "50px",
    },
    statusIcon: {
      fontSize: "20px",
    },
    monthYearTitle: {
      textAlign: "center",
      marginBottom: "20px",
    },
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Attendance Data"
            title="Dashboard"
            subtitle="Attendance Data"
          />
          {/* /Page Header */}

          <form
            className="d-flex align-items-end mb-4"
            onSubmit={handleMonthYearSubmit}
          >
            <div className="form-group me-3 flex-fill">
              <label htmlFor="month" className="form-label">
                Month
              </label>
              <select
                id="month"
                name="month"
                className="form-control"
                defaultValue={currentMonth}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {format(new Date(2024, i), "MMMM")}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group me-3 flex-fill">
              <label htmlFor="year" className="form-label">
                Year
              </label>
              <select
                id="year"
                name="year"
                className="form-control"
                defaultValue={currentYear}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={currentYear - 2 + i} value={currentYear - 2 + i}>
                    {currentYear - 2 + i}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>

          <h3 style={styles.monthYearTitle}>
            {format(new Date(currentYear, currentMonth - 1), "MMMM yyyy")}
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
                          <th key={i + 1} style={styles.th}>
                            {i + 1}
                          </th>
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
                                <AiOutlineCheckCircle
                                  color="green"
                                  style={styles.statusIcon}
                                />
                              ) : status === "Absent" ? (
                                <AiOutlineCloseCircle
                                  color="red"
                                  style={styles.statusIcon}
                                />
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
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Check In Time</th>
                          <th>Break Time Start</th>
                          <th>Break Time End</th>
                          <th>Check Out Time</th>
                          <th>Total Time</th>
                          <th>Office Hours</th>
                          <th>Overtime</th>
                          <th>Note</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAttendances.map((attendance) => (
                          <tr key={attendance.id}>
                            <td>
                              {new Date(
                                attendance.attendanceDate
                              ).toDateString()}
                            </td>
                            <td>
                              {attendance.checkInTime
                                ? formatTimeAMPM(attendance.checkInTime)
                                : "N/A"}
                            </td>
                            {attendance.overtimeDTO &&
                            attendance.overtimeDTO.type === "noon_overtime" ? (
                              <td>N/A</td>
                            ) : (
                              <td>
                                {attendance.breakTimeStart
                                  ? formatTimeAMPM(attendance.breakTimeStart)
                                  : "N/A"}
                              </td>
                            )}
                            {attendance.overtimeDTO &&
                            attendance.overtimeDTO.type === "noon_overtime" ? (
                              <td>N/A</td>
                            ) : (
                              <td>
                                {attendance.breakTimeEnd
                                  ? formatTimeAMPM(attendance.breakTimeEnd)
                                  : "N/A"}
                              </td>
                            )}
                            <td>
                              {attendance.checkOutTime
                                ? formatTimeAMPM(attendance.checkOutTime)
                                : "N/A"}
                            </td>
                            <td>
                              {attendance.totalTime
                                ? formatTime(attendance.totalTime)
                                : "N/A"}
                            </td>
                            <td>
                              {attendance.officeHours
                                ? formatTime(attendance.officeHours)
                                : "N/A"}
                            </td>
                            <td>
                              {attendance.overtime
                                ? formatTime(attendance.overtime)
                                : "N/A"}
                            </td>
                            {!attendance.overtimeDTO ? (
                              <td>N/A</td>
                            ) : (
                              <td>{getType(attendance.overtimeDTO.type)}</td>
                            )}
                            <td
                              className={`text-center ${getStatusClass(
                                attendance.status
                              )}`}
                            >
                              {attendance.status}
                            </td>
                            <td>
                              {!attendance.checkInTime &&
                                !attendance.checkOutTime && (
                                  <button
                                    className="btn btn-primary me-2"
                                    onClick={() =>
                                      handleOpenModal(attendance.id)
                                    }
                                  >
                                    Complaint
                                  </button>
                                )}
                              {attendance.checkInTime &&
                                attendance.checkOutTime && (
                                  <button
                                    className="btn btn-primary me-2"
                                    onClick={() =>
                                      handleOpenModal(attendance.id)
                                    }
                                  >
                                    Complaint
                                  </button>
                                )}
                              {attendance.checkInTime &&
                                !attendance.checkOutTime && (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      handleOpenOvertimeModal(attendance.id)
                                    }
                                  >
                                    Overtime
                                  </button>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "10px 0",
                    }}
                  >
                    <nav>
                      <ul className="pagination" style={{ margin: 0 }}>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <li
                            key={index + 1}
                            className={`page-item ${
                              index + 1 === currentPage ? "active" : ""
                            }`}
                            style={{ margin: "0 2px" }}
                          >
                            <button
                              onClick={() => handlePageChange(index + 1)}
                              className="page-link"
                              style={{
                                backgroundColor:
                                  index + 1 === currentPage
                                    ? "#FF902F"
                                    : "#fff",
                                borderColor:
                                  index + 1 === currentPage
                                    ? "#FF902F"
                                    : "#dee2e6",
                                color:
                                  index + 1 === currentPage
                                    ? "#fff"
                                    : "#373B3E",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.25rem",
                                border: "1px solid",
                                cursor: "pointer",
                                fontSize: "1rem",
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
        <Modal show={showOvertimeModal} onHide={handleCloseOvertimeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Overtime Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="overtimeType">Select Overtime Type:</label>
              <select
                id="overtimeType"
                className="form-control"
                value={overtimeType}
                onChange={(e) => setOvertimeType(e.target.value)}
              >
                <option value="">-- Choose Type --</option>
                <option value="noon_overtime">Lunch Overtime</option>
                <option value="30m_overtime">30 Minutes Overtime</option>
                <option value="1h_overtime">1 Hour Overtime</option>
                <option value="1h30_overtime">1.5 Hours Overtime</option>
                <option value="2h_Overtime">2 Hours Overtime</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="overtimeReason">Reason:</label>
              <textarea
                id="overtimeReason"
                className="form-control"
                rows="3"
                value={overtimeReason}
                onChange={(e) => setOvertimeReason(e.target.value)}
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseOvertimeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleOvertimeSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AttendenceAdmin;
