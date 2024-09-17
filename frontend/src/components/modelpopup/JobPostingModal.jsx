import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import { base_url } from '../../base_urls';

const { Option } = Select;

const JobPostingModal = ({ isVisible, onJobPostingCreated, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${base_url}/api/departments`,{withCredentials: true});
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        message.error('Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, []);

  // Fetch positions by department
  useEffect(() => {
    if (selectedDepartment) {
      const fetchPositions = async () => {
        try {
          const response = await axios.get(`${base_url}/api/positions/by-department?departmentId=${selectedDepartment}`, {withCredentials: true});
          setPositions(response.data);
        } catch (error) {
          console.error('Error fetching positions:', error);
          message.error('Failed to fetch positions');
        }
      };
      fetchPositions();
    } else {
      setPositions([]);
    }
  }, [selectedDepartment]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi tới API
      const jobPostingData = {
        ...values,
        postedDate: values.postedDate.format("YYYY-MM-DD"),
        deadline: values.deadline.format("YYYY-MM-DD"),
      };
  
      await axios.post(`${base_url}/api/job-postings/create`, jobPostingData, { withCredentials: true });
      message.success('Job posting created successfully');
      form.resetFields();
      onJobPostingCreated(); // Gọi lại prop sau khi tạo thành công
    } catch (error) {
      // Xử lý lỗi từ phản hồi của server hoặc mạng
      if (error.response) {
        // Lỗi từ server
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message || 'An error occurred while creating the job posting';
        switch (statusCode) {
          case 400:
            message.error(`Bad Request: ${errorMessage}`);
            break;
          case 401:
            message.error('Unauthorized: Please log in');
            break;
          case 403:
            message.error('Forbidden: You do not have permission to perform this action');
            break;
          case 404:
            message.error('Not Found: The requested resource could not be found');
            break;
          case 500:
            message.error('Internal Server Error: Please try again later');
            break;
          default:
            message.error(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        // Lỗi mạng hoặc không nhận được phản hồi từ server
        message.error('Network error: Unable to reach the server');
      } else {
        // Các lỗi khác
        message.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!isVisible) {
      form.resetFields();
      setSelectedDepartment(null);
      setPositions([]);
    }
  }, [isVisible, form]);

  return (
    <Modal
    visible={isVisible}
    title="Create Job Posting"
    okText="Create"
    cancelText="Cancel"
    onCancel={onCancel}
    onOk={() => form.submit()}
    confirmLoading={loading}
    width="60%" // Đặt kích thước theo tỷ lệ phần trăm
  >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Job Title"
          rules={[{ required: true, message: 'Please enter the job title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the job description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="postedDate"
          label="Posted Date"
          rules={[{ required: true, message: 'Please select the posted date' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Application Deadline"
          rules={[{ required: true, message: 'Please select the application deadline' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please enter the job location' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="employmentType"
          label="Job Type"
          rules={[{ required: true, message: 'Please select the job type' }]}
        >
          <Select>
            <Option value="full-time">Full-time</Option>
            <Option value="part-time">Part-time</Option>
            <Option value="contract">Contract</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="departmentId"
          label="Department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select
            onChange={value => {
              setSelectedDepartment(value);
              form.setFieldsValue({ positionId: undefined }); // Clear selected position
            }}
          >
            {departments.map(department => (
              <Option key={department.id} value={department.id}>
                {department.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="positionId"
          label="Position"
          rules={[{ required: true, message: 'Please select a position' }]}
        >
          <Select>
            {positions.map(position => (
              <Option key={position.id} value={position.id}>
                {position.positionName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="requirements"
          label="Requirements"
          rules={[{ required: true, message: 'Please enter the job requirements' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="salaryRangeMin"
          label="Minimum Salary"
          rules={[{ required: true, message: 'Please enter the minimum salary' }]}
        >
          <InputNumber min={0} step={1000} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="salaryRangeMax"
          label="Maximum Salary"
          rules={[{ required: true, message: 'Please enter the maximum salary' }]}
        >
          <InputNumber min={0} step={1000} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobPostingModal;
