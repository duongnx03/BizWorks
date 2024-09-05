import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar_19 } from "../../../Routes/ImagePath";
import Breadcrumbs from "../../../components/Breadcrumbs";

const ClientProfile = () => {
  const { id } = useParams(); // Get the ID from the URL parameters
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/employee/getEmployeeById/${id}`, { withCredentials: true });
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfileData();
  }, [id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee Profile"
            title="Dashboard"
            subtitle="Employee Profile"
          />

          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <Link to="#">
                          <img src={profileData.avatar || Avatar_19} alt="" />
                        </Link>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0">
                              {profileData.empCode} - {profileData.fullname}
                            </h3>
                            <h6 className="text-muted">
                              {profileData.department}
                            </h6>
                            <small className="text-muted">
                              {profileData.position}
                            </small>
                            <div className="small doj text-muted">
                              Date of Join : {new Date(profileData.startDate).toLocaleDateString()}
                            </div>
                            <div className="staff-msg">
                              <Link to="/call/chat" className="btn btn-custom">
                                Send Message
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <span className="title">Phone:</span>
                              <span className="text">
                                <Link to={`tel:${profileData.phone}`}>
                                  {profileData.phone}
                                </Link>
                              </span>
                            </li>
                            <li>
                              <span className="title">Email:</span>
                              <span className="text">
                                <Link to={`mailto:${profileData.email}`}>
                                  {profileData.email}
                                </Link>
                              </span>
                            </li>
                            <li>
                              <span className="title">Birthday:</span>
                              <span className="text">
                                {profileData.dob ? new Date(profileData.dob).toLocaleDateString() : ""}
                              </span>
                            </li>
                            <li>
                              <span className="title">Address:</span>
                              <span className="text">
                                {profileData.address}
                              </span>
                            </li>
                            <li>
                              <span className="title">Gender:</span>
                              <span className="text">{profileData.gender}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
