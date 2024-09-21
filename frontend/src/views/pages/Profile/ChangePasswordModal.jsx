import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

const ChangePasswordModal = ({
  showChangePasswordModal,
  handleCloseChangePasswordModal,
  handleChangePasswordSubmit,
  loading,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Hàm validate cho từng trường nhập
  const validateField = (field, value) => {
    let error = "";
    if (value.length < 6) {
      error = "Password must be at least 6 characters.";
    }
    if (field === "confirmPassword" && value !== newPassword) {
      error = "New password and confirm password do not match.";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  // Hàm xử lý submit
  const handleSubmit = () => {
    if (!errors.oldPassword && !errors.newPassword && !errors.confirmPassword) {
      const passwordData = {
        oldPassword,
        newPassword,
      };
      handleChangePasswordSubmit(passwordData);
    }
  };

  return (
    <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Old Password */}
          <Form.Group controlId="oldPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              onBlur={() => validateField("oldPassword", oldPassword)}
              isInvalid={!!errors.oldPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.oldPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* New Password */}
          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => validateField("newPassword", newPassword)}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validateField("confirmPassword", confirmPassword)}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseChangePasswordModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || Object.values(errors).some(err => err)}>
          {loading ? (
            <ClipLoader size={20} color={"#ffffff"} loading={true} />
          ) : (
            "Change Password"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
