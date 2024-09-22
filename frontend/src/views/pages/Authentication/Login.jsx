import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from "../../../Routes/AuthContext";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login, verifyUser } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      // Gửi yêu cầu xác thực
      const response = await axios.post("http://localhost:8080/api/auth/authenticate", data, {
        withCredentials: true, // Enable cookies to be sent
      });

      if (response.status === 200) {
        try {
          // Kiểm tra xác minh
          const userResponse = await axios.get("http://localhost:8080/api/verify/check-verify", {
            withCredentials: true,
          });

          if (userResponse.status === 200) {
            const userRole = response.data.data;
            login(userRole);
            verifyUser(); // Đặt trạng thái xác minh khi người dùng đã được xác minh

            // Điều hướng đến dashboard tương ứng
            if (userRole === "ADMIN") {
              navigate("/employees");
            } else if (userRole === "EMPLOYEE") {
              navigate("/attendance-employee");
            }
            else if (userRole === "MANAGE") {
              navigate("/manage-employees");
            }
            else if (userRole === "LEADER") {
              navigate("/leader-employees");
            }
          }
        } catch (verificationError) {
          // Kiểm tra lỗi trả về từ API
          if (verificationError.response && verificationError.response.status === 400) {
            console.error("Unverified account:", verificationError.response.data);
            // Đặt trạng thái xác minh và điều hướng đến trang xác minh
            const userRole = response.data.data;
            login(userRole);
            navigate("/verification");
          } else {
            // Xử lý lỗi khác nếu cần
            console.error("Error in verification check:", verificationError.response ? verificationError.response.data : verificationError.message);
            toast.error("An error occurred during verification check.");
          }
        }
      }
    } catch (authError) {
      // Xử lý lỗi khi xác thực
      toast.error(authError.response?.data?.message || "An error occurred");
    }
  };


  const handleBlur = async (field) => {
    await trigger(field); // Trigger validation for the specific field
  };

  return (
    <div>
      <div className="account-page">
        <div className="main-wrapper">
          <div className="account-content">
            <div className="container">
              <div className="account-logo">
                <Link to="/admin-dashboard">
                  <img src={Applogo} alt="Dreamguy's Technologies" />
                </Link>
              </div>
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">Login</h3>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-block mb-4">
                      <label className="col-form-label">Email Address</label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            className={`form-control ${errors.email ? "error-input" : ""}`}
                            type="text"
                            {...field}
                            onBlur={() => handleBlur('email')}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.email?.message}</span>
                    </div>
                    <div className="input-block mb-4">
                      <div className="row">
                        <div className="col">
                          <label className="col-form-label">Password</label>
                        </div>
                        <div className="col-auto">
                          <Link className="text-muted" to="/forgot-password">
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                      <div style={{ position: "relative" }}>
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <input
                              className={`form-control ${errors.password ? "error-input" : ""}`}
                              type={showPassword ? "text" : "password"}
                              {...field}
                              onBlur={() => handleBlur('password')}
                            />
                          )}
                        />
                        <span
                          style={{
                            position: "absolute",
                            right: "5%",
                            top: "30%",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "🙈"}
                        </span>
                      </div>
                      <span className="text-danger">{errors.password?.message}</span>
                    </div>
                    <div className="input-block text-center">
                      <button className="btn btn-primary account-btn" type="submit">
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Login;
