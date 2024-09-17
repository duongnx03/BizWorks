import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { base_url } from "../../base_urls";

const DepartmentModal = ({ onDepartmentCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(`${base_url}/api/departments`, {
        departmentName: name,
        description: description
      },  {withCredentials :true ,
       
      });

      if (response.status === 201) {
        message.success("Department created successfully");
        onDepartmentCreated(); // Cập nhật UI
        setName(""); // Reset trường name
        setDescription(""); // Reset trường description
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
      <div
        className="modal fade"
        id="add_department"
        tabIndex="-1"
        aria-labelledby="add_departmentLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="add_departmentLabel">Add Department</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="departmentName" className="form-label">
                    Department Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="departmentName"
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
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
