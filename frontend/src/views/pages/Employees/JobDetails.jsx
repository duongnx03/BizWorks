import React from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { base_url } from '../../base_urls';

const JobDetailsModal = ({ visible, job, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const applicationData = {
        ...values,
        jobPostingId: job.id,
      };

      await axios.post(`${base_url}/api/job-applications`, applicationData);
      message.success('Application submitted successfully');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Job Details"
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <h2>{job.title}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Posted Date:</strong> {job.postedDate}</p>
      <p><strong>Deadline:</strong> {job.deadline}</p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Your Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Your Email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="resume"
          label="Resume (Link or File)"
          rules={[{ required: true, message: 'Please provide a link to your resume or upload a file' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coverLetter"
          label="Cover Letter (Optional)"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobDetailsModal;
