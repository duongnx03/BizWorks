import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";

const AddSalaryModal = ({ onAddSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [error, setError] = useState({});
  const closeButtonRef = useRef(null); // Ref to access the close button

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
    const fetchDepartmentsAndEmployees = async () => {
      try {
        const [departmentsResponse, employeesResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/departments", { withCredentials: true }),
          axios.get("http://localhost:8080/api/employee/getAllEmployees", { withCredentials: true })
        ]);

        const departmentOptions = departmentsResponse.data.map((dept) => ({
          value: dept.id,
          label: dept.name,
          positions: dept.positions.map((pos) => ({
            value: pos.id,
            label: pos.positionName,
          })),
        }));
        setDepartments(departmentOptions);

        const employeeOptions = employeesResponse.data.data.map((emp) => ({
          value: emp.id,
          label: `${emp.fullname} - ${emp.empCode}`,
          department: emp.department, // Use department name
        }));
        setEmployees(employeeOptions);
        setFilteredEmployees(employeeOptions); // Initialize filtered employees

        // Debug log to check the structure
        console.log("Fetched Employees:", employeeOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDepartmentsAndEmployees();

    // Set current month as default
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-indexed month
    const defaultMonthOption = months.find(month => month.value === currentMonth);
    setSelectedMonth(defaultMonthOption); // Set current month as default
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (selectedDepartment) {
      // Filter based on department name instead of departmentId
      const filtered = employees.filter(emp => emp.department === selectedDepartment.label);
      console.log("Filtered Employees:", filtered); // Debug log to see filtered employees
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
    const newErrors = {};
    
    if (selectedEmployees.length === 0) {
      newErrors.employees = "Please select at least one employee.";
    }
    
    if (!selectedMonth) {
      newErrors.month = "Please select a month.";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const employeeIds = selectedEmployees.map(emp => emp.value);

        const response = await axios.post("http://localhost:8080/api/salaries", {
          employees: employeeIds.map(id => ({ id })),
          month: selectedMonth.value,
        }, {
          withCredentials: true,
        });

        console.log("API Response:", response.data);

        if (onAddSuccess) {
          onAddSuccess();
        }

        // Close the modal
        if (closeButtonRef.current) {
          closeButtonRef.current.click(); // Simulate a click on the close button to close the modal
        }

      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError({ submit: error.response.data.message });
        } else {
          setError({ submit: "Failed to submit data. Please try again." });
        }
      }
    }
  };

  const handleSelectAll = () => {
    setSelectedEmployees(filteredEmployees);
  };

  return (
    <div id="add_salary" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
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
                  {error.department && <p className="text-danger">{error.department}</p>}
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
                  {error.employees && <p className="text-danger">{error.employees}</p>}
                  <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={handleSelectAll}
                    disabled={!selectedDepartment} // Disable "Select All" button if no department selected
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
              </div>
              {error.submit && <p className="text-danger">{error.submit}</p>}
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

export default AddSalaryModal;
