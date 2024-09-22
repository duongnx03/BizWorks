import React, { useContext, useEffect, useState } from "react";
import { Table, Button, message, Modal, Select, Form, Input } from "antd";
import axios from "axios";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../../components/SearchBox";
import { base_url } from "../../../../base_urls";
import { AuthContext } from "../../../../Routes/AuthContext"; // Thêm import này

const { Option } = Select;

const JobApplicationManage = () => {
  const { isLoggedIn, userRole, logout } = useContext(AuthContext); // Lấy giá trị từ AuthContext

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [applicationToUpdate, setApplicationToUpdate] = useState(null);
  const [status, setStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState("");


  useEffect(() => {
    // Kiểm tra quyền truy cập
    if (!isLoggedIn || userRole !== "MANAGE") {
      message.error("You do not have permission to access this page.");
      logout(); // Đăng xuất nếu không có quyền
    } else {
      fetchApplications();
    }
  }, [isLoggedIn, userRole, logout]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${base_url}/api/job-applications/all`, { withCredentials: true });
      if (response.data?.data) {
        setApplications(response.data.data);
      } else {
        setApplications([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      message.error("Failed to fetch job applications");
      setApplications([]);
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setApplicationToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setApplicationToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (applicationToDelete) {
        await axios.delete(`${base_url}/api/job-applications/${applicationToDelete}`, { withCredentials: true });
        fetchApplications();
        handleDeleteModalClose();
        message.success("Job application deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting job application:", error);
      message.error("Failed to delete job application");
    }
  };

  const openStatusModal = (application) => {
    setApplicationToUpdate(application);
    setStatus(application.status);
    setStatusModalOpen(true);
  };

  const handleStatusModalClose = () => {
    setStatusModalOpen(false);
    setApplicationToUpdate(null);
  };

  const sendRequest = async () => {
    try {
      if (applicationToUpdate) {
        const data = {
          newStatus: status,
          reason: status === "REJECTED" ? rejectionReason : null,
          
        };

        await axios.patch(`${base_url}/api/job-applications/request-status-change/${applicationToUpdate.id}`, null, {
          params: data,
          withCredentials: true
        });
        fetchApplications();
        handleStatusModalClose();
        message.success("Status change request sent successfully");
      }
    } catch (error) {
      console.error("Error sending status change request:", error);
      message.error("Failed to send status change request");
    }
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

  const applicationElements = applications.map(application => ({
    key: application.id,
    id: application.id,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    applicantPhone: application.applicantPhone,
    resumeUrl: application.resumeUrl,
    applicationDate: application.applicationDate,
    status: application.status,
  }));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "applicantName",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "applicantEmail",
      width: "25%",
    },
    {
      title: "Phone",
      dataIndex: "applicantPhone",
      width: "15%",
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      render: (fileName) => (
        <div>
          <Button onClick={() => viewResume(fileName)} style={{ marginRight: '8px' }}>
            View Resume
          </Button>
          <Button onClick={() => downloadResume(fileName)}>
            Download Resume
          </Button>
        </div>
      ),
      width: "25%",
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "30%",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            onClick={() => openStatusModal(record)}
            type="link"
            style={{ marginRight: '8px' }}
          >
            Send Request
          </Button>
          <Button
            onClick={() => openDeleteModal(record.id)}
            type="link"
            danger
          >
            Delete
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
            <div className="table-responsive">
              <SearchBox />
              <Table
                columns={columns}
                dataSource={applicationElements}
                loading={loading}
                className="table-striped"
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <DeleteModal
          id={applicationToDelete}
          Name="Delete Job Application"
          onDelete={handleDelete}
          onClose={handleDeleteModalClose}
        />
      )}

      {statusModalOpen && (
        <Modal
          title="Send Status Change Request"
          visible={statusModalOpen}
          onOk={sendRequest}
          onCancel={handleStatusModalClose}
        >
          <Form>
            <Form.Item label="Status">
              <Select value={status} onChange={(value) => setStatus(value)}>
                <Option value="PENDING">Pending</Option>
                <Option value="ACCEPTED">Accepted</Option>
                <Option value="REJECTED">Rejected</Option>
              </Select>
            </Form.Item>

            {status === "REJECTED" && (
              <Form.Item label="Rejection Reason">
                <Input.TextArea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection"
                />
              </Form.Item>
            )}
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default JobApplicationManage;
