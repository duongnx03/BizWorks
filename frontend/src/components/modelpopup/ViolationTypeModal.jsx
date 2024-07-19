import React, { useState, useEffect } from "react";

const ViolationTypeModal = ({ onAdd, onEdit, editData }) => {
  const [type, setType] = useState("");
  const [violationMoney, setViolationMoney] = useState("");
  const [editViolationType, setEditViolationType] = useState("");
  const [editViolationMoney, setEditViolationMoney] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (editData) {
      setEditViolationType(editData.violationType);
      setEditViolationMoney(editData.violationMoney);
      setEditId(editData.id);
    }
  }, [editData]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ type: type, violationMoney: violationMoney });
    setType("");
    setViolationMoney("");
    document.querySelector("#add_violationType .btn-close").click();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await onEdit(editId, { type: editViolationType, violationMoney: editViolationMoney });
    setEditViolationType("");
    setEditViolationMoney("");
    setEditId(null);
    document.querySelector("#edit_violationType .btn-close").click();
  };

  return (
    <>
      {/* Add ViolationType Modal */}
      <div id="add_violationType" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add ViolationType</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    ViolationType <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="violationType"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    ViolationMoney <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="violationMoney"
                    value={violationMoney}
                    onChange={(e) => setViolationMoney(e.target.value)}
                    required
                  />
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add ViolationType Modal */}

      {/* Edit ViolationType Modal */}
      <div id="edit_violationType" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit ViolationType</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    ViolationType <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="editViolationType"
                    value={editViolationType}
                    onChange={(e) => setEditViolationType(e.target.value)}
                    required
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    ViolationMoney <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="editViolationMoney"
                    value={editViolationMoney}
                    onChange={(e) => setEditViolationMoney(e.target.value)}
                    required
                  />
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit ViolationType Modal */}
    </>
  );
};

export default ViolationTypeModal;
