import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { base_url } from "../../base_urls";

const { Option } = Select;

const PositionModal = ({ visible, onClose, onPositionCreated, position, departmentId }) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchEmployees();
    }
    if (position) {
      form.setFieldsValue({
        positionName: position.positionName,
        basicSalary: position.basicSalary,
        description: position.description,
        employeeIds: position.employees ? position.employees.map(emp => emp.id) : [], // Set employeeIds if available
      });
    } else {
      form.resetFields();
    }
  }, [visible, position, form]);

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
      if (position) {
        await axios.put(`${base_url}/api/positions/${position.id}`, {
          ...values,
          department: { id: departmentId },
        }, { withCredentials: true });
      } else {
        await axios.post(`${base_url}/api/positions`, {
          ...values,
          department: { id: departmentId },
        }, { withCredentials: true });
      }
      message.success(`Position ${position ? 'updated' : 'created'} successfully.`);
      onPositionCreated();
    } catch (error) {
      message.error("Failed to save position.");
    }
  };

  return (
    <Modal
      visible={visible}
      title={position ? "Edit Position" : "Add Position"}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="positionName"
          label="Position Name"
          rules={[{ required: true, message: 'Please input the position name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="basicSalary"
          label="Basic Salary"
          rules={[{ required: true, message: 'Please input the basic Salary!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {position ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PositionModal;
