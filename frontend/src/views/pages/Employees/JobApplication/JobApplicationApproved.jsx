import React, { useContext, useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, DatePicker, Input, Select } from "antd";
import axios from "axios";
import { base_url } from "../../../../base_urls";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Routes/AuthContext";
import moment from "moment";

const JobApplicationApproved = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userRole !== "ADMIN") {
      navigate("/login");
      return;
    }
    fetchApprovedRequests();
    fetchEmployees();
  }, [isLoggedIn, userRole, navigate]);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`${base_url}/api/job-applications/accepted`, { withCredentials: true });
      setApprovedRequests(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      message.error("Failed to fetch approved requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${base_url}/api/employee/human-resources`, { withCredentials: true });
      const employeesWithFullName = response.data.map(employee => ({
        id: employee.id,
        name: employee.fullname || `${employee.firstName} ${employee.lastName}`,
      }));
      setEmployees(employeesWithFullName);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees. Please try again.");
    }
  };

  const columns = [
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "applicantEmail",
      width: "25%",
    },
    {
      title: "Phone",
      dataIndex: "applicantPhone",
      width: "20%",
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
      width: "15%",
    },
    {
      title: "Resume",
      render: (_, record) => {
        const resumeUrl = record.resumeUrl;
        return (
          <Button
            onClick={() => {
              if (resumeUrl) {
                window.open(`${base_url}/api/files/view/${resumeUrl}`, "_blank");
              } else {
                message.error("No resume available");
              }
            }}
          >
            View Resume
          </Button>
        );
      },
      width: "15%",
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
    form.resetFields();
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
      fetchApprovedRequests();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      message.error("Failed to schedule interview. Please check the information and try again.");
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
            rules={[{ required: true, message: "Please select interview date!" }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Interviewers"
            name="interviewers"
            rules={[{ required: true, message: "Please select interviewers!" }]}
          >
            <Select mode="multiple" placeholder="Select interviewers">
              {employees.map(employee => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input location!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobApplicationApproved;
