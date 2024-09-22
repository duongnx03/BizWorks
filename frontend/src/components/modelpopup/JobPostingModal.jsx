import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, InputNumber, Select, message, Upload } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { base_url } from "../../base_urls";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const JobPostingModal = ({ isVisible, onJobPostingCreated, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [imageList, setImageList] = useState([]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${base_url}/api/departments`, { withCredentials: true });
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        message.error('Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, []);

  // Fetch positions by department
  useEffect(() => {
    if (selectedDepartment) {
      const fetchPositions = async () => {
        try {
          const response = await axios.get(`${base_url}/api/positions/by-department?departmentId=${selectedDepartment}`, { withCredentials: true });
          setPositions(response.data);
        } catch (error) {
          console.error('Error fetching positions:', error);
          message.error('Failed to fetch positions');
        }
      };
      fetchPositions();
    } else {
      setPositions([]);
    }
  }, [selectedDepartment]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        message.error('Failed to fetch exchange rates');
      }
    };
    fetchExchangeRates();
  }, []);

  // Handle currency change
  const handleCurrencyChange = (newCurrency) => {
    const values = form.getFieldsValue();
    const minSalary = values.salaryRangeMin || 0;
    const maxSalary = values.salaryRangeMax || 0;

    if (newCurrency !== currency) {
      let newMinSalary = minSalary;
      let newMaxSalary = maxSalary;

      if (currency === 'USD' && newCurrency === 'VND') {
        newMinSalary *= exchangeRates['VND'];
        newMaxSalary *= exchangeRates['VND'];
      } else if (currency === 'VND' && newCurrency === 'USD') {
        newMinSalary /= exchangeRates['VND'];
        newMaxSalary /= exchangeRates['VND'];
      }

      form.setFieldsValue({
        salaryRangeMin: newMinSalary,
        salaryRangeMax: newMaxSalary,
      });

      setCurrency(newCurrency);
    }
  };

  // Format salary based on currency
  const formatSalary = (value) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  // Handle image upload
  const handleImageUpload = async (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setImageList(prev => [...prev, info.file.response]);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const jobPostingData = {
        ...values,
        postedDate: values.postedDate.format("YYYY-MM-DD"),
        deadline: values.deadline.format("YYYY-MM-DD"),
        salaryRangeMin: currency === 'USD' ? values.salaryRangeMin : values.salaryRangeMin / exchangeRates['VND'],
        salaryRangeMax: currency === 'USD' ? values.salaryRangeMax : values.salaryRangeMax / exchangeRates['VND'],
        images: imageList,
      };

      console.log('Submitting Job Posting Data:', jobPostingData);

      await axios.post(`${base_url}/api/job-postings/create`, jobPostingData, { withCredentials: true });
      message.success('Job posting created successfully');
      form.resetFields();
      setImageList([]);
      onJobPostingCreated();
    } catch (error) {
      console.error('Error creating job posting:', error);
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message || 'An error occurred while creating the job posting';
        switch (statusCode) {
          case 400:
            message.error(`Bad Request: ${errorMessage}`);
            break;
          case 401:
            message.error('Unauthorized: Please log in');
            break;
          case 403:
            message.error('Forbidden: You do not have permission to perform this action');
            break;
          case 404:
            message.error('Not Found: The requested resource could not be found');
            break;
          case 500:
            message.error('Internal Server Error: Please try again later');
            break;
          default:
            message.error(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        message.error('Network error: Unable to reach the server');
      } else {
        message.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      form.resetFields();
      setSelectedDepartment(null);
      setPositions([]);
      setImageList([]);
    }
  }, [isVisible, form]);

  return (
    <Modal
      visible={isVisible}
      title="Create Job Posting"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width="60%"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Job Title"
          rules={[{ required: true, message: 'Please enter the job title' }]} >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the job description' }]} >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="postedDate"
          label="Posted Date"
          rules={[{ required: true, message: 'Please select the posted date' }]} >
          <DatePicker
            format="YYYY-MM-DD"
            defaultValue={dayjs().startOf('day')}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Application Deadline"
          rules={[{ required: true, message: 'Please select the application deadline' }]} >
          <DatePicker
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please enter the job location' }]} >
          <Input />
        </Form.Item>
        <Form.Item
          name="employmentType"
          label="Job Type"
          rules={[{ required: true, message: 'Please select the job type' }]} >
          <Select>
            <Option value="full-time">Full-time</Option>
            <Option value="part-time">Part-time</Option>
            <Option value="contract">Contract</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="departmentId"
          label="Department"
          rules={[{ required: true, message: 'Please select a department' }]} >
          <Select
            onChange={value => {
              setSelectedDepartment(value);
              form.setFieldsValue({ positionId: undefined });
            }}>
            {departments.map(department => (
              <Option key={department.id} value={department.id}>
                {department.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="positionId"
          label="Position"
          rules={[{ required: true, message: 'Please select a position' }]} >
          <Select>
            {positions.map(position => (
              <Option key={position.id} value={position.id}>
                {position.positionName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="requirements"
          label="Requirements"
          rules={[{ required: true, message: 'Please enter the job requirements' }]} >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="salaryRangeMin"
          label="Minimum Salary"
          rules={[{ required: true, message: 'Please enter the minimum salary' }]} >
          <InputNumber
            formatter={value => formatSalary(value)}
            parser={value => value.replace(/[^\d]/g, '')}
          />
        </Form.Item>
        <Form.Item
          name="salaryRangeMax"
          label="Maximum Salary"
          rules={[{ required: true, message: 'Please enter the maximum salary' }]} >
          <InputNumber
            formatter={value => formatSalary(value)}
            parser={value => value.replace(/[^\d]/g, '')}
          />
        </Form.Item>
        <Form.Item label="Currency">
          <Select defaultValue="USD" onChange={handleCurrencyChange}>
            <Option value="USD">USD</Option>
            <Option value="VND">VND</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Images">
          <Upload
            name="images"
            action={`${base_url}/api/images/upload`}
            listType="picture"
            multiple
            onChange={handleImageUpload}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobPostingModal;
