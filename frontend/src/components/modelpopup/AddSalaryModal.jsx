import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const AddSalaryModal = () => {
  const [setselectOne] = useState(null);

  const department = [
    { value: 1, label: "A01" },
    { value: 2, label: "A02" },
  ];
  const employee = [
    { value: 1, label: "Dien" },
    { value: 2, label: "Duong k" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };
  return (
    <>
      <div id="add_salary" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Staff Salary</h5>
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
              <form action="salary">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Select Department</label>
                      <Select
                        placeholder="Select"
                        options={department}
                        onChange={setselectOne}
                        className="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <div className="input-block mb-3">
                      <label className="col-form-label">Select Staff</label>
                      <Select
                        placeholder="Select"
                        options={employee}
                        onChange={setselectOne}
                        className="select"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <h4 className="text-primary">Earnings</h4>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Basic</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Bonus</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Overtime</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Allowance</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <h4 className="text-primary">Deductions</h4>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Leave</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Violation</label>
                      <input className="form-control" type="text" />
                    </div>              
                    <div className="input-block mb-3">
                      <label className="col-form-label">Advance salary</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Prof. Tax</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="add-more">
                      <Link to="#">
                        <i className="fa-solid fa-plus-circle" /> Add More
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="reset"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSalaryModal;
