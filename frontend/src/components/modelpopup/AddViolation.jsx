import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import { base_url } from "../../base_urls";
import { Modal } from "bootstrap";  // Import Bootstrap modal if not already

const AddViolation = ({ onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedViolationType, setSelectedViolationType] = useState(null);
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [violationTypes, setViolationTypes] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${base_url}/api/employee/getAllEmployees`, { withCredentials: true });
        const data = response.data.data.map(emp => ({
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
        const response = await axios.get(`${base_url}/api/violation-types`, { withCredentials: true });
        const data = response.data.map(vt => ({ value: vt.id, label: vt.type }));
        setViolationTypes(data);
      } catch (error) {
        console.error("Error fetching violation types:", error);
      }
    };

    fetchEmployees();
    fetchViolationTypes();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường cần thiết chưa được chọn
    if (!selectedEmployee || !selectedViolationType || !selectedDate) {
      alert("Please fill out all required fields");
      return;
    }

    // Chuyển đổi selectedDate sang định dạng yyyy-MM-dd
    const formattedDate = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : null;

    const violation = {
      employee: { id: selectedEmployee?.value },
      violationType: { id: selectedViolationType?.value },
      violationDate: formattedDate,
      description,
    };

    try {
      await axios.post(`${base_url}/api/violations`, violation, { withCredentials: true });
      onAdd(violation);

      // Đóng modal sử dụng Bootstrap Modal API
      const modalElement = document.getElementById('add_violation');
      const modalInstance = Modal.getInstance(modalElement); // Lấy instance modal
      if (modalInstance) {
        modalInstance.hide();  // Đóng modal
      }
      
    } catch (error) {
      console.error("Error adding violation:", error);
      alert("Error occurred while submitting the form.");
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
    <div id="add_violation" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Violation</h5>
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
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                >
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

export default AddViolation;
