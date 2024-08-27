import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const AddSalaryModal = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null); // Thêm trạng thái lỗi

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/employee/getAllEmployees', {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          const employeeOptions = response.data.data.map((emp) => ({
            value: emp.id,
            label: emp.fullname,
          }));
          setEmployees(employeeOptions);
        } else {
          console.error("Unexpected response structure for employees");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

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
    setError(null); // Reset lỗi khi bắt đầu gửi request

    if (selectedEmployee) {
      try {
        console.log("Submitting employee with ID:", selectedEmployee.value);

        const response = await axios.post('http://localhost:8080/api/salaries', {withCredentials: true},{
          employee: { id: selectedEmployee.value },
        });

        console.log("API Response:", response.data);

        // Close modal
        const modal = document.querySelector('#add_salary');
        if (modal) {
          const modalInstance = new window.bootstrap.Modal(modal);
          modalInstance.hide();
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        setError("Failed to submit data. Please try again."); // Cập nhật lỗi
      }
    } else {
      console.error("No employee selected");
      setError("Please select an employee."); // Cập nhật lỗi
    }
  };

  return (
    <>
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
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Select Staff</label>
                      <Select
                        placeholder="Select"
                        options={employees}
                        onChange={setSelectedEmployee}
                        className="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-danger">{error}</p>}
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
    </>
  );
};

export default AddSalaryModal;
