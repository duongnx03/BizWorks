import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import { base_url } from "../../base_urls";

const AddViolation = ({ violationData, onSave, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedViolationType, setSelectedViolationType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reason, setReason] = useState("");
  const [employees, setEmployees] = useState([]);
  const [violationTypes, setViolationTypes] = useState([]);

  useEffect(() => {
    // Fetch employees and violation types
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${base_url}/api/employee/getAllEmployees`, {withCredentials: true});
        const data = response.data.map(emp => ({ value: emp.id, label: emp.fullname }));
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchViolationTypes = async () => {
      try {
        const response = await axios.get(`${base_url}/api/violation-types` , {withCredentials: true});
        const data = response.data.map(vt => ({ value: vt.id, label: vt.type }));
        setViolationTypes(data);
      } catch (error) {
        console.error("Error fetching violation types:", error);
      }
    };

    fetchEmployees();
    fetchViolationTypes();
  }, []);

  useEffect(() => {
    // If editing, set the state with existing violation data
    if (violationData) {
      setSelectedDate(new Date(violationData.violationDate));
      setSelectedEmployee({ value: violationData.employeeId, label: violationData.employeeName });
      setSelectedViolationType({ value: violationData.violationTypeId, label: violationData.violationType });
      setSelectedStatus({ value: violationData.statusId, label: violationData.status });
      setReason(violationData.reason);
    }
  }, [violationData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const violation = {
      employeeId: selectedEmployee?.value,
      violationTypeId: selectedViolationType?.value,
      violationDate: selectedDate?.toISOString(),
      reason,
      status: selectedStatus?.label,
    };

    try {
      if (violationData) {
        // Edit existing violation
        await axios.put(`${base_url}/api/violations/${violationData.id}`, violation);
        onSave(violation);
      } else {
        // Add new violation
        await axios.post(`${base_url}/api/violations`, violation);
        onAdd(violation);
      }
    } catch (error) {
      console.error("Error saving violation:", error);
    }
  };

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
    <div>
      <div id="add_violation" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{violationData ? "Edit Violation" :"Add Violation"}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Select Employee <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={employees}
                    value={selectedEmployee}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={setSelectedEmployee}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Select Violation Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={violationTypes}
                    value={selectedViolationType}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={setSelectedViolationType}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={[
                      { value: 1, label: "Pending" },
                      { value: 2, label: "Resolved" },
                      { value: 3, label: "Rejected" },
                    ]}
                    value={selectedStatus}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={setSelectedStatus}
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                  >
                    {violationData ? "Save Changes" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div id="edit_violation" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Violation</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
              <div className="input-block mb-3">
                  <label className="col-form-label">
                    Select Employee <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={employees}
                    value={selectedEmployee}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={setSelectedEmployee}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Select Violation Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={violationTypes}
                    value={selectedViolationType}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={setSelectedViolationType}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    defaultValue={""}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={[
                      { value: 1, label: "Pending" },
                      { value: 2, label: "Resolved" },
                      { value: 3, label: "Rejected" },
                    ]}
                    value={selectedStatus}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={setSelectedStatus}
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddViolation;

