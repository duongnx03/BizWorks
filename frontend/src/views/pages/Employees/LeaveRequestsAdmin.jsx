import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Breadcrumbs from "../../../components/Breadcrumbs";

const LeaveRequestsAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remainingLeaveDays, setRemainingLeaveDays] = useState(0);
  const [searchCriteria, setSearchCriteria] = useState({
    startDate: '',
    endDate: '',
    leaveType: '',
    employeeName: '',
    status: ''
  });
  // const [feedbackMessage, setFeedbackMessage] = useState('');

  const leaveTypes = ["SICK", "MATERNITY", "PERSONAL", "BEREAVEMENT", "MARRIAGE", "CIVIC_DUTY", "OTHER"];
  const statuses = ["Pending", "Approved", "Rejected"];

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/leave-requests/all', { withCredentials: true });
      if (response.data.length === 0) {
        setNoData(true);
      } else {
        setLeaveRequests(response.data.map(request => ({ ...request, isActionTaken: false })));
        setNoData(false);
      }
    } catch (error) {
      console.error('There was an error fetching the leave requests!', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    const criteria = {};
  
    if (searchCriteria.startDate) criteria.startDate = searchCriteria.startDate;
    if (searchCriteria.endDate) criteria.endDate = searchCriteria.endDate;
    if (searchCriteria.leaveType) criteria.leaveType = searchCriteria.leaveType;
    if (searchCriteria.employeeName) criteria.employeeName = searchCriteria.employeeName;
    if (searchCriteria.status) criteria.status = searchCriteria.status;
  
    try {
      const response = await axios.post('http://localhost:8080/api/leave-requests/search', criteria, { withCredentials: true });
      setLeaveRequests(response.data);
      setNoData(response.data.length === 0);
    } catch (error) {
      console.error('Error searching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this leave request?")) {
      try {
        await axios.put(`http://localhost:8080/api/leave-requests/approve/${id}`, {}, { withCredentials: true });
        fetchLeaveRequests();
        // setFeedbackMessage('Leave request approved and email sent.');
      } catch (error) {
        console.error('Error approving leave request:', error.message);
        // setFeedbackMessage('Error approving leave request.');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this leave request?")) {
      try {
        await axios.put(`http://localhost:8080/api/leave-requests/reject/${id}`, {}, { withCredentials: true });
        fetchLeaveRequests();
        // setFeedbackMessage('Leave request rejected and email sent.');
      } catch (error) {
        console.error('Error rejecting leave request:', error.message);
        // setFeedbackMessage('Error rejecting leave request.');
      }
    }
  };

  const handleViewDetails = async (id, emp_id) => {
    try {
      const [response, remainingLeaveResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/leave-requests/getLeaveRequestById/${id}`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/leave-requests/remaining-leave-days/${emp_id}`, { withCredentials: true })
      ]);
      setSelectedRequest(response.data);
      setRemainingLeaveDays(remainingLeaveResponse.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching leave request details:', error.message);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs maintitle="Leave Requests" title="Dashboard" subtitle="Leave Request" />
          {/* {feedbackMessage && <div style={{color: 'green'}} >{feedbackMessage}</div>} */}
          <div className="row">
            <div className="col-md-12">
              <div
                className="search-form"
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '20px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  // position: 'sticky',
                  top: '0',
                  zIndex: '1000'
                }}
              >
                <input type="date" name="startDate" value={searchCriteria.startDate} onChange={handleSearchChange} max={searchCriteria.endDate}
                  style={{
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px'
                  }}
                />
                <input type="date" name="endDate" value={searchCriteria.endDate} onChange={handleSearchChange} min={searchCriteria.startDate}
                  style={{
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px'
                  }}
                />
                <select name="leaveType" value={searchCriteria.leaveType} onChange={handleSearchChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px'
                  }}
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input type="text" name="employeeName" placeholder="Employee Name" value={searchCriteria.employeeName} onChange={handleSearchChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px'
                  }}
                />
                <select name="status" value={searchCriteria.status} onChange={handleSearchChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px'
                  }}
                >
                  <option value="">Select Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button onClick={handleSearch} className="btn btn-primary"
                  style={{
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
              </div>
              <div className="results-container" style={{ marginTop: '20px' }}>
                {loading ? (
                  <div className="alert alert-info">Loading...</div>
                ) : noData ? (
                  <div className="alert alert-warning">No data found</div>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests
                        .sort((a, b) => {
                          const statusOrder = { 'Pending': 1, 'Approved': 2, 'Rejected': 3 };
                          if (statusOrder[a.status] !== statusOrder[b.status]) {
                            return statusOrder[a.status] - statusOrder[b.status];
                          }
                          return new Date(b.startDate) - new Date(a.startDate);
                        })
                        .map(request => (
                          <tr key={request.id}>
                            <td>{request.employeeName || 'Unknown Employee'}</td>
                            <td>{new Date(request.startDate).toLocaleDateString()}</td>
                            <td>{new Date(request.endDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${request.status === 'Approved' ? 'badge-success' : request.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                                {request.status}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => handleViewDetails(request.id, request.employeeId)} className="btn btn-info btn-sm">View Details</button>
                              {!request.isActionTaken && request.status === 'Pending' && (
                                <div className="action-buttons">
                                  <button onClick={() => handleApprove(request.id)} className="btn btn-success btn-sm">Approve</button>
                                  <button onClick={() => handleReject(request.id)} className="btn btn-danger btn-sm">Reject</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedRequest && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Leave Request Details"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '20px'
            }
          }}
        >
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Leave Request Details</h2>
            {selectedRequest ? (
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Employee</th>
                    <td>{selectedRequest.employeeName || 'Unknown Employee'}</td>
                  </tr>
                  <tr>
                    <th>Start Date</th>
                    <td>{new Date(selectedRequest.startDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>End Date</th>
                    <td>{new Date(selectedRequest.endDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Leave Type</th>
                    <td>{selectedRequest.leaveType}</td>
                  </tr>
                  <tr>
                    <th>Reason</th>
                    <td>{selectedRequest.reason}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{selectedRequest.status}</td>
                  </tr>
                  <tr>
                    <th>Remaining Leave Days</th>
                    <td>{remainingLeaveDays}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No details available</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
  
};

export default LeaveRequestsAdmin;

