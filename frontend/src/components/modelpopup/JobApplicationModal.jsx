import React from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { base_url } from '../../../base_urls';

const JobApplicationModal = ({ visible, onClose, jobPostingId }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState([]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error('Please upload your resume!');
      return;
    }

    const formData = new FormData();
    formData.append('applicantName', values.applicantName);
    formData.append('applicantEmail', values.applicantEmail);
    formData.append('applicantPhone', values.applicantPhone);
    formData.append('resume', fileList[0].originFileObj); // Ensure file is correctly referenced
    formData.append('jobPostingId', jobPostingId);

    try {
      await axios.post(`${base_url}/api/job-applications/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      message.success('Application submitted successfully');
      form.resetFields();
      setFileList([]); // Clear file list after successful submission
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Failed to submit application');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Apply for Job"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="applicantName"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="applicantEmail"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="applicantPhone"
          label="Phone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="resume"
          label="Resume"
          valuePropName="file"
          getValueFromEvent={(e) => e.fileList}
          rules={[{ required: true, message: 'Please upload your resume!' }]}
        >
          <Upload
            name="resume"
            listType="picture"
            showUploadList={true} // Show the uploaded file list
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Upload Resume</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobApplicationModal;
