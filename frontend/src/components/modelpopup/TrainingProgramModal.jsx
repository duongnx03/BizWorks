import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, DatePicker, Select, message, Divider } from "antd";
import axios from "axios";
import { base_url } from "../../base_urls";
import moment from "moment";

const TrainingProgramModal = ({ isVisible, onCancel, onTrainingProgramCreated }) => {
  const [form] = Form.useForm();
  const [newEmployees, setNewEmployees] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const fetchData = async () => {
    try {
      const [newEmployeesResponse, leadersResponse, managersResponse] = await Promise.all([
        axios.get(`${base_url}/api/training-programs/new-employees`, { withCredentials: true }),
        axios.get(`${base_url}/api/training-programs/leaders`, { withCredentials: true }),
        axios.get(`${base_url}/api/training-programs/managers`, { withCredentials: true }),
      ]);

      setNewEmployees(Array.isArray(newEmployeesResponse.data) ? newEmployeesResponse.data : []);
      setLeaders(Array.isArray(leadersResponse.data) ? leadersResponse.data : []);
      setManagers(Array.isArray(managersResponse.data) ? managersResponse.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data");
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
      setSelectedOption('');
      setSelectedEmployeeIds([]);
      form.setFieldsValue({ startDate: moment() });
    }
  }, [isVisible]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setSelectedEmployeeIds([]);
  };

  const handleEmployeeSelectChange = (selectedIds) => {
    setSelectedEmployeeIds(selectedIds);
  };

  const handleSubmit = async (values) => {
    const { title, description, startDate, endDate } = values;

    try {
      const response = await axios.post(`${base_url}/api/training-programs`, {
          title,
          description,
          startDate,
          endDate,
          participantIds: selectedEmployeeIds,
      }, { withCredentials: true });

      message.success("Training program created successfully");
      onTrainingProgramCreated();
      form.resetFields();
    } catch (error) {
      console.error("Error creating training program:", error);
      message.error("Failed to create training program");
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  return (
    <Modal
      visible={isVisible}
      title="Create Training Program"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
          <Input placeholder="Enter training program title" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
          <Input.TextArea rows={4} placeholder="Enter training program description" />
        </Form.Item>

        <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please select the start date!' }]}>
          <DatePicker 
            format="YYYY-MM-DD" 
            placeholder="Select start date" 
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select the end date!' }]}>
          <DatePicker 
            format="YYYY-MM-DD" 
            placeholder="Select end date" 
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Divider />

        <Form.Item label="Select Employee Type" rules={[{ required: true, message: 'Please select an employee type!' }]}>
          <Select
            placeholder="Select Employee Type"
            onChange={handleOptionChange}
            value={selectedOption}
          >
            <Select.Option value="new_employee">New Employee</Select.Option>
            <Select.Option value="leader">Leader</Select.Option>
            <Select.Option value="manager">Manager</Select.Option>
          </Select>
        </Form.Item>

        {selectedOption === 'new_employee' && (
          <Form.Item
            label="Select New Employees"
            rules={[{ required: true, message: 'Please select at least one new employee!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select New Employees"
              options={newEmployees.map(employee => ({ value: employee.id, label: employee.fullname }))} // Use fullname
              onChange={handleEmployeeSelectChange}
              value={selectedEmployeeIds}
            />
          </Form.Item>
        )}

        {selectedOption === 'leader' && (
          <Form.Item
            label="Select Leaders"
            rules={[{ required: true, message: 'Please select at least one leader!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Leaders"
              options={leaders.map(user => ({
                value: user.id,
                label: user.employee ? user.employee.fullname : 'Unknown Name' // Check if employee is defined
              }))}
              onChange={handleEmployeeSelectChange}
              value={selectedEmployeeIds}
            />
          </Form.Item>
        )}

        {selectedOption === 'manager' && (
          <Form.Item
            label="Select Managers"
            rules={[{ required: true, message: 'Please select at least one manager!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Managers"
              options={managers.map(user => ({
                value: user.id,
                label: user.employee ? user.employee.fullname : 'Unknown Name' // Check if employee is defined
              }))}
              onChange={handleEmployeeSelectChange}
              value={selectedEmployeeIds}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default TrainingProgramModal;
