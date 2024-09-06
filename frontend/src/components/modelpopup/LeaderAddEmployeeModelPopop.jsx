import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";

const LeaderAddEmployeeModelPopup = ({ refreshEmployeeList }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewImage, setReviewImage] = useState(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/departments/getByName",
          {
            withCredentials: true, // Enable cookies to be sent
          }
        );
        const formattedPositions = response.data.positions.map((position) => ({
          value: position.id,
          label: position.positionName,
        }));

        setDepartment({
          value: response.data.id,
          label: response.data.name,
        }); // Đặt department chỉ đọc với tên hiển thị
        setPositions(formattedPositions);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    }
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
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Email is invalid.";
        else delete newErrors.email;
        break;
      case "startDate":
        if (!value) newErrors.startDate = "Joining Date is required.";
        else delete newErrors.startDate;
        break;
      case "image":
        if (!selectedImage && touched.image)
          newErrors.image = "Profile image is required.";
        else delete newErrors.image;
        break;
      case "position":
        if (!selectedPosition) newErrors.position = "Position is required.";
        else delete newErrors.position;
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
        if (touched.fullname) validateField("fullname", value);
        break;
      case "email":
        setEmail(value);
        if (touched.email) validateField("email", value);
        break;
      case "position":
        setSelectedPosition(value);
        if (touched.position) validateField("position", value);
        break;
      default:
        break;
    }
  };

  const handleImageBlur = () => {
    setTouched({ ...touched, image: true });
    validateField("image", selectedImage);
  };

  const handleBlur = (field, value) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, value);
  };

  const resetForm = () => {
    setSelectedDate(null);
    setFullname("");
    setEmail("");
    setSelectedPosition(null);
    setSelectedImage(null);
    setReviewImage(null);
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullname) newErrors.fullname = "Full Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Email is invalid.";

    if (!selectedDate) newErrors.startDate = "Joining Date is required.";
    if (!selectedImage) newErrors.image = "Profile image is required.";
    if (!selectedPosition) newErrors.position = "Position is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("startDate", selectedDate.toISOString().split("T")[0]);
    formData.append("department_id", department.value);
    formData.append("position_id", selectedPosition.value);
    formData.append("fileImage", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
        {
          withCredentials: true, // Enable cookies to be sent
        }
      );
      console.log("Employee added:", response.data);
      await refreshEmployeeList(); // Call fetchEmployees after success
      setLoading(false);
      if (closeButtonRef.current) {
        resetForm();
        closeButtonRef.current.click();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        id="leader_add_employee"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee to Department</h5>
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
                {reviewImage && (
                  <div className="mb-3 text-center">
                    <img
                      src={reviewImage}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={fullname}
                        onChange={(e) =>
                          handleChange("fullname", e.target.value)
                        }
                        onBlur={() => handleBlur("fullname", fullname)}
                        required
                      />
                      {errors.fullname && touched.fullname && (
                        <small className="text-danger">{errors.fullname}</small>
                      )}
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
                        onBlur={() => handleBlur("email", email)}
                        required
                      />
                      {errors.email && touched.email && (
                        <small className="text-danger">{errors.email}</small>
                      )}
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
                          onBlur={() => handleBlur("startDate", selectedDate)}
                        />
                      </div>
                      {errors.startDate && touched.startDate && (
                        <small className="text-danger">
                          {errors.startDate}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Upload Image <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        onBlur={handleImageBlur}
                      />
                      {errors.image && touched.image && (
                        <small className="text-danger">{errors.image}</small>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={department.label}
                        readOnly
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
                        onChange={(position) =>
                          handleChange("position", position)
                        }
                        onBlur={() => handleBlur("position", selectedPosition)}
                        placeholder="Select"
                        styles={customStyles}
                      />
                      {errors.position && touched.position && (
                        <small className="text-danger">{errors.position}</small>
                      )}
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
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

export default LeaderAddEmployeeModelPopup;
