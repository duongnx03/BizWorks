import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Pie } from 'react-chartjs-2';
import Breadcrumbs from "../../../components/Breadcrumbs";

const LeaveRequestsLeader = () => {
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
    leaderStatus: ''
  });

  const [employeeStatistics, setEmployeeStatistics] = useState([]);
  const [leaveTypeStatistics, setLeaveTypeStatistics] = useState([]);

  const leaveTypes = ["SICK", "MATERNITY", "PERSONAL", "BEREAVEMENT", "MARRIAGE", "CIVIC_DUTY", "OTHER"];
  const leaderStatuses = ["Pending", "Approved", "Rejected"];

  useEffect(() => {
    fetchLeaveRequests();
    fetchStatistics(searchCriteria);
    const interval = setInterval(() => {
        fetchLeaveRequests();
      }, 60000);
  
      return () => clearInterval(interval);
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/leave-requests/leader', { withCredentials: true });
      if (response.data.length === 0) {
        setNoData(true);
      } else {
        setLeaveRequests(response.data);
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
    if (searchCriteria.leaderStatus) criteria.status = searchCriteria.leaderStatus;
  
    try {
      const response = await axios.post('http://localhost:8080/api/leave-requests/leader/search', criteria, { withCredentials: true });
      setLeaveRequests(response.data);
      setNoData(response.data.length === 0);

       fetchStatistics(criteria);
    } catch (error) {
      console.error('Error searching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this leave request?")) {
      try {
        await axios.put(`http://localhost:8080/api/leave-requests/leader/approve/${id}`, {}, { withCredentials: true });
        fetchLeaveRequests();
        setModalIsOpen(false);
      } catch (error) {
        console.error('Error approving leave request:', error.message);
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this leave request?")) {
      try {
        await axios.put(`http://localhost:8080/api/leave-requests/leader/reject/${id}`, {}, { withCredentials: true });
        fetchLeaveRequests();
        setModalIsOpen(false);
      } catch (error) {
        console.error('Error rejecting leave request:', error.message);
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

    const getStatusDisplay = (request) => {
        if (request.status === 'Pending' && !request.leaderStatus) {
            return <span style={{ color: 'orange' }}>Pending</span>;
        } 
        // else if(request.status === 'Rejected'){
        //     return <span style={{ color: 'red' }}>Rejected</span>;
        // } else if(request.status === 'Approved'){
        //     return <span style={{ color: 'green' }}>Approved</span>;
        // }
         else if (request.leaderStatus === 'Rejected') {
            return <span style={{ color: 'red' }}>Rejected</span>;
        } else if (request.leaderStatus === 'Approved' && request.status === 'Approved') {
            return <span style={{ color: 'green' }}>Approved</span>;
        } else if (request.leaderStatus === 'Approved' && request.status === 'Pending') {
            return <span style={{ color: 'purple ' }}>Pending A</span>;
        } else if (request.leaderStatus === 'Approved' && request.status === 'Rejected') {
            return <span style={{ color: 'red ' }}>Reject A</span>;
        }
        return <span>{request.status}</span>;
    };

  const fetchStatistics = async (criteria = {}) => {
    try {
      const response = await axios.get('http://localhost:8080/api/leave-requests/statistics/leader', {
        params: criteria,
        withCredentials: true 
      });
      setEmployeeStatistics(response.data.leaveDaysPerEmployee);
      setLeaveTypeStatistics(response.data.leaveTypeCounts);
    } catch (error) {
      console.error('There was an error fetching the statistics!', error);
    }
  };

  const leaveDaysData = {
    labels: Object.keys(employeeStatistics),
    datasets: [{
      data: Object.values(employeeStatistics),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56']
    }]
  };

  const leaveTypeData = {
    labels: Object.keys(leaveTypeStatistics),
    datasets: [{
      data: Object.values(leaveTypeStatistics),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56']
    }]
  };
  const MAX_LEGEND_ITEMS = 10;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const originalLabels = chart.data.labels || [];
            const limitedLabels = originalLabels.slice(0, MAX_LEGEND_ITEMS);
            if (originalLabels.length > MAX_LEGEND_ITEMS) {
              limitedLabels.push('...'); 
            }
            return limitedLabels.map((label, index) => ({
              text: label,
              fillStyle: chart.data.datasets[0].backgroundColor[index],
            }));
          },
          padding: 20,
          boxWidth: 20,
        },
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    cutout: '50%',
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs maintitle="Leave Requests" title="Dashboard" subtitle="Leave Request"/>
          <div className="row" style={{ flexDirection: 'column' }}>
            <div className="col-md-12">
              {/* Search Form */}
              <div className="search-form" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  StartDate:<input type="date" name="startDate" value={searchCriteria.startDate} onChange={handleSearchChange} max={searchCriteria.endDate} style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '5px' }} />
                  
                  EndDate:<input type="date" name="endDate" value={searchCriteria.endDate} onChange={handleSearchChange} min={searchCriteria.startDate} style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '5px' }} />
                  
                  <select name="leaveType" value={searchCriteria.leaveType} onChange={handleSearchChange} style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '5px' }}>
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                  </select>
                  
                  <select name="leaderStatus" value={searchCriteria.leaderStatus} onChange={handleSearchChange} style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '5px' }}>
                    <option value="">Select Status</option>
                    {leaderStatuses.map(leaderStatus => (<option key={leaderStatus} value={leaderStatus}>{leaderStatus}</option>))}
                  </select>
                  
                  <input type="text" name="employeeName" placeholder="Employee Name" value={searchCriteria.employeeName} onChange={handleSearchChange} style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', minWidth: '200px' }} />
                  
                  <button onClick={handleSearch} className="btn btn-primary" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '30%', height: 'auto' }}>
                    <h3>Leave Days Per Employee</h3>
                    <Pie data={leaveDaysData} options={options}/>
                  </div>
                  <div style={{ width: '30%', height: 'auto' }}>
                    <h3>Leave Type Counts</h3>
                    <Pie data={leaveTypeData} options={options}/>
                  </div>
                </div>
              </div>
            </div>
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
                      if (statusOrder[a.leaderStatus] !== statusOrder[b.leaderStatus]) {
                        return statusOrder[a.leaderStatus] - statusOrder[b.leaderStatus];
                      }
                      return new Date(b.startDate) - new Date(a.startDate);
                    })
                    .map(request => (
                      <tr key={request.id}>
                        <td>{request.employeeName || 'Unknown Employee'}</td>
                        <td>{new Date(request.startDate).toLocaleDateString()}</td>
                        <td>{new Date(request.endDate).toLocaleDateString()}</td>
                        <td>{getStatusDisplay(request)}</td>
                        <td>
                          <button onClick={() => handleViewDetails(request.id, request.employeeId)} className="btn btn-info btn-sm">View Details</button>
                          
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
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
              <>
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
                    <td>{getStatusDisplay(selectedRequest)}</td>
                  </tr>
                  <tr>
                    <th>Remaining Leave Days</th>
                    <td>{remainingLeaveDays}</td>
                  </tr>
                </tbody>
              </table>
              {!selectedRequest.isActionTaken && selectedRequest.status === 'Pending' && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button  onClick={() => handleApprove(selectedRequest.id)} className="btn btn-success" style={{ marginRight: '10px' }}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(selectedRequest.id)} className="btn btn-danger">
                    Reject
                  </button>
                </div>
              )}
              </>
            ) : (
              <p>No details available</p>
            )}
          </div>
        </Modal>
      )}
      </div>

    </div>
    </div>
  );
};

export default LeaveRequestsLeader;