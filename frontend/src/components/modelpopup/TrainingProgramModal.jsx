import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, message } from "antd";
import axios from "axios";
import { base_url } from "../../base_urls";
import moment from "moment";

const TrainingProgramModal = ({ isVisible, onCancel, onTrainingProgramCreated }) => {
  const [form] = Form.useForm();
  const [leaders, setLeaders] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newEmployees, setNewEmployees] = useState([]); // Trạng thái cho nhân viên mới
  const [selectedLeaderIds, setSelectedLeaderIds] = useState([]);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const [selectedNewEmployeeIds, setSelectedNewEmployeeIds] = useState([]); // Trạng thái cho nhân viên mới đã chọn
  const [employeeType, setEmployeeType] = useState("LEADER");

  useEffect(() => {
    if (isVisible) {
      fetchData();
      resetForm();
    }
  }, [isVisible]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${base_url}/api/employee/getLeadersAndManagers`, { withCredentials: true });
      if (response.data) {
        setLeaders(response.data.leaders || []);
        setManagers(response.data.managers || []);
      } else {
        message.error("No employee data found");
      }
  
      // Lấy danh sách nhân viên mới
      const newEmployeeResponse = await axios.get(`${base_url}/api/employee/getNewEmployees`, { withCredentials: true });
      // Đảm bảo newEmployees là một mảng
      setNewEmployees(Array.isArray(newEmployeeResponse.data) ? newEmployeeResponse.data : []);
    } catch (error) {
      message.error("Failed to load employee data");
      console.error("Error fetching employees:", error);
    }
  };
  const resetForm = () => {
    setSelectedLeaderIds([]);
    setSelectedManagerIds([]);
    setSelectedNewEmployeeIds([]); // Reset nhân viên mới đã chọn
    form.resetFields();
    form.setFieldsValue({ startDate: moment() });
  };

  const handleEmployeeTypeChange = (value) => {
    setEmployeeType(value);
    if (value === "LEADER") {
      setSelectedManagerIds([]);
    } else {
      setSelectedLeaderIds([]);
    }
  };

  const handleLeaderSelectChange = (selectedIds) => {
    setSelectedLeaderIds(selectedIds);
    setSelectedManagerIds(prev => prev.filter(id => !selectedIds.includes(id)));
  };

  const handleManagerSelectChange = (selectedIds) => {
    setSelectedManagerIds(selectedIds);
    setSelectedLeaderIds(prev => prev.filter(id => !selectedIds.includes(id)));
  };

  const handleNewEmployeeSelectChange = (selectedIds) => {
    setSelectedNewEmployeeIds(selectedIds);
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${base_url}/api/training-programs`, {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        participantIds: [
          ...selectedLeaderIds,
          ...selectedManagerIds,
          ...selectedNewEmployeeIds // Gộp ID từ danh sách nhân viên mới
        ],
      }, { withCredentials: true });

      message.success("Training program created successfully");
      onTrainingProgramCreated();
      resetForm();
    } catch (error) {
      message.error("Failed to create training program");
      console.error("Error creating training program:", error);
    }
  };

  const disabledDate = (current) => current && current < moment().startOf('day');

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
          <DatePicker format="YYYY-MM-DD" placeholder="Select start date" disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select the end date!' }]}>
          <DatePicker format="YYYY-MM-DD" placeholder="Select end date" disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item label="Select Employee Type" rules={[{ required: true, message: 'Please select an employee type!' }]}>
          <Select
            defaultValue="LEADER"
            onChange={handleEmployeeTypeChange}
            options={[
              { value: 'LEADER', label: 'Leader' },
              { value: 'MANAGER', label: 'Manager' },
            ]}
          />
        </Form.Item>

        {employeeType === "LEADER" && (
          <Form.Item label="Select Leaders" rules={[{ required: true, message: 'Please select at least one leader!' }]}>
            <Select
              mode="multiple"
              placeholder="Select Leaders"
              options={leaders.map(leader => ({
                value: leader.id,
                label: leader.fullname || 'Unknown Name',
              }))}
              onChange={handleLeaderSelectChange}
              value={selectedLeaderIds}
            />
          </Form.Item>
        )}

        {employeeType === "MANAGER" && (
          <Form.Item label="Select Managers" rules={[{ required: true, message: 'Please select at least one manager!' }]}>
            <Select
              mode="multiple"
              placeholder="Select Managers"
              options={managers.map(manager => ({
                value: manager.id,
                label: manager.fullname || 'Unknown Name',
              }))}
              onChange={handleManagerSelectChange}
              value={selectedManagerIds}
            />
          </Form.Item>
        )}

        {/* Phần chọn nhân viên mới */}
        <Form.Item label="Select New Employees">
          <Select
            mode="multiple"
            placeholder="Select New Employees"
            options={newEmployees.map(employee => ({
              value: employee.id,
              label: employee.fullname || 'Unknown Name',
            }))}
            onChange={handleNewEmployeeSelectChange}
            value={selectedNewEmployeeIds}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TrainingProgramModal;
