import React, { useContext, useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, DatePicker, Input } from "antd";
import axios from "axios";
import { base_url } from "../../../../base_urls";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Routes/AuthContext";
import moment from "moment"; // Để xử lý thời gian

const JobApplicationApproved = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchApprovedRequests();
  }, [isLoggedIn, userRole, navigate]);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`${base_url}/api/job-applications/accepted`, { withCredentials: true });
      if (response.data?.data) {
        setApprovedRequests(response.data.data);
      } else {
        setApprovedRequests([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      message.error("Failed to fetch approved requests");
      setApprovedRequests([]);
      setLoading(false);
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
      dataIndex: "applicantName",
      width: "20%",
    },
    {
      title: "Applicant Email",
      dataIndex: "applicantEmail",
      width: "25%",
    },
    {
      title: "Applicant Phone",
      dataIndex: "applicantPhone",
      width: "20%",
    },
    {
      title: "Resume",
      render: (_, record) => {
        const resumeUrl = record.resumeUrl;
        return (
          <Button onClick={() => {
            if (resumeUrl) {
              window.open(`${base_url}/api/files/view/${resumeUrl}`, '_blank');
            } else {
              message.error("No resume available");
            }
          }}>
            View Resume
          </Button>
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => openModal(record)}>Schedule Interview</Button>
      ),
    },
  ];

  const openModal = (application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
    form.resetFields(); // Reset các trường trong form
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const interviewData = {
        jobApplicationId: selectedApplication.id,
        interviewDate: values.interviewDate.toISOString(),
        interviewers: values.interviewers,
        location: values.location,
      };

      await axios.post(`${base_url}/api/interview-schedules`, interviewData, { withCredentials: true });
      message.success("Interview scheduled successfully");
      setIsModalVisible(false);
      fetchApprovedRequests(); // Cập nhật danh sách sau khi tạo lịch phỏng vấn
    } catch (error) {
      console.error("Error scheduling interview:", error);
      message.error("Failed to schedule interview");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={approvedRequests}
                loading={loading}
                className="table-striped"
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Schedule Interview"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Interview Date"
            name="interviewDate"
            rules={[{ required: true, message: 'Please select interview date!' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Interviewers"
            name="interviewers"
            rules={[{ required: true, message: 'Please input interviewers!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please input location!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobApplicationApproved;
