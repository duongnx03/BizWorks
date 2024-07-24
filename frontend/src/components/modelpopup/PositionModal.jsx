import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import { base_url } from "../../base_urls";

const PositionModal = ({ isVisible, onClose, onPositionCreated, departmentId }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(`${base_url}/api/departments`);
          setDepartments(response.data);
        } catch (error) {
          message.error("Failed to fetch departments");
        }
      };

      const fetchEmployees = async () => {
        try {
          const response = await axios.get(`${base_url}/api/employees`);
          setEmployees(response.data);
        } catch (error) {
          message.error("Failed to fetch employees");
        }
      };

      fetchDepartments();
      fetchEmployees();
    }
  }, [isVisible]);

  const handleCreatePosition = async (values) => {
    try {
      const response = await axios.post(`${base_url}/api/positions`, {
        positionName: values.positionName,
        departmentId: departmentId, // Pass the department ID
        departmentName: values.departmentName || null, // Pass department name if needed
        employee: values.employeeId ? { id: values.employeeId } : null, // Pass full employee DTO if selected
      });

      if (response.status === 201) {
        message.success("Position created successfully");
        form.resetFields();
        onPositionCreated();
        onClose();
      } else {
        message.error("Failed to create position");
      }
    } catch (error) {
      message.error("Failed to create position");
    }
  };

  return (
    <Modal
      title="Add Position"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreatePosition}
      >
        <Form.Item
          label="Position Name"
          name="positionName"
          rules={[{ required: true, message: "Please input the position name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Employee"
          name="employeeId"
        >
          <Select placeholder="Select an employee (Optional)">
            {employees.map(emp => (
              <Select.Option key={emp.id} value={emp.id}>
                {emp.fullname} {/* Display the employee's fullname */}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ margin: '0 8px' }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PositionModal;
