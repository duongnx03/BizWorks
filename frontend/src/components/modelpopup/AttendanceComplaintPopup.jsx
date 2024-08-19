import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AttendanceComplaintPopup = ({ show, onClose }) => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [requestedBreakTimeStart, setRequestedBreakTimeStart] = useState(null);
  const [requestedBreakTimeEnd, setRequestedBreakTimeEnd] = useState(null);
  const [requestedCheckOutTime, setRequestedCheckOutTime] = useState(null);
  const [complaintDate, setComplaintDate] = useState(null);
  const [complaintReason, setComplaintReason] = useState("");
  const [status, setStatus] = useState("");
  const [proofImage, setProofImage] = useState(null); // State cho ảnh chứng minh

  const handleDateChange = (field, date) => {
    switch (field) {
      case "checkInTime":
        setCheckInTime(date);
        break;
      case "requestedBreakTimeStart":
        setRequestedBreakTimeStart(date);
        break;
      case "requestedBreakTimeEnd":
        setRequestedBreakTimeEnd(date);
        break;
      case "requestedCheckOutTime":
        setRequestedCheckOutTime(date);
        break;
      case "complaintDate":
        setComplaintDate(date);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    setProofImage(e.target.files[0]); // Lưu file ảnh vào state
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    // Thực hiện xử lý submit tại đây
    // Có thể gửi proofImage cùng với các dữ liệu khác
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
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
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Check-In Time</label>
                  <DatePicker
                    selected={checkInTime}
                    onChange={(date) => handleDateChange("checkInTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy HH:mm"
                    className="form-control"
                    placeholderText="Select check-in time"
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Break Time Start</label>
                  <DatePicker
                    selected={requestedBreakTimeStart}
                    onChange={(date) => handleDateChange("requestedBreakTimeStart", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy HH:mm"
                    className="form-control"
                    placeholderText="Select break time start"
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Break Time End</label>
                  <DatePicker
                    selected={requestedBreakTimeEnd}
                    onChange={(date) => handleDateChange("requestedBreakTimeEnd", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy HH:mm"
                    className="form-control"
                    placeholderText="Select break time end"
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Check-Out Time</label>
                  <DatePicker
                    selected={requestedCheckOutTime}
                    onChange={(date) => handleDateChange("requestedCheckOutTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy HH:mm"
                    className="form-control"
                    placeholderText="Select check-out time"
                  />
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Complaint Date</label>
                  <DatePicker
                    selected={complaintDate}
                    onChange={(date) => handleDateChange("complaintDate", date)}
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    placeholderText="Select complaint date"
                  />
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Complaint Reason</label>
                  <textarea
                    className="form-control"
                    value={complaintReason}
                    onChange={(e) => setComplaintReason(e.target.value)}
                    placeholder="Enter complaint reason"     
                  />
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Upload Proof Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Enter status"
                  />
                </div>
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceComplaintPopup;
