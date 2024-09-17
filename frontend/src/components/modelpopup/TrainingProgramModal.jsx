import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, message } from "antd";
import axios from "axios";
import { base_url } from "../../base_urls";

const { Option } = Select;

const TrainingProgramModal = ({ isVisible, onCancel, onTrainingProgramCreated }) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    if (isVisible) {
      fetchEmployees();
    }
  }, [isVisible]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${base_url}/api/employee/getAllEmployees`, { withCredentials: true });
      if (response.data.status === "SUCCESS" && Array.isArray(response.data.data)) {
        setEmployees(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        message.error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const { title, description, type, startDate, endDate, employeeIds } = values;
      const response = await axios.post(`${base_url}/api/training-programs`, { title, description, type, startDate, endDate }, { withCredentials: true });
      const trainingProgramId = response.data.id;

      if (employeeIds && employeeIds.length > 0) {
        await axios.put(`${base_url}/api/training-programs/${trainingProgramId}/employees`, employeeIds, { withCredentials: true });
      }
      
      message.success("Training program created successfully");
      onTrainingProgramCreated();
    } catch (error) {
      console.error("Error creating training program:", error);
      message.error("Failed to create training program");
    }
  };

  return (
    <Modal
      visible={isVisible}
      title="Create Training Program"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please select the type!' }]}
        >
          <Select>
            <Option value="ONLINE">Online</Option>
            <Option value="OFFLINE">Offline</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select the start date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select the end date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="employeeIds"
          label="Assign Employees"
          rules={[{ required: false, message: 'Please select employees!' }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Select employees"
            loading={loadingEmployees}
            options={employees.map(emp => ({ value: emp.id, label: emp.fullname }))} // Hiển thị fullname
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TrainingProgramModal;
