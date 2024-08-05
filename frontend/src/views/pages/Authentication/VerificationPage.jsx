import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Routes/AuthContext';
import ClipLoader from "react-spinners/ClipLoader";

const VerificationPage = () => {
  const [codes, setCodes] = useState(new Array(6).fill(''));
  const [isVerified, setIsVerified] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [loadingResend, setLoadingResend] = useState(false); // New loading state for resend
  const navigate = useNavigate();
  const { verifyUser } = useContext(AuthContext);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (value.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Automatically focus on the next input when filled
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !codes[index]) {
      if (index > 0) {
        document.getElementById(`code-${index - 1}`).focus();
      }
    }
  };

  useEffect(() => {
    // Automatically focus on the first input when the component mounts
    document.getElementById('code-0').focus();

    // Countdown logic
    let timer;
    if (!resendEnabled) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setResendEnabled(true);
            clearInterval(timer);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendEnabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = codes.join('');

    try {
      const response = await axios.post("http://localhost:8080/api/verify/verify", {
        verificationCode: enteredCode,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        verifyUser();
        setIsVerified(true);
        toast.success("Your account has been verified successfully!");
        navigate("/reset-password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'The verification code is incorrect. Please try again.');
      console.error(error);
    }
  };

  const handleResend = async () => {
    if (resendEnabled) {
      try {
        setLoadingResend(true); // Start loading
        await axios.post("http://localhost:8080/api/verify/resend", {}, {
          withCredentials: true,
        });
        toast.success("Verification code resent!");
        setResendEnabled(false);
        setCountdown(60); // Reset countdown
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to resend verification code.');
        console.error(error);
      } finally {
        setLoadingResend(false); // Stop loading
      }
    } else {
      toast.info(`Please wait ${countdown} seconds before resending.`);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="d-flex justify-content-center" style={{ width: '100%' }}>
        <div className="card" style={{ width: '450px' }}>
          <div className="card-body text-center">
            <h2 className="card-title mb-4">Account Verification</h2>
            {isVerified ? (
              <p className="text-success">Your account has been verified successfully!</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group d-flex justify-content-center mb-4">
                  {codes.map((code, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      className="form-control mx-2"
                      value={code}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength="1"
                      required
                      style={{
                        width: '50px',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '24px',
                      }}
                    />
                  ))}
                </div>
                <button type="submit" className="btn btn-primary">Verify</button>
              </form>
            )}
            <button className="btn btn-secondary mt-3" onClick={handleResend} disabled={!resendEnabled}>
              {loadingResend ? <ClipLoader size={20} color={"#ffffff"} loading={true} /> : `Resend Code ${resendEnabled ? '' : `(${countdown})`}`}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default VerificationPage;
