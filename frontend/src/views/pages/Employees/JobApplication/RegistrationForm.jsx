// RegistrationForm.js
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { base_url } from "../../../../base_urls";

const RegistrationForm = ({ activity, onCancel }) => {
  const onFinish = async (values) => {
    try {
      await axios.post(`${base_url}/api/extracurricular-activities/{activityId}/register/{employeeId}`, {
        ...values,
        activityId: activity.id,
      }, { withCredentials: true });

      message.success(`Successfully registered for ${activity.title}`);
      onCancel(); // Close the modal after submission
    } catch (error) {
      console.error('Error registering:', error);
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter your name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Invalid email!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
