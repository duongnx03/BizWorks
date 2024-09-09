import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AttendanceComplaintPopup = ({ show, onClose, attendanceId }) => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakTimeStart, setBreakTimeStart] = useState(null);
  const [breakTimeEnd, setBreakTimeEnd] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [officeHours, setOfficeHours] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [type, setType] = useState(null);
  const [overtime, setOvertime] = useState(null);
  const [status, setStatus] = useState(null);
  const [complaintDate, setComplaintDate] = useState(null);
  const [complaintReason, setComplaintReason] = useState("");
  const [proofImages, setProofImages] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const resetState = () => {
    setCheckInTime(null);
    setBreakTimeStart(null);
    setBreakTimeEnd(null);
    setCheckOutTime(null);
    setOfficeHours(null);
    setOvertime(null);
    setStatus(null);
    setComplaintDate(null);
    setComplaintReason("");
    setProofImages([]);
    setPreviewImage([]);
    setIsReadOnly(false);
    setCanSubmit(true);
    setErrorMessage("");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "00:00";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (attendanceId) {
      // Step 1: Check if complaint data exists
      axios
        .get(
          `http://localhost:8080/api/complaint/getByAttendanceId/${attendanceId}`,
          { withCredentials: true }
        )
        .then((response) => {
          const data = response.data.data;
          if (data) {
            setCheckInTime(new Date(data.checkInTime));
            setBreakTimeStart(new Date(data.breakTimeStart));
            setBreakTimeEnd(new Date(data.breakTimeEnd));
            setCheckOutTime(new Date(data.checkOutTime));
            setComplaintDate(new Date(data.attendanceDate));
            setTotalTime(data.totalTime);
            setType(data.overtimeDTO.type);
            setOfficeHours(data.officeHours);
            setOvertime(data.overtime);
            setComplaintReason(data.complaintReason);
            setStatus(data.status);
            const imageUrls = data.imagePaths.split(",");
            setProofImages(imageUrls);
            setIsReadOnly(true);
          }
        })
        .catch((error) => {
          axios
            .get(
              `http://localhost:8080/api/attendance/getById/${attendanceId}`,
              { withCredentials: true }
            )
            .then((response) => {
              const data = response.data.data;
              setCheckInTime(new Date(data.checkInTime));
              setBreakTimeStart(new Date(data.breakTimeStart));
              setBreakTimeEnd(new Date(data.breakTimeEnd));
              setCheckOutTime(new Date(data.checkOutTime));
              setComplaintDate(new Date(data.attendanceDate));
              setOfficeHours(data.officeHours);
              setOvertime(data.overtime);
              setTotalTime(data.totalTime);
              setType(data.overtimeDTO.type);
              const currentDate = new Date();
              const dateDifference =
                (currentDate - new Date(data.attendanceDate)) /
                (1000 * 60 * 60 * 24);
              if (dateDifference > 3) {
                setIsReadOnly(true);
                setCanSubmit(false);
                setErrorMessage(
                  "You cannot file a complaint because it has been more than 3 days."
                );
              }
            })
            .catch((e) => {
              console.error("Error fetching attendance data:", e);
            });
          console.error("Error fetching complaint data:", error);
        });
    }
  }, [attendanceId]);

  useEffect(() => {
    if (!show) {
      resetState(); // Reset state when modal is closed
    }
  }, [show]);

  const handleDateChange = (field, date) => {
    switch (field) {
      case "checkInTime":
        setCheckInTime(date);
        break;
      case "breakTimeStart":
        setBreakTimeStart(date);
        break;
      case "breakTimeEnd":
        setBreakTimeEnd(date);
        break;
      case "checkOutTime":
        setCheckOutTime(date);
        break;
      default:
        break;
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setProofImages(files);
    setPreviewImage(imageUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("checkInTime", formatDate(checkInTime));
    formData.append("breakTimeStart", formatDate(breakTimeStart));
    formData.append("breakTimeEnd", formatDate(breakTimeEnd));
    formData.append("checkOutTime", formatDate(checkOutTime));
    formData.append(
      "attendanceDate",
      complaintDate.toISOString().split("T")[0]
    );
    formData.append("complaintReason", complaintReason);
    formData.append("attendanceId", attendanceId);
    proofImages.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    axios
      .post("http://localhost:8080/api/complaint/submit", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Complaint submitted successfully:", response.data);
        toast.success("Complaint submitted successfully");
        onClose();
      })
      .catch((error) => {
        console.error("Error submitting complaint:", error);
      });
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "Pending":
        return "btn btn-info";
      case "Approved":
        return "btn btn-success";
      case "Rejected":
        return "btn btn-danger";
      default:
        return "btn btn-secondary";
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

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Attendance Complaint</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-12 mb-3 d-flex justify-content-end">
                  {status && (
                    <div
                      className={`btn btn-sm ${getStatusButtonStyle(status)}`}
                    >
                      {status}
                    </div>
                  )}
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Complaint Date</label>
                  <DatePicker
                    selected={complaintDate}
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Check-In Time</label>
                  <DatePicker
                    selected={checkInTime}
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
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Break Time Start</label>
                  <DatePicker
                    selected={breakTimeStart}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="HH:mm"
                    className="form-control"
                    placeholderText="Select break time start"
                    readOnly
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Break Time End</label>
                  <DatePicker
                    selected={breakTimeEnd}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="HH:mm"
                    className="form-control"
                    placeholderText="Select break time end"
                    readOnly
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Check-Out Time</label>
                  <DatePicker
                    selected={checkOutTime}
                    onChange={(date) => handleDateChange("checkOutTime", date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="HH:mm"
                    className="form-control"
                    placeholderText="Select check-out time"
                    readOnly
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Total time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatTime(totalTime)}
                    readOnly
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Office Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatTime(officeHours)}
                    readOnly
                  />
                </div>
                {overtime && (
                  <div className="col-sm-6 mb-3">
                    <label className="col-form-label">Overtime</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formatTime(overtime)}
                      readOnly
                    />
                  </div>
                )}
                {type && (
                  <div className="col-sm-6 mb-3">
                    <label className="col-form-label">Note</label>
                    <input
                      type="text"
                      className="form-control"
                      value={getType(type)}
                      readOnly
                    />
                  </div>
                )}
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Complaint Reason</label>
                  <textarea
                    className="form-control"
                    value={complaintReason}
                    onChange={(e) => setComplaintReason(e.target.value)}
                    placeholder="Enter complaint reason"
                    readOnly={isReadOnly}
                  />
                </div>
                {proofImages.length > 0 && (
                  <>
                    <div className="col-sm-12 mb-3">
                      <label className="col-form-label">Proof Image</label>
                      <div className="row">
                        {proofImages.map((imageUrl, index) => (
                          <div className="col-4" key={index}>
                            <img
                              src={imageUrl}
                              alt={`Proof ${index + 1}`}
                              className="img-fluid rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {!isReadOnly && (
                  <div className="col-sm-12 mb-3">
                    <label className="col-form-label">Upload Proof Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImageChange}
                      multiple
                      readOnly={isReadOnly}
                    />
                  </div>
                )}
                {/* Hiển thị ảnh đã chọn */}
                <div className="col-sm-12 mb-3">
                  {previewImage.length > 0 && !isReadOnly && (
                    <div className="row mt-3">
                      {previewImage.map((imageUrl, index) => (
                        <div className="col-4" key={index}>
                          <img
                            src={imageUrl}
                            alt={`Proof ${index + 1}`}
                            className="img-fluid rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {!isReadOnly && (
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!canSubmit}
                  >
                    Submit Complaint
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
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

export default AttendanceComplaintPopup;
