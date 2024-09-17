// src/pages/AssignEmployeesToTrainingProgram.js

import React, { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { base_url } from "../../../base_urls";

const { Option } = Select;

const AssignEmployeesToTrainingProgram = () => {
  const { programId } = useParams(); // Sử dụng useParams để lấy programId từ URL
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

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
    }
  };

  const handleSubmit = async (values) => {
    try {
      await axios.put(`${base_url}/api/training-programs/${programId}/employees`, { employeeIds: values.employeeIds }, { withCredentials: true });
      message.success("Employees assigned successfully");
    } catch (error) {
      console.error("Error assigning employees:", error);
      message.error("Failed to assign employees");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="employeeIds"
        label="Employees"
        rules={[{ required: true, message: 'Please select employees!' }]}
      >
        <Select
          mode="multiple"
          allowClear
          placeholder="Select employees"
          options={employees.map(emp => ({ value: emp.id, label: emp.fullname }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Assign Employees
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AssignEmployeesToTrainingProgram;
