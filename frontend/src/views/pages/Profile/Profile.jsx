/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import axios from "axios";
import PersonalInformationModelPopup from "../../../components/modelpopup/PersonalInformationModelPopup";
import ChangePasswordModal from "./ChangePasswordModal";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  // Hàm đóng modal
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const handleChangePasswordSubmit = async (passwordData) => {
    setLoading(true); // Bắt đầu hiển thị loading spinner
    try {
      await axios.post(
        "http://localhost:8080/api/auth/change-password",
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Password changed successfully!"); 
      handleCloseChangePasswordModal(); 
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Ẩn loading spinner
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employee/getEmployee",
        {
          withCredentials: true,
        }
      );
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

  const handleSave = async () => {
    await fetchEmployee(); // Refresh employee data
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Profile"
            title="Dashboard"
            subtitle="Profile"
          />
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <Link to="#">
                          <img src={employee.avatar} alt="User Image" />
                        </Link>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0 mb-0">
                              {employee.empCode} - {employee.fullname}
                            </h3>
                            <h6 className="text-muted">
                              {employee.department}
                            </h6>
                            <small className="text-muted">
                              {employee.position}
                            </small>
                            <div className="small doj text-muted">
                              Date of Join : {employee.startDate}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <div className="title">Phone:</div>
                              <div className="text">
                                <Link to="#">{employee.phone}</Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Email:</div>
                              <div className="text">
                                <Link to="#">{employee.email}</Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Birthday:</div>
                              <div className="text">{employee.dob}</div>
                            </li>
                            <li>
                              <div className="title">Address:</div>
                              <div className="text">{employee.address}</div>
                            </li>
                            <li>
                              <div className="title">Gender:</div>
                              <div className="text">{employee.gender}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="pro-edit">
                      <Link
                        data-bs-target="#profile_info"
                        data-bs-toggle="modal"
                        className="edit-icon"
                        to="#"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleShowChangePasswordModal}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PersonalInformationModelPopup onSave={handleSave} />
          <ChangePasswordModal
            showChangePasswordModal={showChangePasswordModal}
            handleCloseChangePasswordModal={handleCloseChangePasswordModal}
            handleChangePasswordSubmit={handleChangePasswordSubmit}
            loading={loading}
          />
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
    </>
  );
};

export default Profile;
