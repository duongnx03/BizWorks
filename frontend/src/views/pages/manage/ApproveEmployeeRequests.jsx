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

const ApproveEmployeeRequests = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedReject, setSelectedReject] = useState(null);
  const [loadingSend, setLoadingSend] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/emp-queue/getByCensor",
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

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const handleApproveClick = async (complaint) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve the request to create a new employee?"
    );
    if (confirmed) {
      try {
        setLoadingSend(true);
        await axios.post(
          `http://localhost:8080/api/auth/approve/${complaint.id}`,
          null,
          { withCredentials: true }
        );
        toast.success("Successfully");
        await fetchEmployees(); // Fetch data again after approval
      } catch (error) {
        toast.error("Something wrong");
      } finally {
        setLoadingSend(false);
      }
    }
  };

  const handleRejectClick = (employee) => {
    setSelectedReject(employee);
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
        `http://localhost:8080/api/auth/reject/${selectedReject.id}`,
        null,
        {
          params: {
            reason: rejectReason,
          },
          withCredentials: true,
        }
      );
      await fetchEmployees();
      handleCloseRejectModal();
      setRejectReason("");
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
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Employee Infomation</th>
                            <th>Email</th>
                            <th>Start Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Request Sender</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentEmployees.map((employee) => (
                            <tr key={employee.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Link
                                    to={`/client-profile/${employee.id}`}
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
                                          employee.avatar ||
                                          "default-avatar.png"
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
                                      to={`/client-profile/${employee.id}`}
                                      className="text-decoration-none fw-bold text-dark"
                                    >
                                      {employee.empCode} - {employee.fullname}
                                    </Link>
                                    <div className="mt-1">
                                      <span className="d-block fw-semibold">
                                        {employee.departmentName}
                                      </span>
                                      <span className="d-block text-muted">
                                        {employee.positionName}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{employee.email}</td>
                              <td>
                                {new Date(
                                  employee.startDate
                                ).toLocaleDateString()}
                              </td>
                              <td>{employee.description}</td>
                              <td
                                className={`text-center ${getStatusStyle(
                                  employee.status
                                )}`}
                              >
                                {employee.status}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Link
                                    to={`/client-profile/${employee.sender.employee.id}`}
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
                                          employee.avatar ||
                                          "default-avatar.png"
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
                                      to={`/client-profile/${employee.sender.employee.id}`}
                                      className="text-decoration-none fw-bold text-dark"
                                    >
                                      {employee.sender.employee.empCode} -{" "}
                                      {employee.sender.employee.fullname}
                                    </Link>
                                    <div className="mt-1">
                                      <span className="d-block fw-semibold">
                                        {employee.sender.employee.department}
                                      </span>
                                      <span className="d-block text-muted">
                                        {employee.sender.employee.position}
                                      </span>
                                    </div>
                                  </div>
                                </div>
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
                                    <p
                                      className="dropdown-item text-success"
                                      onClick={() =>
                                        handleApproveClick(employee)
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
                                        handleRejectClick(employee)
                                      }
                                    >
                                      Reject
                                    </p>
                                  </div>
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

export default ApproveEmployeeRequests;
