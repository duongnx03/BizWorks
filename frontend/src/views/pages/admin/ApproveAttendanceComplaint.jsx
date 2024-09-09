import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";

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

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const ApproveAttendanceComplaint = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    fullname: "",
    attendanceDate: null,
    status: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [showApproveModel, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingSend, setLoadingSend] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  console.log(filteredData);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/complaint/getByCensor",
        { withCredentials: true }
      );
      const data = response.data.data;

      if (data) {
        setData(data); // Lưu trữ tất cả các record
        setFilteredData(data); // Cập nhật dữ liệu đã lọc để hiển thị
      }
    } catch (e) {
      console.log("Error fetching attendance complaint: ", e);
    }
  };

  useEffect(() => {
    const { fullname, attendanceDate, status } = filters;
    let tempData = data;

    if (fullname) {
      tempData = tempData.filter((complaint) =>
        complaint.employee.empCode
          .toLowerCase()
          .includes(fullname.toLowerCase())
      );
    }

    if (attendanceDate) {
      const formattedDate = attendanceDate.format("YYYY-MM-DD");
      tempData = tempData.filter(
        (complaint) => complaint.attendanceDate === formattedDate
      );
    }

    if (status) {
      tempData = tempData.filter(
        (complaint) =>
          complaint.status.toLowerCase() === status.label.toLowerCase()
      );
    }
    setFilteredData(tempData);
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      fullname: "",
      attendanceDate: null,
      status: null,
    });
    setInputValue("");
    setFocused(false);
    fetchAttendanceData();
  };

  const handleImageClick = (imagePaths) => {
    const imageArray = imagePaths.split(",");
    setImages(imageArray);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleApproveClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
  };

  const handleApproveConfirm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this complaint?"
    );
    if (confirmed) {
      try {
        setLoadingSend(true);
        await axios.post(
          `http://localhost:8080/api/complaint/approve`,
          {
            id: selectedComplaint.id,
            checkInTime: formatDate(checkInTime),
            checkOutTime: formatDate(checkOutTime),
          },
          { withCredentials: true }
        );
        await fetchAttendanceData();
        toast.success("Successfully");
        handleCloseApproveModal();
      } catch (error) {
        toast.error("Something wrong!");
      } finally {
        setLoadingSend(false);
      }
    }
  };

  const handleRejectClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this complaint?"
    );

    if (confirmed) {
      try {
        setLoadingSend(true);
        await axios.post(
          "http://localhost:8080/api/complaint/reject",
          {
            id: selectedComplaint.id,
            description: rejectReason,
          },
          { withCredentials: true }
        );
        await fetchAttendanceData(); // Fetch data again after rejection
        setRejectReason(""); // Reset reject reason after successful rejection
        handleCloseRejectModal(); // Close modal after success
        toast.success("Successfully");
      } catch (error) {
        toast.error("Something wrong!");
      } finally {
        setLoadingSend(false);
      }
    }
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleLabelClick = () => {
    setFocused(true);
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFilters((prevFilters) => ({ ...prevFilters, fullname: value }));
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };

  const handleDateChange = (date) => {
    setFilters((prevFilters) => ({ ...prevFilters, attendanceDate: date }));
  };

  const handleStatusChange = (selectedOption) => {
    setFilters((prevFilters) => ({ ...prevFilters, status: selectedOption }));
  };

  const options = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Rejected" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Attendance Complaint Report"
            title="Dashboard"
            subtitle="Attendance Complaint Report"
            modal="#"
          />
          <div className="row filter-row space">
            <div className="col-sm-6 col-md-3">
              <div
                className={
                  focused || inputValue !== ""
                    ? "input-block form-focus focused"
                    : "input-block form-focus"
                }
              >
                <input
                  type="text"
                  className="form-control floating"
                  value={inputValue}
                  onFocus={handleLabelClick}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                />
                <label className="focus-label" onClick={handleLabelClick}>
                  Employee Code
                </label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="input-block form-focus select-focus">
                <DatePicker
                  placeholder="From Date"
                  className="form-control floating"
                  format="YYYY-MM-DD"
                  value={filters.attendanceDate}
                  onChange={handleDateChange}
                />
                <label className="focus-label">Date Complaint</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="input-block form-focus select-focus">
                <Select
                  options={options}
                  placeholder="Select"
                  styles={customStyles}
                  value={filters.status}
                  onChange={handleStatusChange}
                />
                <label className="focus-label">Status</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 d-flex align-items-center justify-content-end">
              {filters.fullname || filters.attendanceDate || filters.status ? (
                <button
                  type="button"
                  className="btn btn-clear"
                  title="Clear Filters"
                  onClick={handleClearFilters}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#FF902F",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  <FaTimes />
                </button>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 table-responsive">
              {filteredData.length ? (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee Infomation</th>
                      <th>Attendance Date</th>
                      <th>Check In Time</th>
                      <th>Break Start</th>
                      <th>Break End</th>
                      <th>Check Out Time</th>
                      <th>Total Time</th>
                      <th>Office Hours</th>
                      <th>Overtime</th>
                      <th>Note</th>
                      <th>Complaint Reason</th>
                      <th>Proof Images</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((complaint) => (
                      <tr key={complaint.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Link
                              to={`/client-profile/${complaint.employee.id}`}
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
                                    complaint.employee.avatar ||
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
                                to={`/client-profile/${complaint.employee.id}`}
                                className="text-decoration-none fw-bold text-dark"
                              >
                                {complaint.employee.empCode} -{" "}
                                {complaint.employee.fullname}
                              </Link>
                              <div className="mt-1">
                                <span className="d-block fw-semibold">
                                  {complaint.employee.department}
                                </span>
                                <span className="d-block text-muted">
                                  {complaint.employee.position}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {new Date(complaint.attendanceDate).toDateString()}
                        </td>
                        <td>{formatTimeAMPM(complaint.checkInTime)}</td>
                        <td>
                          {complaint.overTimes &&
                          complaint.overTimes.type === "noon_overtime"
                            ? "N/A"
                            : formatTimeAMPM(complaint.breakTimeStart)}
                        </td>
                        <td>
                          {complaint.overTimes &&
                          complaint.overTimes.type === "noon_overtime"
                            ? "N/A"
                            : formatTimeAMPM(complaint.breakTimeEnd)}
                        </td>
                        <td>{formatTimeAMPM(complaint.checkOutTime)}</td>
                        <td>{formatTime(complaint.totalTime)}</td>
                        <td>{formatTime(complaint.officeHours)}</td>
                        <td>
                          {complaint.overtime
                            ? formatTime(complaint.overtime)
                            : "N/A"}
                        </td>
                        <td>
                          {complaint.overTimes
                            ? getType(complaint.overTimes.type)
                            : "N/A"}
                        </td>
                        <td>{complaint.complaintReason}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleImageClick(complaint.imagePaths)
                            }
                          >
                            View Images
                          </button>
                        </td>
                        <td
                          className={`text-center ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
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
                                onClick={() => handleApproveClick(complaint)}
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
                                onClick={() => handleRejectClick(complaint)}
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
              ) : (
                <p className="alert alert-warning">
                  No data available for the selected filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {images.map((image, index) => (
              <Col
                key={index}
                xs={6}
                md={3}
                className="d-flex align-items-center justify-content-center mb-3"
              >
                <img
                  src={image}
                  alt={`Proof ${index + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showApproveModel} onHide={handleCloseApproveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Check Out Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {selectedComplaint && (
              <div className="col-sm-12 mb-3">
                <label className="col-form-label">Complaint Date</label>
                <DatePicker
                  selected={selectedComplaint.attendanceDate}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  readOnly
                />
              </div>
            )}
            {selectedComplaint && (
              <div className="col-sm-6 mb-3">
                <label className="col-form-label">Default Check-In Time</label>
                <DatePicker
                  selected={selectedComplaint.checkInTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="HH:mm"
                  className="form-control"
                  readOnly
                />
              </div>
            )}
            {selectedComplaint && (
              <div className="col-sm-6 mb-3">
                <label>Default Check-Out Time</label>
                <DatePicker
                  selected={selectedComplaint.checkOutTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="HH:mm"
                  className="form-control"
                  readOnly
                />
              </div>
            )}
            <div className="col-sm-6 mb-3">
              <label className="col-form-label">Select Check-In Time</label>
              <DatePicker
                selected={checkInTime}
                onChange={setCheckInTime}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="HH:mm"
                className="form-control"
                placeholderText="Select check-in time"
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label>Select Check-Out Time</label>
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
            {selectedComplaint && selectedComplaint.overTimes && (
              <div className="col-sm-12 mb-3">
                <label className="col-form-label">Note</label>
                <input
                  type="text"
                  className="form-control"
                  value={getType(selectedComplaint.overTimes.type)}
                  readOnly
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseApproveModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleApproveConfirm}>
            {loadingSend ? (
              <ClipLoader size={20} color={"#ffffff"} loading={true} />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

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

export default ApproveAttendanceComplaint;
