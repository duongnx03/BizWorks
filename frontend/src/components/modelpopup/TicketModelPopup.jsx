import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar_02,
  Avatar_05,
  Avatar_09,
  Avatar_10,
  Avatar_11,
} from "../../Routes/ImagePath";
import Select from "react-select";

const TicketModelPopup = () => {
  const company = [
    { value: 1, label: "-" },
    { value: 2, label: "Delta Infotech" },
    { value: 3, label: "International Software Inc" },
  ];

  const staff = [
    { value: 1, label: "-" },
    { value: 2, label: "John Smith" },
    { value: 3, label: "Mike Litorus" },
  ];
  const status = [
    { value: 1, label: "High" },
    { value: 2, label: "Low" },
    { value: 3, label: "Medium" },
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
      <div id="add_ticket" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Ticket</h5>
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
              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Subject</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Id</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign Staff</label>
                      <Select
                        options={staff}
                        placeholder="-"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Client</label>
                      <Select
                        options={company}
                        placeholder="-"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Priority</label>
                      <Select
                        options={status}
                        placeholder="High"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">CC</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Assignee</label>
                      <div className="project-members">
                        <Link
                          title="John Smith"
                          data-placement="top"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_02} alt="" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Add Followers</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Followers</label>
                      <div className="project-members">
                        <Link
                          title="Richard Miles"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_09} alt="" />
                        </Link>
                        <Link
                          title="John Smith"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_10} alt="" />
                        </Link>
                        <Link
                          title="Mike Litorus"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_05} alt="" />
                        </Link>
                        <Link
                          title="Wilmer Deluna"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_11} alt="" />
                        </Link>
                        <span className="all-team">+2</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Description</label>
                      <textarea className="form-control" defaultValue={""} />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Upload Files</label>
                      <input className="form-control" type="file" />
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

      <div id="edit_ticket" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Ticket</h5>
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
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Subject</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="Laptop Issue"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Id</label>
                      <input
                        className="form-control"
                        type="text"
                        readOnly
                        defaultValue="TKT-0001"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign Staff</label>
                      <Select
                        options={staff}
                        placeholder="John Smith"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Client</label>
                      <Select
                        options={company}
                        placeholder="Delta InfoTech"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Priority</label>
                      <Select
                        options={status}
                        placeholder="Medium"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">CC</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Assignee</label>
                      <div className="project-members">
                        <Link
                          title="John Smith"
                          data-placement="top"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_02} alt="" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Add Followers</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Followers</label>
                      <div className="project-members">
                        <Link
                          title="Richard Miles"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_09} alt="" />
                        </Link>
                        <Link
                          title="John Smith"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_10} alt="" />
                        </Link>
                        <Link
                          title="Mike Litorus"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_05} alt="" />
                        </Link>
                        <Link
                          title="Wilmer Deluna"
                          data-bs-toggle="tooltip"
                          to="#"
                          className="avatar"
                        >
                          <img src={Avatar_11} alt="" />
                        </Link>
                        <span className="all-team">+2</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        defaultValue={""}
                      />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Upload Files</label>
                      <input className="form-control" type="file" />
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
                    Save
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

export default TicketModelPopup;
