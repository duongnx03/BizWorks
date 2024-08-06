import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "react-datepicker/dist/react-datepicker.css";

const AllEmployeeAddPopup = ({ refreshEmployeeList }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const closeButtonRef = useRef(null);

  const roles = [
    { value: 'LEADER', label: 'Leader' },
    { value: 'EMPLOYEE', label: 'Employee' }
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case "fullname":
        if (!value) newErrors.fullname = "Full Name is required.";
        else delete newErrors.fullname;
        break;
      case "email":
        if (!value) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = "Email is invalid.";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required.";
        else if (value.length < 6) newErrors.password = "Password must be at least 6 characters.";
        else delete newErrors.password;
        break;
      case "role":
        if (!selectedRole) newErrors.role = "Role is required.";
        else delete newErrors.role;
        break;
      case "startDate":
        if (!value) newErrors.startDate = "Joining Date is required.";
        else delete newErrors.startDate;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "fullname":
        setFullname(value);
        validateField("fullname", value);
        break;
      case "email":
        setEmail(value);
        validateField("email", value);
        break;
      case "password":
        setPassword(value);
        validateField("password", value);
        break;
      case "role":
        setSelectedRole(value);
        validateField("role", value);
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setFullname("");
    setEmail("");
    setPassword("");
    setSelectedRole(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullname) newErrors.fullname = "Full Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Email is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!selectedRole) newErrors.role = "Role is required.";
    if (!selectedDate) newErrors.startDate = "Joining Date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const data = {
      fullname,
      email,
      password,
      role: selectedRole ? selectedRole.value : null,
      startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : null
    };

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", data, {
        withCredentials: true, // Enable cookies to be sent
      });
      console.log("Employee added:", response.data);
      await refreshEmployeeList(); // Call fetchEmployees after success
      setLoading(false);
      if (closeButtonRef.current) {
        resetForm();
        closeButtonRef.current.click();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div id="add_employee" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee</h5>
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
                <div className="row">
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={fullname}
                        onChange={(e) => handleChange("fullname", e.target.value)}
                        onBlur={() => validateField("fullname", fullname)}
                        required
                      />
                      {errors.fullname && <small className="text-danger">{errors.fullname}</small>}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => validateField("email", email)}
                        required
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => validateField("password", password)}
                        required
                      />
                      {errors.password && <small className="text-danger">{errors.password}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Role <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={roles}
                        value={selectedRole}
                        onChange={(role) => handleChange("role", role)}
                        onBlur={() => validateField("role", selectedRole)}
                        placeholder="Select Role"
                        styles={customStyles}
                      />
                      {errors.role && <small className="text-danger">{errors.role}</small>}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          className="form-control floating datetimepicker"
                          type="date"
                          dateFormat="dd-MM-yyyy"
                          onBlur={() => validateField("startDate", selectedDate)}
                        />
                      </div>
                      {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <ClipLoader size={20} color="#fff" /> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllEmployeeAddPopup;
