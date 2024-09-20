import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Button, Modal, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";

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

const getType = (type) => {
  switch (type) {
    case "noon_overtime":
      return "Overtime noon from 12h to 13h";
    case "30m_overtime":
      return "Overtime after work 30 minutes";
    case "1h_overtime":
      return "Overtime after work 1 hour";
    case "1h30_overtime":
      return "Overtime after work 1 hour 30 minutes";
    case "2h_overtime":
      return "Overtime after work 2 hours";
    default:
      return "Invalid type";
  }
};

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

const ApproveOvertimeRequests = () => {
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedReject, setSelectedReject] = useState(null);
  const [loadingSend, setLoadingSend] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;

  const fetchOvertimes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/overtime/getByCensor",
        {
          withCredentials: true,
        }
      );
      if (response.data.data) {
        // Sắp xếp nhân viên theo ID từ mới đến cũ
        const sortedEmployees = response.data.data.sort((a, b) => b.id - a.id);
        setOvertimes(sortedEmployees);
      }
      setLoading(false);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu nhân viên:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimes();
  }, []);

  const sortedOvetimes = React.useMemo(() => {
    return overtimes;
  }, [overtimes]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentOvetimes = sortedOvetimes.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(sortedOvetimes.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleApproveClick = async (overtime) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve the request to create a new employee?"
    );
    if (confirmed) {
      try {
        setLoadingSend(true);
        await axios.post(
          `http://localhost:8080/api/overtime/approveRequest/${overtime.id}`,
          null,
          { withCredentials: true }
        );
        await fetchOvertimes();
        toast.success("Successfully");
      } catch (error) {
        toast.error("Something wrong!");
      } finally {
        setLoadingSend(false);
      }
    }
  };

  const handleRejectClick = (overtime) => {
    setSelectedReject(overtime);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setLoadingSend(true);
      await axios.post(
        `http://localhost:8080/api/overtime/rejectRequest/${selectedReject.id}`,
        null,
        {
          params: {
            description: rejectReason,
          },
          withCredentials: true,
        }
      );
      await fetchOvertimes();
      setRejectReason("");
      handleCloseRejectModal();
      toast.success("Successfully");
    } catch (error) {
      toast.error("Something wrong!");
    } finally {
      setLoadingSend(false);
    }
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  return (
    <>
      <div>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs
              maintitle="Request Create Employee"
              title="Dashboard"
              subtitle="Request Create Employee"
            />
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  {loading ? (
                    <div className="alert alert-info">Loading...</div>
                  ) : (
                    <>
                      <table className="table table-striped table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Employee Information</th>
                            <th>Email</th>
                            <th>Attendance Date</th>
                            <th>Overtime Start</th>
                            <th>Overtime End</th>
                            <th>Check Out Time</th>
                            <th>Note</th>
                            <th>Reason for Overtime</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOvetimes.map((overtime) => (
                            <tr key={overtime.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Link
                                    to={`/client-profile/${overtime.attendanceDTO.employee.id}`}
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
                                          overtime.attendanceDTO.employee
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
                                      to={`/client-profile/${overtime.attendanceDTO.employee.id}`}
                                      className="text-decoration-none fw-bold text-dark"
                                    >
                                      {overtime.attendanceDTO.employee.empCode}{" "}
                                      -{" "}
                                      {overtime.attendanceDTO.employee.fullname}
                                    </Link>
                                    <div className="mt-1">
                                      <span className="d-block fw-semibold">
                                        {
                                          overtime.attendanceDTO.employee
                                            .department
                                        }
                                      </span>
                                      <span className="d-block text-muted">
                                        {
                                          overtime.attendanceDTO.employee
                                            .position
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{overtime.attendanceDTO.employee.email}</td>
                              <td>{overtime.attendanceDTO.attendanceDate}</td>
                              <td>{formatTime(overtime.overtimeStart)}</td>
                              <td>{formatTime(overtime.overtimeEnd)}</td>
                              <td>{formatTimeAMPM(overtime.checkOutTime)}</td>
                              <td>{getType(overtime.type)}</td>
                              <td>{overtime.reason}</td>
                              <td>{overtime.description}</td>
                              <td
                                className={`text-center ${getStatusStyle(
                                  overtime.status
                                )}`}
                              >
                                {overtime.status}
                              </td>
                              <td>
                                <div className="dropdown dropdown-action text-end">
                                  <Link
                                    to="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={() => {
                                      if (overtime.status !== "Pending") {
                                        // Hiển thị thông báo nếu đã Approved hoặc Rejected
                                        toast.info(
                                          "This request has already been processed."
                                        );
                                      }
                                    }}
                                    style={{
                                      pointerEvents:
                                        overtime.status !== "Pending"
                                          ? "none"
                                          : "auto",
                                      opacity:
                                        overtime.status !== "Pending" ? 0.5 : 1, // Làm mờ nút khi vô hiệu hóa
                                    }}
                                  >
                                    <i className="material-icons">more_vert</i>
                                  </Link>
                                  {overtime.status === "Pending" && (
                                    <div className="dropdown-menu dropdown-menu-right">
                                      <p
                                        className="dropdown-item text-success"
                                        onClick={() =>
                                          handleApproveClick(overtime)
                                        }
                                      >
                                        {loadingSend ? (
                                          <ClipLoader
                                            size={20}
                                            color={"#ffffff"}
                                            loading={true}
                                          />
                                        ) : (
                                          "Approve"
                                        )}
                                      </p>
                                      <p
                                        className="dropdown-item text-danger"
                                        onClick={() =>
                                          handleRejectClick(overtime)
                                        }
                                      >
                                        Reject
                                      </p>
                                    </div>
                                  )}
                                </div>
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
      </div>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={handleCloseRejectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="rejectReason">
              <Form.Label>Reason for Rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRejectModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectConfirm}>
            {loadingSend ? (
              <ClipLoader size={20} color={"#ffffff"} loading={true} />
            ) : (
              "Reject"
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
    </>
  );
};

export default ApproveOvertimeRequests;
