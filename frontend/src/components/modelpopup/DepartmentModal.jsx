import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { base_url } from "../../base_urls";

const DepartmentModal = ({ onDepartmentCreated }) => {
  const [departmentName, setDepartmentName] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${base_url}/api/departments`, {
        departmentName: departmentName,
      });

      if (response.status === 201) {
        message.success("Department created successfully");
        // Update local state with the new department
        onDepartmentCreated(); // This triggers the fetch and updates the UI
        setDepartmentName(""); // Reset form field
      } else {
        message.error("Failed to create department");
      }
    } catch (error) {
      message.error("Failed to create department");
    }
  };

  return (
    <>
      {/* Add Department Modal */}
      <div id="add_department" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Department</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Department Modal */}
    </>
  );
};

export default DepartmentModal;
