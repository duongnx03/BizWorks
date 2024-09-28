import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { Spin, notification } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { base_url } from "../../base_urls";

const openNotificationWithError = (message) => {
  notification.error({
    message: "Error",
    description: <span style={{ color: "#ed2d33" }}>{message}</span>,
    placement: "top",
  });
};

const openNotificationWithSuccess = (message) => {
  notification.success({
    message: "Success",
    description: (
      <div>
        <span style={{ color: "#09b347" }}>{message}</span>
        <button
          onClick={() => notification.destroy()}
          style={{
            border: "none",
            background: "transparent",
            float: "right",
            cursor: "pointer",
          }}
        >
          <CloseCircleOutlined style={{ color: "#09b347" }} />
        </button>
      </div>
    ),
    placement: "top",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  });
};

const EditSalaryModal = ({ salaryId, onUpdateSuccess, onClose, userRole }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryCode, setSalaryCode] = useState("");
  const [month, setMonth] = useState("");
  const [basic, setBasic] = useState("0");
  const [bonus, setBonus] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [overtime, setOvertime] = useState("0");
  const [advanceSalary, setAdvanceSalary] = useState("0");
  const [deductions, setDeductions] = useState("0");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const closeButtonRef = useRef(null);

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (salaryId) {
      fetchSalaryData(salaryId);
    }
  }, [salaryId]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${base_url}/api/departments`, {
        withCredentials: true,
      });
      setDepartments(
        response.data.map((department) => ({
          value: department.id,
          label: department.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${base_url}/api/employee/getAllEmployees`,
        {
          withCredentials: true,
        }
      );
      setEmployees(
        response.data.data.map((employee) => ({
          value: employee.id,
          label: `${employee.fullname} - ${employee.empCode}`,
          department: employee.department,
        }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchSalaryData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/salaries/${id}`, {
        withCredentials: true,
      });
      const data = response.data.data;
      const employee = data.employees[0];

      setSelectedDepartment({
        value: employee.departmentId,
        label: employee.departmentName,
      });
      setSelectedEmployee({
        value: employee.id,
        label: `${employee.fullname} (${employee.empCode})`,
      });
      setSalaryCode(data.salaryCode || "");
      const selectedMonth = monthOptions.find(
        (option) => option.value === data.month.toString() // Convert to string
      );
      setMonth(selectedMonth ? selectedMonth.value : "");
      setBasic(data.basicSalary || "0");
      setBonus(data.bonusSalary || "0");
      setAllowance(data.allowances || "0");
      setOvertime(data.overtime || "0");
      setAdvanceSalary(data.advanceSalary || "0");
      setDeductions(data.deductions || "0");
      setStatus(data.status || "");
      setUpdatedBy(data.updatedBy || "");
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Error fetching salary data:", error);
    } finally {
      setLoading(false);
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

  const validateInputs = () => {
    const newErrors = {};
    const fields = {
      basic,
      bonus,
      allowance,
      overtime,
      advanceSalary,
      deductions,
    };

    Object.keys(fields).forEach((key) => {
      const value = parseFloat(fields[key]) || 0;
      if (value < 0) {
        newErrors[key] = "Value cannot be negative.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    const updatedSalary = {
      salaryCode,
      month,
      basicSalary: basic || "0",
      bonusSalary: bonus || "0",
      allowances: allowance || "0",
      overtime: overtime || "0",
      advanceSalary: advanceSalary || "0",
      deductions: deductions || "0",
      updatedBy: updatedBy || "Duong Manage",
      notes: notes || "",
    };

    try {
      await axios.put(`${base_url}/api/salaries/${salaryId}`, updatedSalary, {
        withCredentials: true,
      });

      openNotificationWithSuccess("Salary updated successfully!");

      if (onUpdateSuccess) onUpdateSuccess();

      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update salary. Please try again.";
      openNotificationWithError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="edit_salary"
      className="modal custom-modal fade"
      role="dialog"
      tabIndex="-1"
      aria-labelledby="editSalaryModalLabel"
      aria-hidden={!salaryId}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Staff Salary</h5>
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
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Department</label>
                    <Select
                      placeholder="Select"
                      options={departments}
                      value={selectedDepartment}
                      onChange={setSelectedDepartment}
                      className="select"
                      isDisabled
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Staff</label>
                    <Select
                      placeholder="Select"
                      options={employees}
                      value={selectedEmployee}
                      onChange={setSelectedEmployee}
                      className="select"
                      isDisabled
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Salary Code</label>
                    <input
                      className="form-control"
                      type="text"
                      value={salaryCode}
                      onChange={(e) => setSalaryCode(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Month</label>
                    <Select
                      placeholder="Select Month"
                      options={monthOptions}
                      value={monthOptions.find(
                        (option) => option.value === month
                      )}
                      onChange={(selectedOption) =>
                        setMonth(selectedOption.value)
                      }
                      className="select"
                      styles={customStyles}
                      isDisabled
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <h4 className="text-success">Earnings</h4>
                  {["basic", "bonus", "allowance", "overtime"].map((field) => (
                    <div className="input-block mb-3" key={field}>
                      <label className="col-form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          type="text"
                          value={eval(field)} // Access state using eval for brevity
                          onChange={(e) =>
                            eval(
                              `set${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }(e.target.value)`
                            )
                          }
                        />
                      </div>
                      {errors[field] && (
                        <div style={{ color: "red" }}>{errors[field]}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-sm-6">
                  <h4 className="text-danger">Deductions</h4>
                  {["advanceSalary", "deductions"].map((field) => (
                    <div className="input-block mb-3" key={field}>
                      <label className="col-form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          type="text"
                          value={eval(field)}
                          readOnly
                          onChange={(e) =>
                            eval(
                              `set${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }(e.target.value)`
                            )
                          }
                        />
                      </div>
                      {errors[field] && (
                        <div style={{ color: "red" }}>{errors[field]}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Status</label>
                    <input
                      className="form-control"
                      type="text"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Updater By</label>
                    <input
                      className="form-control"
                      type="text"
                      value={updatedBy}
                      onChange={(e) => setUpdatedBy(e.target.value)}
                      placeholder="Enter updater's name"
                      readOnly
                    />
                  </div>
                </div>
                <div className="input-block mb-3">
                    <label className="col-form-label">Notes</label>
                    <input
                      className="form-control"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
              </div>
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSalaryModal;
