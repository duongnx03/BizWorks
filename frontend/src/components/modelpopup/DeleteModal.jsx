import React from "react";
import { Link } from "react-router-dom";

const DeleteModal = (props) => {
  return (
    <>
      <div className="modal custom-modal fade" id="delete" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>{props.Name}</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link 
                      to="#" 
                      className="btn btn-primary continue-btn" 
                      onClick={() => {
                       props.onConfirm().then(() => props.onClose());
                      }}
                    >
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                      onClick={props.onClose} // Gọi hàm đóng modal
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default DeleteModal;
