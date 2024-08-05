import React from "react";
import { Applogo } from "../../../Routes/ImagePath";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", {
        newPassword: data.password,
      },{
        withCredentials: true,
      });
      console.log(response.data);
      navigate("/employee-dashboard");
      // Chuyển hướng hoặc hiển thị thông báo thành công
    } catch (error) {
      console.error(error);
      // Xử lý lỗi và thông báo cho người dùng
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          {/* Account Logo */}
          <div className="account-logo">
            <Link to="/admin-dashboard">
              <img src={Applogo} alt="Dreamguy's Technologies" />
            </Link>
          </div>
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Reset Password</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">New password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "error-input" : ""}`}
                    {...register("password")}
                  />
                  <span className="text-danger">{errors.password?.message}</span>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">Confirm password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? "error-input" : ""}`}
                    {...register("confirmPassword")}
                  />
                  <span className="text-danger">{errors.confirmPassword?.message}</span>
                </div>
                <div className="submit-section mb-4">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
