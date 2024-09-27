import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { Spin, notification } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { base_url } from "../../base_urls";

const openNotificationWithError = (message) => {
  notification.error({
    message: "Error",
    description: <span style={{ color: "#ed2d33" }}>{message}</span>,
    placement: "topRight",
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
    placement: "topRight",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  });
};

const AddSalaryModal = ({ onAddSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [createdBy, setCreatedBy] = useState("Duong Manage");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [error, setError] = useState({});
  const closeButtonRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [departmentsResponse, employeesResponse] = await Promise.all([
          axios.get(`${base_url}/api/departments`, { withCredentials: true }),
          axios.get(`${base_url}/api/employee/getAllEmployees`, {
            withCredentials: true,
          }),
        ]);

        // Xử lý departments
        if (
          departmentsResponse.data &&
          Array.isArray(departmentsResponse.data)
        ) {
          const departmentOptions = departmentsResponse.data.map((dept) => ({
            value: dept.id,
            label: dept.departmentName,
            positions: Array.isArray(dept.positions)
              ? dept.positions.map((pos) => ({
                  value: pos.id,
                  label: pos.positionName,
                }))
              : [],
          }));
          setDepartments(departmentOptions);
        }
        const employeeOptions = employeesResponse.data.data.map((emp) => ({
          value: emp.id,
          label: `${emp.fullname} - ${emp.empCode}`,
          department: emp.department,
        }));
        setEmployees(employeeOptions);
        setFilteredEmployees(employeeOptions);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    // Set current month as default
    const currentMonth = new Date().getMonth() + 1;
    const defaultMonthOption = months.find(
      (month) => month.value === currentMonth
    );
    setSelectedMonth(defaultMonthOption);
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const filtered = employees.filter(
        (emp) => emp.department === selectedDepartment.label
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [selectedDepartment, employees]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};

    if (selectedEmployees.length === 0) {
      newErrors.employees = "Please select at least one employee.";
    }

    if (!selectedMonth) {
      newErrors.month = "Please select a month.";
    } else {
      const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1; // Tháng kế tiếp
  
      // Kiểm tra xem tháng đã chọn có hợp lệ không
      if (selectedMonth.value !== currentMonth && selectedMonth.value !== nextMonth) {
        newErrors.month = "Month must be the current month or the next month.";
      }
    }

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const employeeIds = selectedEmployees.map((emp) => emp.value);
        const finalCreatedBy =
          createdBy.trim() === "" ? "Human Resources" : createdBy;

        const response = await axios.post(
          "http://localhost:8080/api/salaries",
          {
            employees: employeeIds.map((id) => ({ id })),
            month: selectedMonth.value,
            createdBy: finalCreatedBy,
          },
          {
            withCredentials: true,
          }
        );

        console.log("API Response:", response.data);

        // Show success notification
        openNotificationWithSuccess("Salary added successfully!");

        if (onAddSuccess) {
          onAddSuccess();
        }

        if (closeButtonRef.current) {
          closeButtonRef.current.click();
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to submit data. Please try again.";
        setError({ submit: errorMessage });
        // Show error notification
        openNotificationWithError(errorMessage);
      }
    }

    setIsSubmitting(false);
  };

  const handleSelectAll = () => {
    setSelectedEmployees(filteredEmployees);
  };

  return (
    <div id="add_salary" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Staff Salary</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeButtonRef} // Ref for the close button
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Select Department</label>
                  <Select
                    options={departments}
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                    placeholder="Select Department"
                    styles={customStyles}
                  />
                  {error.department && (
                    <p className="text-danger">{error.department}</p>
                  )}
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Select Staff</label>
                  <Select
                    isMulti
                    options={filteredEmployees}
                    value={selectedEmployees}
                    onChange={setSelectedEmployees}
                    className="select"
                    styles={customStyles}
                    isDisabled={!selectedDepartment} // Disable if no department selected
                  />
                  {error.employees && (
                    <p className="text-danger">{error.employees}</p>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={handleSelectAll}
                    disabled={
                      !selectedDepartment || filteredEmployees.length === 0
                    }
                  >
                    Select All
                  </button>
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Select Month</label>
                  <Select
                    placeholder="Select month"
                    options={months}
                    value={selectedMonth} // Default to current month
                    onChange={setSelectedMonth}
                    className="select"
                    styles={customStyles}
                  />
                  {error.month && <p className="text-danger">{error.month}</p>}
                </div>
                <div className="col-sm-12 mb-3">
                  <label className="col-form-label">Created By</label>
                  <input
                    type="text"
                    className="form-control"
                    value={createdBy}
                    readOnly 
                  />
                  {error.createdBy && (
                    <p className="text-danger">{error.createdBy}</p>
                  )}
                </div>
              </div>
              {error.submit && <p className="text-danger">{error.submit}</p>}
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spin size="small" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalaryModal;
