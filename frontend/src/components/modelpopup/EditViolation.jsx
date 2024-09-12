import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import { base_url } from "../../base_urls";
import { format } from "date-fns";

const EditViolation = ({ violationData, onSave, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedViolationType, setSelectedViolationType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [violationTypes, setViolationTypes] = useState([]);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/employee/getAllEmployees`,
          { withCredentials: true }
        );
        const data = response.data.data.map((emp) => ({
          value: emp.id,
          label: `${emp.fullname} - ${emp.empCode}`,
        }));
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchViolationTypes = async () => {
      try {
        const response = await axios.get(`${base_url}/api/violation-types`, {
          withCredentials: true,
        });
        const data = response.data.map((vt) => ({
          value: vt.id,
          label: vt.type,
        }));
        setViolationTypes(data);
      } catch (error) {
        console.error("Error fetching violation types:", error);
      }
    };

    fetchEmployees();
    fetchViolationTypes();
  }, []);

  useEffect(() => {
    if (violationData && violationData.data) {
      const data = violationData.data;
      setSelectedDate(new Date(data.violationDate));
      setSelectedEmployee({
        value: data.employee.id,
        label: `${data.employee.fullname} - ${data.employee.empCode}`,
      });
      setSelectedViolationType({
        value: data.violationType.id,
        label: data.violationType.type,
      });
      setDescription(data.description);
      setSelectedStatus({ value: data.status, label: data.status });

      // Lưu dữ liệu gốc để so sánh
      setOriginalData({
        id: data.id,
        employee: { id: data.employee.id },
        violationType: { id: data.violationType.id },
        violationDate: data.violationDate,
        description: data.description,
        status: data.status,
      });
    }
  }, [violationData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedViolationType || !selectedDate || !description || !selectedStatus) {
      console.error("All fields are required");
      return;
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const updatedViolation = {
      id: violationData.data.id, // Đảm bảo ID được lấy đúng
      employee: { id: selectedEmployee.value },
      violationType: { id: selectedViolationType.value },
      violationDate: formattedDate,
      description: description,
      status: selectedStatus.value,
    };

    // So sánh dữ liệu mới với dữ liệu gốc
    if (JSON.stringify(updatedViolation) !== JSON.stringify(originalData)) {
      console.log("Updated Violation:", updatedViolation);
      onSave(updatedViolation);
      onClose();
      document.querySelector("#edit_violation .btn-close").click();
    } else {
      console.log("No changes detected.");
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
    container: (provided) => ({
      ...provided,
      marginBottom: "15px",
    }),
  };

  return (
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
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Employee <span className="text-danger">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    value={selectedEmployee ? selectedEmployee.label : ""}
                    readOnly
                    className="form-control"
                    aria-label="Employee"
                  />
                </div>
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
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <Select
                  options={[
                    { value: "Approved", label: "Approved" },
                    { value: "Rejected", label: "Rejected" },
                  ]}
                  value={selectedStatus}
                  placeholder="Select Status"
                  styles={customStyles}
                  onChange={setSelectedStatus}
                />
              </div>

              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditViolation;
