import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonalInformationModelPopup = ({ onSave }) => {
  const [employee, setEmployee] = useState({
    dob: "",
    address: "",
    gender: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [validationErrors, setValidationErrors] = useState({
    dob: "",
    gender: "",
    phone: "",
    address: "",
  });

  const fetchEmployee = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employee/getEmployee", {
        withCredentials: true,
      });
      setEmployee(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'dob':
        const today = new Date();
        const dob = new Date(value);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        const dayDifference = today.getDate() - dob.getDate();

        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
          age--;
        }

        if (!value || age < 18) {
          errors.dob = "You must be at least 18 years old.";
        } else {
          errors.dob = "";
        }
        break;

      case 'gender':
        if (!value) {
          errors.gender = "Gender is required.";
        } else {
          errors.gender = "";
        }
        break;

      case 'phone':
        const phoneRegex = /^\d{10}$/;
        if (!value || !phoneRegex.test(value)) {
          errors.phone = "Phone number must be exactly 10 digits.";
        } else {
          errors.phone = "";
        }
        break;

      case 'address':
        const addressRegex = /^[\w\s/-]+$/;
        if (!value || !addressRegex.test(value)) {
          errors.address = "Address contains invalid characters.";
        } else {
          errors.address = "";
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
    validateField(name, value); // Validate field on change
  };

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      gender: selectedGender || "Male",
    }));
    validateField('gender', selectedGender); // Validate gender on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    validateField('dob', employee.dob);
    validateField('gender', employee.gender);
    validateField('phone', employee.phone);
    validateField('address', employee.address);

    if (Object.values(validationErrors).some(error => error)) {
      return; // If there are validation errors, prevent submission
    }

    const genderToSubmit = employee.gender || "Male";

    const formData = {
      dob: employee.dob,
      address: employee.address,
      gender: genderToSubmit,
      phone: employee.phone,
    };

    try {
      const response = await axios.put("http://localhost:8080/api/employee/updateEmployee", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      onSave();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div
        id="profile_info"
        className="modal custom-modal fade"
        role="dialog"
        aria-labelledby="profileInfoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="profileInfoLabel">Profile Information</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="profile-img-wrap edit-img">
                      <img className="inline-block" src={employee.avatar} alt="User Avatar" />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={employee.fullname}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Email</label>
                          <input
                            type="text"
                            className="form-control"
                            value={employee.email}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Department</label>
                          <input
                            type="text"
                            className="form-control"
                            value={employee.department}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Position</label>
                          <input
                            type="text"
                            className="form-control"
                            value={employee.position}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={employee.startDate}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Birth Day</label>
                          <input
                            type="date"
                            className="form-control"
                            name="dob"
                            value={employee.dob}
                            onChange={handleInputChange}
                          />
                          {validationErrors.dob && <div className="text-danger">{validationErrors.dob}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Gender</label>
                          <select
                            className="form-select"
                            name="gender"
                            value={employee.gender}
                            onChange={handleGenderChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          {validationErrors.gender && <div className="text-danger">{validationErrors.gender}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={employee.phone}
                            onChange={handleInputChange}
                          />
                          {validationErrors.phone && <div className="text-danger">{validationErrors.phone}</div>}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={employee.address}
                            onChange={handleInputChange}
                          />
                          {validationErrors.address && <div className="text-danger">{validationErrors.address}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
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

export default PersonalInformationModelPopup;
