import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";

const MissedCheckOutCorrection = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [loadingSend, setLoadingSend] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/missedCheckOut/getAll",
        {
          withCredentials: true,
        }
      );
      if (response.data.data) {
        // Sắp xếp nhân viên theo ID từ mới đến cũ
        const sortedEmployees = response.data.data.sort((a, b) => b.id - a.id);
        setEmployees(sortedEmployees);
      }
      setLoading(false);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu nhân viên:", error);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee) => {
    setCurrentEmployeeId(employee.id);
    setEmployee(employee);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      setLoadingSend(true);
      await axios.post(
        `http://localhost:8080/api/missedCheckOut/approve/` + currentEmployeeId,
        null,
        {
          params: {
            checkOutTime: formatDate(checkOutTime),
          },
          withCredentials: true,
        }
      );
      toast.success("Checkout time updated successfully");
    } catch (error) {
      toast.error("Error updating checkout time");
    } finally {
      setLoadingSend(false);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEmployeeId(null);
    setEmployee(null);
    setCheckOutTime(new Date());
  };

  const sortedEmployees = React.useMemo(() => {
    return employees;
  }, [employees]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(sortedEmployees.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-info text-white";
      case "Approved":
        return "bg-success text-white";
      case "Rejected":
        return "bg-danger text-white";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Missed Checkout Correction"
            title="Dashboard"
            subtitle="Missed Checkout Correction"
          />
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                {loading ? (
                  <div className="alert alert-info">Loading...</div>
                ) : (
                  <>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Employee Infomation</th>
                          <th>Email</th>
                          <th>Attendance Date</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <Link
                                  to={`/client-profile/${employee.attendanceDTO.employee.id}`}
                                  className="me-3"
                                >
                                  <div
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      alt="Employee Avatar"
                                      src={
                                        employee.attendanceDTO.employee
                                          .avatar || "default-avatar.png"
                                      }
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  </div>
                                </Link>
                                <div>
                                  <Link
                                    to={`/client-profile/${employee.attendanceDTO.employee.id}`}
                                    className="text-decoration-none fw-bold text-dark"
                                  >
                                    {employee.attendanceDTO.employee.empCode} -{" "}
                                    {employee.attendanceDTO.employee.fullname}
                                  </Link>
                                  <div className="mt-1">
                                    <span className="d-block fw-semibold">
                                      {
                                        employee.attendanceDTO.employee
                                          .department
                                      }
                                    </span>
                                    <span className="d-block text-muted">
                                      {employee.attendanceDTO.employee.position}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{employee.attendanceDTO.employee.email}</td>
                            <td>{employee.attendanceDTO.attendanceDate}</td>
                            <td>{employee.description}</td>
                            <td
                              className={`text-center ${getStatusStyle(
                                employee.status
                              )}`}
                            >
                              {employee.status}
                            </td>
                            <td>
                              {!employee.attendanceDTO.checkOutTime && (
                                <button
                                  className="btn btn-primary me-2"
                                  onClick={() => handleOpenModal(employee)}
                                >
                                  Update Check Out Time
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                                }}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Check Out Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {employee && (
              <div className="col-sm-12 mb-3">
                <label className="col-form-label">Complaint Date</label>
                <DatePicker
                  selected={employee.attendanceDTO.attendanceDate}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  readOnly
                />
              </div>
            )}
            {employee && (
              <div className="col-sm-6 mb-3">
                <label className="col-form-label">Check-In Time</label>
                <DatePicker
                  selected={employee.attendanceDTO.checkInTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={1}
                  dateFormat="HH:mm"
                  className="form-control"
                  placeholderText="Select check-in time"
                  readOnly
                />
              </div>
            )}
            <div className="col-sm-6 mb-3">
              <label>Select Check Out Time</label>
              <DatePicker
                selected={checkOutTime}
                onChange={setCheckOutTime}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="HH:mm"
                className="form-control"
                placeholderText="Select check-out time"
              />
            </div>
            {employee && employee.overtimeDTO && (
              <div className="col-sm-12 mb-3">
                <label className="col-form-label">Note</label>
                <input
                  type="text"
                  className="form-control"
                  value={getType(employee.overtimeDTO.type)}
                  readOnly
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {loadingSend ? (
              <ClipLoader size={20} color={"#ffffff"} loading={true} />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MissedCheckOutCorrection;
