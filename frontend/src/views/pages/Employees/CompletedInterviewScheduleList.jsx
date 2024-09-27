import React, { useContext, useEffect, useState } from "react";
import { Table, message, Select, Card, Typography, Row, Col, Spin, Tooltip } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import { AuthContext } from "../../../Routes/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { Title } = Typography;

const CompletedInterviewScheduleList = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const [interviewSchedules, setInterviewSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchInterviewSchedules();
  }, [isLoggedIn, userRole, navigate]);

  const fetchInterviewSchedules = async () => {
    try {
      const response = await axios.get(`${base_url}/api/interview-schedules/completed`, { withCredentials: true });
      setInterviewSchedules(response.data);
    } catch (error) {
      console.error("Error fetching interview schedules:", error);
      message.error("Failed to fetch interview schedules");
      setInterviewSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${base_url}/api/interview-schedules/${id}/status`, { status: newStatus }, { withCredentials: true });
      message.success("Status updated successfully");
      fetchInterviewSchedules();
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
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
      dataIndex: "jobApplication",
      render: (jobApplication) => (
        <Tooltip title={jobApplication?.applicantName || "N/A"}>
          {jobApplication?.applicantName || "N/A"}
        </Tooltip>
      ),
      width: "20%",
    },
    {
      title: "Applicant Email",
      dataIndex: "jobApplication",
      render: (jobApplication) => (
        <Tooltip title={jobApplication?.applicantEmail || "N/A"}>
          {jobApplication?.applicantEmail || "N/A"}
        </Tooltip>
      ),
      width: "20%",
    },
    {
      title: "Applicant Phone",
      dataIndex: "jobApplication",
      render: (jobApplication) => (
        <Tooltip title={jobApplication?.applicantPhone || "N/A"}>
          {jobApplication?.applicantPhone || "N/A"}
        </Tooltip>
      ),
      width: "15%",
    },
    {
      title: "Interview Date",
      dataIndex: "interviewDate",
      width: "25%",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Interviewers",
      dataIndex: "interviewers",
      width: "20%",
      render: (interviewers) => interviewers.join(", "), // Adjust based on your data structure
    },
    {
      title: "Location",
      dataIndex: "location",
      width: "20%",
    },
  ];
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3}>Interview Schedules</Title>
            </Col>
            <Col>
            </Col>
          </Row>
          {loading ? (
            <Row justify="center" align="middle" style={{ height: '60vh' }}>
              <Spin size="large" />
            </Row>
          ) : (
            <Table
              columns={columns}
              dataSource={interviewSchedules}
              className="table-striped"
              rowKey="id"
              pagination={{ pageSize: 10 }}
              bordered
              size="middle"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default CompletedInterviewScheduleList;
