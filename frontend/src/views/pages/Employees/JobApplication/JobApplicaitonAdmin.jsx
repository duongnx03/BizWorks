import React, { useContext, useEffect, useState } from "react";
import { Table, Button, message, Modal } from "antd";
import axios from "axios";
import { base_url } from "../../../../base_urls";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Routes/AuthContext"; // Adjust the import path as needed

const JobApplicationAdmin = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'ADMIN') {
      navigate('/login'); // Adjust the path as needed
      return;
    }
    fetchRequests();
  }, [isLoggedIn, userRole, navigate]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${base_url}/api/job-applications/pending-status-change-requests`, { withCredentials: true });
      if (response.data?.data) {
        setRequests(response.data.data);
      } else {
        setRequests([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching status change requests:", error);
      message.error("Failed to fetch status change requests");
      setRequests([]);
      setLoading(false);
    }
  };

  const openApprovalModal = (requestId) => {
    setRequestToApprove(requestId);
    setApprovalModalOpen(true);
  };

  const handleApprovalModalClose = () => {
    setApprovalModalOpen(false);
    setRequestToApprove(null);
  };

  const viewResume = (fileName) => {
    const url = `${base_url}/api/files/view/${fileName}`;
    window.open(url, '_blank');
  };

  const downloadResume = (fileName) => {
    const url = `${base_url}/api/files/download/${fileName}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const approveRequest = async () => {
    try {
      if (requestToApprove) {
        await axios.patch(`${base_url}/api/job-applications/approve-status-change/${requestToApprove}`, null, {
          withCredentials: true
        });
        fetchRequests();
        handleApprovalModalClose();
        message.success("Status change request approved successfully");
      }
    } catch (error) {
      console.error("Error approving status change request:", error);
      message.error("Failed to approve status change request");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Applicant Name",
      dataIndex: ['jobApplication', 'applicantName'], // Sửa lại dataIndex
      width: "20%",
    },
    {
      title: "Applicant Email",
      dataIndex: ['jobApplication', 'applicantEmail'], // Sửa lại dataIndex
      width: "25%",
    },
    {
      title: "Requested Status",
      dataIndex: "newStatus",
      width: "20%",
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      width: "15%",
    },
    {
      title: "Resume",
      render: (_, record) => {
        const resumeUrl = record.jobApplication?.resumeUrl;
        return (
          <div>
            <Button onClick={() => {
              if (resumeUrl) {
                viewResume(resumeUrl);
              } else {
                message.error("No resume available");
              }
            }} style={{ marginRight: '8px' }}>
              View Resume
            </Button>
            <Button onClick={() => downloadResume(resumeUrl)} disabled={!resumeUrl}>
              Download Resume
            </Button>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            onClick={() => openApprovalModal(record.id)}
            type="link"
            style={{ marginRight: '8px' }}
          >
            Approve
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="header-actions" style={{ marginBottom: '16px' }}>
              <Link to="/job-application-list/approve/admin">
                <Button type="primary">View Approved Requests</Button>
              </Link>
              <Link to="/job-application-list/approved/admin">
                <Button type="primary" style={{ marginRight: '8px' }}>
                  View Approved Requests
                </Button>
              </Link>
            </div>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={requests}
                loading={loading}
                className="table-striped"
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>

      {approvalModalOpen && (
        <Modal
          title="Approve Status Change Request"
          visible={approvalModalOpen}
          onOk={approveRequest}
          onCancel={handleApprovalModalClose}
        >
          <p>Are you sure you want to approve this status change request?</p>
        </Modal>
      )}
    </div>
  );
};

export default JobApplicationAdmin;
