import React, { useState, useEffect } from "react";
import { Table, notification } from "antd";
import { Link } from "react-router-dom";
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import { base_url } from "../../../base_urls";
import { Avatar_02 } from "../../../Routes/ImagePath";

const openNotificationWithError = (message) => {
  notification.error({
    message: 'Error',
    description: <span style={{ color: '#ed2d33' }}>{message}</span>,
    placement: 'topRight',
  });
};

const openNotificationWithSuccess = (message) => {
  notification.success({
    message: 'Success',
    description: (
      <div>
        <span style={{ color: '#09b347' }}>{message}</span>
        <button
          onClick={() => notification.destroy()}
          style={{
            border: 'none',
            background: 'transparent',
            float: 'right',
            cursor: 'pointer',
          }}
        >
          <CloseCircleOutlined style={{ color: '#09b347' }} />
        </button>
      </div>
    ),
    placement: 'topRight',
    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  });
};

const ViolationComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("userRole"));

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violation_complaints`, { withCredentials: true });
      const sortedComplaints = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(sortedComplaints);
      updateStats(sortedComplaints);
    } catch (error) {
      openNotificationWithError(`Error fetching complaints: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (violationId, newStatus) => {
    try {
        const response = await axios.put(
            `${base_url}/api/violation_complaints/${violationId}/status`,
            null,
            { params: { newStatus }, withCredentials: true }
        );

        // In ra phản hồi từ server
        console.log('Response from server:', response.data);

        if (response.data.status === 'SUCCESS') { // Kiểm tra trường status
            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint) =>
                    complaint.id === violationId ? { ...complaint, status: newStatus } : complaint
                )
            );

            openNotificationWithSuccess(response.data.message);
        } else {
            // Thông báo nếu không thành công
            openNotificationWithError(response.data.message || 'Failed to update status.');
        }
    } catch (error) {
        // In ra lỗi chi tiết
        console.error('Error updating status:', error);
        openNotificationWithError(`Error updating status: ${error.response?.data?.message || error.message}`);
    }
};



  const updateStats = (complaintsData) => {
    const totalComplaints = complaintsData.length;
    const resolvedComplaints = complaintsData.filter(c => c.status === "Resolved").length;
    const pendingComplaints = complaintsData.filter(c => c.status === "Pending").length;

    setStatsData([
      { title: "Total Complaints", value: totalComplaints, month: "this month" },
      { title: "Resolved Complaints", value: resolvedComplaints, month: "this month" },
      { title: "Pending Complaints", value: pendingComplaints, month: "this month" },
    ]);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const userElements = complaints.map((item, index) => ({
    key: index,
    id: item.id,
    index: index + 1,
    employee: item.employee?.fullname || "Loading...",
    empcode: item.employee?.empCode || "Loading...",
    avatar: item.employee?.avatar || Avatar_02,
    description: item.description || "Loading...",
    violationType: item.violation.violationType?.type || "Loading...",
    date: item.createdAt || "Loading...",
    status: item.status || "Loading...",
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (text, record) => <span>{record.index}</span>,
    },
    {
      title: "Employee",
      dataIndex: "employee",
      render: (text, record) => (
        <span className="table-avatar">
          <Link to="/client-profile" className="avatar">
            <img alt="" src={record.avatar} />
          </Link>
          <Link to="/client-profile">
            {text} - {record.empcode}
          </Link>
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Violation Type",
      dataIndex: "violationType",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          {userRole === "MANAGE" || userRole === "ADMIN" ? (
            <div className="dropdown action-label">
              <button
                className="btn btn-white btn-sm btn-rounded dropdown-toggle"
                type="button"
                id={`dropdownMenuButton-${record.id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  className={
                    text === "Pending"
                      ? "far fa-dot-circle text-danger"
                      : text === "Resolved"
                      ? "far fa-dot-circle text-success"
                      : "far fa-dot-circle text-secondary"
                  }
                />{" "}
                {text}
              </button>
              <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${record.id}`}>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleStatusChange(record.id, "Resolved")}
                  >
                    <i className="far fa-dot-circle text-success" /> Resolved
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleStatusChange(record.id, "Rejected")}
                  >
                    <i className="far fa-dot-circle text-secondary" /> Rejected
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <span>
              <i
                className={
                  text === "Pending"
                    ? "far fa-dot-circle text-danger"
                    : text === "Resolved"
                    ? "far fa-dot-circle text-success"
                    : "far fa-dot-circle text-secondary"
                }
              />{" "}
              {text}
            </span>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {loading ? (
            <div className="text-center w-100">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                {statsData.map((data, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="stats-info">
                      <h6>{data.title}</h6>
                      <h4>{data.value} <small>{data.month}</small></h4>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={userElements}
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViolationComplaint;
