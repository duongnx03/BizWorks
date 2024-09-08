import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import axios from "axios";
import { Modal, Button, Row, Col } from "react-bootstrap";

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

const AttendanceComplaint = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/complaint/getByEmail",
          { withCredentials: true }
        );
        const data = response.data.data;
        if (data) {
          setData(data);
        }
      } catch (e) {
        console.log("Error fetch attendance complaint: ", e);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleImageClick = (imagePaths) => {
    const imageArray = imagePaths.split(",");
    setImages(imageArray);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Attendance Complaint"
            title="Dashboard"
            subtitle="Attendance Complaint"
            modal="#"
          />
          <div className="row">
            <div className="col-md-12">
              {data.length ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
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
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((complaint) => (
                        <tr key={complaint.id}>
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
                          <td>{formatTime(complaint.overtime)}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-warning">No data found</div>
              )}
            </div>
          </div>
        </div>
        {/* /Page Content */}
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
    </>
  );
};

export default AttendanceComplaint;
