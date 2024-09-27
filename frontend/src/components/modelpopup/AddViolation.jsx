import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import { base_url } from "../../base_urls";
import { Spin } from "antd";

const AddViolation = ({ onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedViolationType, setSelectedViolationType] = useState(null);
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [violationTypes, setViolationTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    employee: "",
    violationType: "",
    date: "",
    description: "",
  });
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${base_url}/api/departments`, { withCredentials: true });

        if (response.data && Array.isArray(response.data)) {
          const departmentOptions = response.data.map((dept) => ({
            value: dept.id,
            label: dept.departmentName,
            positions: Array.isArray(dept.positions) ? dept.positions.map((pos) => ({
              value: pos.id,
              label: pos.positionName,
            })) : [], 
          }));
        setDepartments(departmentOptions);
      } else {
        throw new Error("Unexpected response structure");
      }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchEmployeesByRole = async () => {
      try {
        const response = await axios.get(`${base_url}/api/employee/getEmployeesByRole`, { withCredentials: true });
        const employeeOptions = response.data.data.map((emp) => ({
          value: emp.id,
          label: `${emp.fullname} - ${emp.empCode}`,
          department: emp.department,
        }));
        setEmployees(employeeOptions);
        setFilteredEmployees(employeeOptions); // Initially set all employees
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchViolationTypes = async () => {
      try {
        const response = await axios.get(`${base_url}/api/violation-types`, { withCredentials: true });
        const violationOptions = response.data.map((vt) => ({
          value: vt.id,
          label: vt.type,
        }));
        setViolationTypes(violationOptions);
      } catch (error) {
        console.error("Error fetching violation types:", error);
      }
    };

    // Call the functions
    fetchDepartments();
    fetchEmployeesByRole();
    fetchViolationTypes();
  }, []);

  // Filter employees based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = employees.filter(emp => emp.department === selectedDepartment.label);
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees); // If no department selected, show all employees
    }
  }, [selectedDepartment, employees]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      employee: "",
      violationType: "",
      date: "",
      description: "",
    };

    if (!selectedEmployee) {
      newErrors.employee = "Please select an employee.";
      valid = false;
    }
    if (!selectedViolationType) {
      newErrors.violationType = "Please select a violation type.";
      valid = false;
    }
    if (!selectedDate) {
      newErrors.date = "Please select a date.";
      valid = false;
    } else {
      const now = new Date();
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
  
      if (selectedDate > now) {
        newErrors.date = "The date cannot be in the future.";
        valid = false;
      } else if (selectedDate < oneYearAgo) {
        newErrors.date = "The date cannot be more than one year in the past.";
        valid = false;
      }
    }
    if (!description) {
      newErrors.description = "Please enter a description.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true); // Lock form during submission

    if (!validateForm()) {
      setIsSubmitting(false); // Unlock form if validation fails
      return;
    }

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
      const success = await onAdd(violation); // Gọi hàm onAdd
      if (success) {
        // Reset form only on success
        setSelectedEmployee(null);
        setSelectedViolationType(null);
        setSelectedDate(null);
        setDescription("");
        setErrors({
          employee: "",
          violationType: "",
          date: "",
          description: "",
        });

        // Close modal only on success
        if (closeButtonRef.current) {
          closeButtonRef.current.click();
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: "Failed to add violation. Please try again later.",
        }));
      }
    } catch (error) {
      console.error("Error adding violation:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Error adding violation. Please try again later.",
      }));
    } finally {
      setIsSubmitting(false); // Unlock form after submission
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
              ref={closeButtonRef}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="input-block mb-3">
                <label className="col-form-label">Select Department</label>
                <Select
                  options={departments}
                  value={selectedDepartment}
                  placeholder="Select Department"
                  styles={customStyles}
                  onChange={(selected) => {
                    setSelectedDepartment(selected);
                    // Clear any related error if needed
                  }}
                />
              </div>
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Select Employee <span className="text-danger">*</span>
                </label>
                <Select
                  options={filteredEmployees}
                  value={selectedEmployee}
                  placeholder="Select"
                  styles={customStyles}
                  onChange={(selected) => {
                    setSelectedEmployee(selected);
                    if (errors.employee) setErrors((prev) => ({ ...prev, employee: "" }));
                  }}
                  isDisabled={!selectedDepartment}
                />
                {errors.employee && (
                  <div className="text-danger">{errors.employee}</div>
                )}
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
                  onChange={(selected) => {
                    setSelectedViolationType(selected);
                    if (errors.violationType) setErrors((prev) => ({ ...prev, violationType: "" }));
                  }}
                />
                {errors.violationType && (
                  <div className="text-danger">{errors.violationType}</div>
                )}
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
                {errors.date && (
                  <div className="text-danger">{errors.date}</div>
                )}
              </div>
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                />
                {errors.description && (
                  <div className="text-danger">{errors.description}</div>
                )}
              </div>
              {errors.form && <div className="text-danger">{errors.form}</div>}
              <div className="submit-section">
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spin /> : "Add Violation"}
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
