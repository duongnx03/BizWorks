/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import notifications from "../../assets/json/notifications";
import message from "../../assets/json/message";
import {
  Applogo,
  Avatar_02,
  headerlogo,
  lnEnglish,
  lnFrench,
  lnGerman,
  lnSpanish,
} from "../../Routes/ImagePath";

import { FaRegBell, FaRegComment } from "react-icons/fa";
import { useLocation } from "react-router-dom/dist";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { AuthContext } from "../../Routes/AuthContext";
import axios from "axios";

const Header = (props) => {
  const data = notifications.notifications;
  const datas = message.message;
  const [notification, setNotifications] = useState(false);
  const [flag, setflag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [flagImage, setFlagImage] = useState(lnEnglish);
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const { userRole, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/employee/getEmployee', { withCredentials: true });
        const employee = response.data.data;
        setProfileName(employee.fullname);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (userRole !== "ADMIN") {
      fetchEmployeeData(); // Gọi API nếu không phải là ADMIN
    } else {
      setProfileName("Admin"); // Nếu là ADMIN, đặt ProfileName là "Admin"
    }
  }, [userRole]);

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };
  const onMenuClik = () => {
    document.body.classList.toggle("slide-nav");
  };

  const themes = localStorage.getItem("theme");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setNotifications(false);
    setProfile(false);
    setflag(false);
  };

  // const handleFlags = () => {
  //   setflag(!flag);
  //   setIsOpen(false);
  //   setNotifications(false);
  //   setProfile(false);
  // };
  const handleNotification = () => {
    setNotifications(!notification);
    setflag(false);
    setIsOpen(false);
    setProfile(false);
  };
  const handleProfile = () => {
    setProfile(!profile);
    setNotifications(false);
    setflag(false);
    setIsOpen(false);
  };

  const location = useLocation();
  let pathname = location.pathname;
  // const { value } = useSelector((state) => state.user);
  const Credencial = localStorage.getItem("credencial");
  const Value = JSON.parse(Credencial);
  const UserName = Value?.email?.split("@")[0];

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    // Debugging statement
    i18n.changeLanguage(lng);
    setFlagImage(
      lng === "en"
        ? lnEnglish
        : lng === "fr"
          ? lnFrench
          : lng === "es"
            ? lnSpanish
            : lnGerman
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, {
        withCredentials: true // Include cookies in the request if needed
      });
      logout();
      // Xóa các thông tin liên quan ở frontend nếu cần
      console.log('Logged out successfully');
      // Thực hiện điều hướng hoặc cập nhật state để phản ánh việc đăng xuất
      navigate("/"); // Điều hướng đến trang đăng nhập hoặc trang khác
    } catch (error) {
      console.error('Error logging out', error);
    } 
  };

  return (
    <div className="header" style={{ right: "0px" }}>
      {/* /Logo */}
      <Link
        id="toggle_btn"
        to="#"
        style={{
          display: pathname.includes("tasks")
            ? "none"
            : pathname.includes("compose")
              ? "none"
              : "",
        }}
        onClick={handlesidebar}
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>
      {/* Header Title */}
      <div className="page-title-box">
        <h3>BizWorks</h3>
      </div>
      {/* /Header Title */}
      <Link
        id="mobile_btn"
        className="mobile_btn"
        to="#"
        onClick={() => onMenuClik()}
      >
        <i className="fa fa-bars" />
      </Link>
      {/* Header Menu */}
      <ul className="nav user-menu">   
        {/* /Message Notifications */}
        <li className="nav-item dropdown has-arrow main-drop">
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
            onClick={handleProfile}
          >
            {" "}
            <span className="user-img me-1">
              <img src={Avatar_02} alt="img" />
              <span className="status online" />
            </span>
            <span>{profileName ? profileName : "Loading..."}</span>
          </Link>
          <div
            className={`dropdown-menu dropdown-menu-end ${profile ? "show" : ""
              }`}
          >
            <Link className="dropdown-item" to="/profile">
              My Profile
            </Link>
            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          </div>
        </li>
      </ul>
      {/* /Header Menu */}
      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <Link
          to="#"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </Link>
        <div className="dropdown-menu dropdown-menu-end dropdown-menu-right">
          <Link className="dropdown-item" to="/profile">
            My Profile
          </Link>
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {/* /Mobile Menu */}
    </div>
  );
};

export default Header;
