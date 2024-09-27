import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Modal from "react-modal";
import DataTable from 'react-data-table-component';

Modal.setAppElement('#root');

const LeaveRequestsEmployee = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sendLeaveRequest, setSendLeaveRequest] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    leaderStatus: "Pending",
  });
  const [updateErrors, setUpdateErrors] = useState({});
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    startDate: '',
    endDate: '',
    leaveType: '',
    status: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const leaveTypes = ["SICK", "MATERNITY", "PERSONAL", "BEREAVEMENT", "MARRIAGE", "CIVIC_DUTY", "OTHER"];
  const statuses = ["Pending", "Approved", "Rejected"];

  useEffect(() => {
    fetchLeaveRequests();
    const interval = setInterval(() => {
      fetchLeaveRequests();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/leave-requests/history", {
        withCredentials: true,
      });
      
      console.log('Leave Requests Data:', response.data);
      const sortedRequests = sortLeaveRequests(response.data.data.map(request => ({
        ...request,
        createdAt: request.createdAt || new Date().toISOString()
      })));
      setLeaveRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError(error.message);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSendLeaveRequest({
      ...sendLeaveRequest,
      [name]: value
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: null
    });
  };

  const getLastEndDate = () => {
    if (leaveRequests.length === 0) return null;
    const endDates = leaveRequests.map(request => new Date(request.endDate));
    return new Date(Math.max(...endDates));
  };

  const validateForm = () => {
    const { leaveType, startDate, endDate, reason } = sendLeaveRequest;
    const errors = {};

    if (!leaveType) errors.leaveType = "Leave type is required.";
    if (!startDate) errors.startDate = "Start date is required.";
    if (!endDate) errors.endDate = "End date is required.";
    if (!reason) errors.reason = "Reason is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const requestedDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

    const maxDays = {
      SICK: 10,
      MATERNITY: 90,
      PERSONAL: 5,
      BEREAVEMENT: 3,
      MARRIAGE: 5,
      CIVIC_DUTY: 10,
      OTHER: Infinity
    };

    if (requestedDays > maxDays[leaveType]) {
      setErrorMessage(`Cannot request more than ${maxDays[leaveType]} days for ${leaveType.toLowerCase().replace('_', ' ')}.`);
      return false;
    }

    const lastEndDate = getLastEndDate();
    if (lastEndDate && start <= lastEndDate) {
      setErrorMessage(`You can only request leave after ${lastEndDate.toLocaleDateString()}.`);
      return false;
    }

    return true;
  };

  const canUpdateRequest = (request) => {
    return  request.status === 'Pending' && 
            request.leaderStatus !== 'Approved' &&
           (new Date() - new Date(request.createdAt)) / (1000 * 60) <= 60;
  };

  const handleOpenUpdateModal = (leaveRequest) => {
    setSelectedLeaveRequest(leaveRequest);
    setUpdateModalIsOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    

    try {
        const response = await axios.post("http://localhost:8080/api/leave-requests/send", sendLeaveRequest, {
            withCredentials: true,
        });
        console.log('Leave request sent:', response.data);
        setModalIsOpen(false);
        setError(null);
        setErrorMessage(null); 
        fetchLeaveRequests();
    } catch (error) { 
        console.error('Error sending leave request:', error.response.data);
        if (error.response && error.response.status === 400) {
            setError(error.response.data); 
        } else {
            setError("An error occurred");
        }
    }
  };

  const checkDateOverlap = (currentRequestId, newStartDate, newEndDate) => {
    let invalidStartDate = null; // Khởi tạo biến để lưu ngày không hợp lệ
    leaveRequests.forEach(request => {
        const requestStart = new Date(request.startDate);
        const requestEnd = new Date(request.endDate);
        // Chỉ kiểm tra yêu cầu khác ngoài yêu cầu hiện tại
        if (request.id !== currentRequestId && newStartDate <= requestEnd && newEndDate >= requestStart) {
            // Nếu ngày mới trùng với yêu cầu hiện có
            if (!invalidStartDate || requestEnd > invalidStartDate) {
                invalidStartDate = requestEnd; // Cập nhật ngày không hợp lệ
            }
        }
    });
    
    return invalidStartDate; 
  };

  const checkLeaveDaysLimit = (leaveType, startDate, endDate) => {
    const leaveLimits = {
        'SICK': 10,
        'MATERNITY': 90,
        'PERSONAL': 5,
        'BEREAVEMENT': 3,
        'MARRIAGE': 5,
        'CIVIC_DUTY': 10,
        'OTHER': Infinity,
    };

    const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    return {
        isValid: totalDays <= leaveLimits[leaveType],
        maxDays: leaveLimits[leaveType]
    };
};


  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!canUpdateRequest(selectedLeaveRequest)) {
      setError("This request can no longer be updated.");
      return;
    }

    setUpdateErrors({});
  
    const errors = {};
    if (!selectedLeaveRequest.leaveType) errors.leaveType = "Leave type is required.";
    if (!selectedLeaveRequest.startDate) errors.startDate = "Start date is required.";
    if (!selectedLeaveRequest.endDate) errors.endDate = "End date is required.";
    if (!selectedLeaveRequest.reason) errors.reason = "Reason is required.";
  
    const newStartDate = new Date(selectedLeaveRequest.startDate);
    const newEndDate = new Date(selectedLeaveRequest.endDate);
    const invalidStartDate = checkDateOverlap(selectedLeaveRequest.id, newStartDate, newEndDate);
    const { isValid, maxDays } = checkLeaveDaysLimit(selectedLeaveRequest.leaveType, newStartDate, newEndDate);

    if (invalidStartDate) {
      setUpdateErrors({ date: `You can only request leave after ${invalidStartDate.toISOString().split('T')[0]}.` });
      return;
    }
    
    if (!isValid) {
        setUpdateErrors({ leaveLimit: `Cannot request more than ${maxDays} days for '${selectedLeaveRequest.leaveType}'.` });
        return;
    }

    if (Object.keys(errors).length > 0) {
      setUpdateErrors(errors);
      return;
    }
  
    try {

      const formattedStartDate = new Date(selectedLeaveRequest.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(selectedLeaveRequest.endDate).toISOString().split('T')[0];

      const formattedRequest = {
        ...selectedLeaveRequest,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };

      console.log('Sending update request with data:', selectedLeaveRequest);
      const response = await axios.put(
        `http://localhost:8080/api/leave-requests/update/${selectedLeaveRequest.id}`,
         formattedRequest,
        { withCredentials: true }
      );
      console.log('Leave request updated:', response.data);
      setUpdateModalIsOpen(false);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating leave request:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("An error occurred while updating");
      }
    }
  };

  const sortLeaveRequests = (requests) => {
    return requests.sort((a, b) => {
      const statusOrder = { 'Pending': 1, 'Approved': 2, 'Rejected': 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.startDate) - new Date(a.startDate);
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const columns = [
    {
      name: 'Leave Type',
      selector: row => row.leaveType,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: row => new Date(row.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'End Date',
      selector: row => new Date(row.endDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Reason',
      selector: row => row.reason,
      sortable: true
    },
    // {
    //   name: 'Leader Status',
    //   selector: row => row.leaderStatus,
    //   sortable: true,
    //   cell: row => (
    //     <span style={
    //       row.leaderStatus === 'Pending' ? styles.pending :
    //       row.leaderStatus === 'Approved' ? styles.approved :
    //       row.leaderStatus === 'Rejected' ? styles.rejected : {}
    //     }>
    //       {row.leaderStatus}
    //     </span>
    //   )
    // },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span style={
          row.status === 'Pending' ? styles.pending :
          row.status === 'Approved' ? styles.approved :
          row.status === 'Rejected' ? styles.rejected : {}
        }>
          {row.status}
        </span>
      )
    },
    {
      name: 'Active',
      cell: row => (
        canUpdateRequest(row) ? (
          <button onClick={() => handleOpenUpdateModal(row)} style={styles.updateButton}>
            Update
          </button>
        ) : null
      ),
    }
  ];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#"
            name=""
          />
          <button onClick={() => setModalIsOpen(true)} style={styles.button}>Request Leave</button>
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{...styles.modal, zIndex: 1001}}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Leave Type:</label>
                <select name="leaveType" value={sendLeaveRequest.leaveType} onChange={handleChange} style={styles.select}>
                  <option value="SICK">Sick leave</option>
                  <option value="MATERNITY">Maternity leave</option>
                  <option value="PERSONAL">Personal leave</option>
                  <option value="BEREAVEMENT">Bereavement leave</option>
                  <option value="MARRIAGE">Marriage leave</option>
                  <option value="CIVIC_DUTY">Civic duty leave</option>
                  <option value="OTHER">Other leave</option>
                </select>
                {fieldErrors.leaveType && <div className={styles.error} style={styles.error}>{fieldErrors.leaveType}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date:</label>
                <input type="date" name="startDate" value={sendLeaveRequest.startDate} onChange={handleChange} min={today} max={sendLeaveRequest.endDate} required style={styles.input} />
                {fieldErrors.startDate && <div className={styles.error} style={styles.error}>{fieldErrors.startDate}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date:</label>
                <input type="date" name="endDate" value={sendLeaveRequest.endDate} onChange={handleChange} min={sendLeaveRequest.startDate || today} required style={styles.input} />
                {fieldErrors.endDate && <div className={styles.error} style={styles.error}>{fieldErrors.endDate}</div>}
                {errorMessage && <div className={styles.error} style={styles.error}>{errorMessage}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Reason:</label>
                <textarea name="reason" value={sendLeaveRequest.reason} onChange={handleChange} required style={styles.textarea} />
                {fieldErrors.reason && <div className={styles.error} style={styles.error}>{fieldErrors.reason}</div>}
              </div>
              <button type="submit" style={styles.submitButton}>Submit Leave Request</button>
            </form>
          </Modal>
          <Modal isOpen={updateModalIsOpen} onRequestClose={() => setUpdateModalIsOpen(false)} style={{...styles.modal, zIndex: 1001}}>
            {selectedLeaveRequest && (
              <form onSubmit={handleUpdate} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Leave Type:</label>
                  <select 
                    name="leaveType" 
                    value={selectedLeaveRequest.leaveType} 
                    onChange={(e) => setSelectedLeaveRequest({...selectedLeaveRequest, leaveType: e.target.value})}
                    style={styles.select}
                  >
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {updateErrors.leaveType && <div style={styles.error}>{updateErrors.leaveType}</div>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Date:</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={selectedLeaveRequest.startDate.split('T')[0]} 
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setSelectedLeaveRequest({...selectedLeaveRequest, startDate: newStartDate});
                    }}
                    // onChange={(e) => setSelectedLeaveRequest({...selectedLeaveRequest, startDate: e.target.value})}
                    max={selectedLeaveRequest.endDate.split('T')[0]}
                    style={styles.input} 
                  />
                  {updateErrors.startDate && <div style={styles.error}>{updateErrors.startDate}</div>}
                  {updateErrors.date && <div style={styles.error} className="error">{updateErrors.date}</div>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Date:</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={selectedLeaveRequest.endDate.split('T')[0]} 
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      setSelectedLeaveRequest({...selectedLeaveRequest, endDate: newEndDate});
                    }}
                    // onChange={(e) => setSelectedLeaveRequest({...selectedLeaveRequest, endDate: e.target.value})}
                    min={selectedLeaveRequest.startDate.split('T')[0]}

                    style={styles.input} 
                  />
                  {updateErrors.endDate && <div style={styles.error}>{updateErrors.endDate}</div>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Reason:</label>
                  <textarea 
                    name="reason" 
                    value={selectedLeaveRequest.reason} 
                    onChange={(e) => setSelectedLeaveRequest({...selectedLeaveRequest, reason: e.target.value})}
                    style={styles.textarea} 
                  />
                  {updateErrors.reason && <div style={styles.error}>{updateErrors.reason}</div>}
                </div>
                {updateErrors.leaveLimit && <div style={styles.error}>{updateErrors.leaveLimit}</div>}
                {error && <div style={styles.error}>{error}</div>}
                <button type="submit" style={styles.submitButton}>Update Leave Request</button>
              </form>
            )}
          </Modal>
          <div>
            <h2>Leave Requests History</h2>
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
              {loading ? (
                  <div className="alert alert-info">Loading...</div>
                ) : noData ? (
                  <div className="alert alert-warning">No data found</div>
                ) : (
            <DataTable
              columns={columns}
              data={leaveRequests}
              pagination
              highlightOnHover
              striped
            />)}
          </div>
        </div>
      </div>
    </div>
  );

};

const styles = {
  updateButton: {
    padding: '5px 10px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  modal: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '600px'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '10px'
  },
  pending: {
    color: 'orange',
  },
  approved: {
    color: 'green',
  },  
  rejected: {
    color: 'red',
  }
};


export default LeaveRequestsEmployee; 
