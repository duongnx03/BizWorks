import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Typography, Card, Spin, message, Button, Select, Input } from 'antd';
import axios from 'axios';
import { base_url } from '../../../base_urls';

const { Title } = Typography;
const { Option } = Select;

const JobBoard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [expiredJobPostings, setExpiredJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [positionId, setPositionId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get(`${base_url}/api/job-postings/list`, { withCredentials: true });
        const currentDate = new Date();

        const filteredJobPostings = response.data.data.filter(posting => {
          const postedDate = new Date(posting.postedDate);
          const matchesLocation = posting.location.toLowerCase().includes(location.toLowerCase());
          const matchesEmploymentType = employmentType ? posting.employmentType === employmentType : true;
          const matchesDepartment = departmentId ? posting.departmentId === departmentId : true;
          const matchesPosition = positionId ? posting.positionId === positionId : true;

          return postedDate <= currentDate && matchesLocation && matchesEmploymentType && matchesDepartment && matchesPosition;
        });

        const currentExpiredJobPostings = filteredJobPostings.filter(posting => {
          const deadline = new Date(posting.deadline);
          return deadline < currentDate;
        });

        setJobPostings(filteredJobPostings.filter(posting => !currentExpiredJobPostings.includes(posting)));
        setExpiredJobPostings(currentExpiredJobPostings);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tin tuyển dụng:', error);
        message.error('Không thể lấy danh sách tin tuyển dụng');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [location, employmentType, departmentId, positionId]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${base_url}/api/departments`, { withCredentials: true });
        setDepartments(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
        message.error('Không thể lấy danh sách phòng ban');
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      if (departmentId) {
        try {
          const response = await axios.get(`${base_url}/api/positions/by-department`, {
            params: { departmentId },
            withCredentials: true,
          });
          setPositions(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách vị trí:', error);
          message.error('Không thể lấy danh sách vị trí');
        }
      } else {
        setPositions([]);
      }
    };

    fetchPositions();
  }, [departmentId]);

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'N/A';
  };

  return (
    <div className="job-postings-list" style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#1890ff' }}>
        Danh Sách Tin Tuyển Dụng
      </Title>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Input
          placeholder="Tìm theo địa điểm"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ width: '200px', marginRight: '10px' }}
        />
        <Select
          placeholder="Chọn loại công việc"
          value={employmentType}
          onChange={value => setEmploymentType(value)}
          style={{ width: '200px', marginRight: '10px' }}
        >
          <Option value="">Tất cả</Option>
          <Option value="full-time">Toàn thời gian</Option>
          <Option value="part-time">Bán thời gian</Option>
        </Select>
        <Select
          placeholder="Chọn phòng ban"
          value={departmentId}
          onChange={value => setDepartmentId(value)}
          style={{ width: '200px', marginRight: '10px' }}
        >
          <Option value="">Tất cả</Option>
          {departments.map(department => (
            <Option key={department.id} value={department.id}>
              {department.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Chọn vị trí"
          value={positionId}
          onChange={value => setPositionId(value)}
          style={{ width: '200px' }}
          disabled={!departmentId}
        >
          <Option value="">Tất cả</Option>
          {positions.map(position => (
            <Option key={position.id} value={position.id}>
              {position.positionName}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={jobPostings}
          renderItem={posting => (
            <List.Item>
              <Card
                title={<span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{posting.title}</span>}
                extra={
                  <div>
                    <Link to={`/job-postings/${posting.id}`}>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#1890ff',
                          borderColor: '#1890ff',
                          borderRadius: '5px',
                          fontWeight: 'bold',
                        }}
                      >
                        Xem Thêm
                      </Button>
                    </Link>
                  </div>
                }
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  padding: '20px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                hoverable
              >
                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>{posting.description}</p>
                <p><strong>Địa điểm:</strong> {posting.location}</p>
                <p><strong>Hạn chót:</strong> {new Date(posting.deadline).toLocaleDateString()}</p>
                <p><strong>Vị trí:</strong> {posting.positionName || 'N/A'}</p>
                <p><strong>Loại hình công việc:</strong> {posting.employmentType || 'N/A'}</p>
                <p><strong>Phòng ban:</strong> {getDepartmentName(posting.departmentId)}</p>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Title level={3} style={{ marginTop: '40px', color: '#ff6347', textAlign: 'center' }}>
        Tin Tuyển Dụng Hết Hạn
      </Title>
      {expiredJobPostings.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Không có tin tuyển dụng hết hạn</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={expiredJobPostings}
          renderItem={posting => (
            <List.Item>
              <Card
                title={<span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{posting.title}</span>}
                extra={
                  <div>
                    <Link to={`/job-postings/${posting.id}`}>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#1890ff',
                          borderColor: '#1890ff',
                          borderRadius: '5px',
                          fontWeight: 'bold',
                        }}
                      >
                        Xem Thêm
                      </Button>
                    </Link>
                  </div>
                }
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  padding: '20px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                hoverable
              >
                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>{posting.description}</p>
                <p><strong>Địa điểm:</strong> {posting.location}</p>
                <p><strong>Hạn chót:</strong> {new Date(posting.deadline).toLocaleDateString()}</p>
                <p><strong>Vị trí:</strong> {posting.positionName || 'N/A'}</p>
                <p><strong>Loại hình công việc:</strong> {posting.employmentType || 'N/A'}</p>
                <p><strong>Phòng ban:</strong> {getDepartmentName(posting.departmentId)}</p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default JobBoard;
