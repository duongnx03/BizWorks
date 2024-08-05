import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";

const AllEmployeeAddPopup = () => {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles] = useState([
    { value: 'LEADER', label: 'Leader' },
    { value: 'EMPLOYEE', label: 'Employee' }
  ]);
  const [selectedRole, setSelectedRole] = useState(null);

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

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  // Fetch departments and positions from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/departments", {
          withCredentials: true, // Enable cookies to be sent
        });
        console.log(response.data);

        const departmentOptions = response.data.map((dept) => ({
          value: dept.id,
          label: dept.departmentName,
          positions: dept.positions.map((pos) => ({
            value: pos.id,
            label: pos.positionName,
          })),
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const department = departments.find(dept => dept.value === selectedDepartment.value);
      setPositions(department ? department.positions : []);
      setSelectedPosition(department ? department.positions[0] : null);
    } else {
      setPositions([]);
      setSelectedPosition(null);
    }
  }, [selectedDepartment, departments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fullname,
      email,
      password,
      role: selectedRole ? selectedRole.value : null,
      department_id: selectedDepartment ? selectedDepartment.value : null,
      position_id: selectedPosition ? selectedPosition.value : null,
      startDate: selectedDate1 ? selectedDate1.toISOString().split('T')[0] : null
    };

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", data, {
        withCredentials: true, // Enable cookies to be sent
      });
      console.log("Employee added:", response.data);
      // Handle success (e.g., close modal, clear form, etc.)
    } catch (error) {
      console.error("Error adding employee:", error);
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
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
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
                        onChange={setSelectedRole}
                        placeholder="Select Role"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          className="form-control floating datetimepicker"
                          type="date"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={departments}
                        onChange={setSelectedDepartment}
                        placeholder="Select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Position <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={positions}
                        value={selectedPosition}
                        onChange={setSelectedPosition}
                        placeholder="Select"
                        styles={customStyles}
                        isDisabled={!selectedDepartment} // Disable if no department is selected
                      />
                    </div>
                  </div>
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
    </>
  );
};

export default AllEmployeeAddPopup;
