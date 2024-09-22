import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showInputs, setShowInputs] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setErrorMessage(prev => ({ ...prev, email: "Invalid email." }));
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', null, {
        params: { email }
      });

      if (response.status === 200) {
        setShowInputs(true);
        setIsTimerActive(true);
        setCountdown(60);
        toast.success("Check your email to receive the verification code.");
        setErrorMessage(prev => ({ ...prev, email: "" }));
      }
    } catch (error) {
      const errorMessage = "User not found.";
      setShowInputs(false);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  useEffect(() => {
    let timer;
    if (isTimerActive && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, countdown]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage({ email: "", verificationCode: "", newPassword: "", confirmPassword: "" });

    if (verificationCode.length !== 6) {
      setErrorMessage(prev => ({ ...prev, verificationCode: "Verification code must be 6 digits." }));
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(prev => ({ ...prev, newPassword: "Passwords must be at least 6 characters." }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(prev => ({ ...prev, confirmPassword: "New password does not match." }));
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password/reset', {
        email,
        verificationCode,
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password has been reset successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrorMessage(prev => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field, value) => {
    if (field === "email" && !validateEmail(value)) {
      setErrorMessage(prev => ({ ...prev, email: "Invalid email." }));
    }

    if (field === "verificationCode") {
      const isNumeric = /^\d+$/.test(value);
      if (!isNumeric) {
        setErrorMessage(prev => ({ ...prev, verificationCode: "Verification code must contain only numbers." }));
      } else if (value.length !== 6) {
        setErrorMessage(prev => ({ ...prev, verificationCode: "Verification code must be 6 digits." }));
      }
    }

    if (field === "newPassword" && value.length < 6) {
      setErrorMessage(prev => ({ ...prev, newPassword: "Passwords must be at least 6 characters." }));
    }

    if (field === "confirmPassword" && value !== newPassword) {
      setErrorMessage(prev => ({ ...prev, confirmPassword: "New password does not match." }));
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <Link to="/app/main/dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Forgot Password?</h3>
                <p className="account-subtitle">
                  Enter your email to get a password reset link
                </p>
                <form onSubmit={handleResetPassword}>
                  <div className="input-block">
                    <label>Email Address</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="text"
                        value={email}
                        onChange={handleInputChange(setEmail, 'email')}
                        onBlur={() => handleBlur('email', email)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleSendCode}
                        disabled={isTimerActive || loading}
                      >
                        {loading ? <ClipLoader size={20} color={"#fff"} /> : (isTimerActive ? `${countdown}s` : "Receive code")}
                      </button>
                    </div>
                    {errorMessage.email && <p className="text-danger">{errorMessage.email}</p>}
                  </div>
                  {showInputs && (
                    <>
                      <div className="input-block">
                        <label>Verification Code</label>
                        <input
                          className="form-control"
                          type="text"
                          value={verificationCode}
                          pattern="\d*"
                          onChange={handleInputChange(setVerificationCode, 'verificationCode')}
                          onBlur={() => handleBlur('verificationCode', verificationCode)}
                          maxLength={6}
                        />
                        {errorMessage.verificationCode && <p className="text-danger">{errorMessage.verificationCode}</p>}
                      </div>

                      <div className="input-block">
                        <label>New Password</label>
                        <input
                          className="form-control"
                          type="password"
                          value={newPassword}
                          onChange={handleInputChange(setNewPassword, 'newPassword')}
                          onBlur={() => handleBlur('newPassword', newPassword)}
                        />
                        {errorMessage.newPassword && <p className="text-danger">{errorMessage.newPassword}</p>}
                      </div>
                      <div className="input-block">
                        <label>Confirm New Password</label>
                        <input
                          className="form-control"
                          type="password"
                          value={confirmPassword}
                          onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
                          onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                        />
                        {errorMessage.confirmPassword && <p className="text-danger">{errorMessage.confirmPassword}</p>}
                      </div>
                      <div className="input-block text-center">
                        <button className="btn btn-primary account-btn" type="submit">
                          Reset Password
                        </button>
                      </div>
                    </>
                  )}
                  <div className="account-footer">
                    <p>
                      Remember your password? <Link to="/">Login</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ForgotPassword;
