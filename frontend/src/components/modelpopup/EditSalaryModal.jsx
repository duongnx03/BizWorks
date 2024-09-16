import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { base_url } from "../../base_urls";

const EditSalaryModal = ({ salaryId, onUpdateSuccess, onClose, userRole }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [basic, setBasic] = useState("");
  const [bonus, setBonus] = useState("");
  const [allowance, setAllowance] = useState("");
  const [advanceSalary, setAdvanceSalary] = useState("");
  const [deductions, setDeductions] = useState("");
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const closeButtonRef = useRef(null); // Ref to access the close button

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
      const response = await axios.get(`${base_url}/api/employee/getAllEmployees`, {
        withCredentials: true,
      });
      setEmployees(
        response.data.data.map((employee) => ({
          value: employee.id,
          label: employee.fullname,
        }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchSalaryData = async (id) => {
    setLoading(true);
    try {
      if (departments.length === 0 || employees.length === 0) {
        // If data is not loaded yet, wait or handle the error
        console.warn('Departments or employees data not loaded yet.');
        return;
      }

      const response = await axios.get(`${base_url}/api/salaries/${id}`, {
        withCredentials: true,
      });
      const data = response.data.data;
      console.log('Fetched Salary Data:', data);
      setSelectedDepartment(
        departments.find(dep => dep.value === data.departmentId) || null
      );
      setSelectedEmployee(
        employees.find(emp => emp.value === data.employeeId) || null
      );
      setBasic(data.basic || "");
      setBonus(data.bonus || "");
      setAllowance(data.allowance || "");
      setAdvanceSalary(data.advanceSalary || "");
      setDeductions(data.violations || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedSalary = {
      departmentId: selectedDepartment ? selectedDepartment.value : null,
      employeeId: selectedEmployee ? selectedEmployee.value : null,
      basic,
      bonus,
      allowance,
      advanceSalary,
      deductions,
    };
    try {
      await axios.put(`${base_url}/api/salaries/${salaryId}`, updatedSalary, {
        withCredentials: true,
      });
      if (onUpdateSuccess) onUpdateSuccess();
      // Close the modal
      if (closeButtonRef.current) {
        closeButtonRef.current.click(); // Simulate a click on the close button to close the modal
      }
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  useEffect(() => {
    if (!salaryId) {
      // Manually trigger closing if salaryId is not provided
      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }
    }
  }, [salaryId]);

  return (
    <div
      id="edit_salary"
      className="modal custom-modal fade"
      role="dialog"
      tabIndex="-1"
      aria-labelledby="editSalaryModalLabel"
      aria-hidden={!salaryId}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Staff Salary</h5>
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
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Select Department</label>
                    <Select
                      placeholder="Select"
                      options={departments}
                      value={selectedDepartment}
                      onChange={setSelectedDepartment}
                      className="select"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Select Staff</label>
                    <Select
                      placeholder="Select"
                      options={employees}
                      value={selectedEmployee}
                      onChange={setSelectedEmployee}
                      className="select"
                      styles={customStyles}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <h4 className="text-primary">Earnings</h4>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Basic</label>
                    <input
                      className="form-control"
                      type="text"
                      value={basic}
                      onChange={(e) => setBasic(e.target.value)}
                    />
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Bonus</label>
                    <input
                      className="form-control"
                      type="text"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                    />
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Allowance</label>
                    <input
                      className="form-control"
                      type="text"
                      value={allowance}
                      onChange={(e) => setAllowance(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <h4 className="text-primary">Deductions</h4>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Advance Salary</label>
                    <input
                      className="form-control"
                      type="text"
                      value={advanceSalary}
                      onChange={(e) => setAdvanceSalary(e.target.value)}
                    />
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Violations</label>
                    <input
                      className="form-control"
                      type="text"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                      disabled={userRole === "LEADER"} // Disable the input for LEADER role
                    />
                  </div>
                </div>
              </div>
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Submit"}
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
