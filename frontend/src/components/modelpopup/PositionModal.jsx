import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import { base_url } from "../../base_urls";

const PositionModal = ({ visible, onClose, onPositionCreated, position, departmentId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (position) {
        form.setFieldsValue({
          positionName: position.positionName,
          basicSalary: position.basicSalary,
          description: position.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, position, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        departmentId, // Directly set departmentId instead of using an object
      };

      if (position) {
        await axios.put(`${base_url}/api/positions/${position.id}`, payload, { withCredentials: true });
        message.success("Position updated successfully.");
      } else {
        await axios.post(`${base_url}/api/positions`, payload, { withCredentials: true });
        message.success("Position created successfully.");
      }

      onPositionCreated();
      onClose();
    } catch (error) {
      console.error("Error saving position:", error);
      message.error("Failed to save position. Please ensure the department ID is valid.");
    } finally {
      setLoading(false);
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
          rules={[{ required: true, message: 'Please input the basic salary!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {position ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PositionModal;
