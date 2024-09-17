import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Typography, Card, Spin, message, Button } from 'antd';
import axios from 'axios';
import { base_url } from '../../../base_urls'; // Đảm bảo bạn đã cấu hình base_url đúng

const { Title } = Typography;

const JobBoard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get(`${base_url}/api/job-postings/list`, { withCredentials: true });
        const currentDate = new Date();

        // Lọc các tin tuyển dụng dựa trên ngày đăng
        const filteredJobPostings = response.data.data.filter(posting => {
          const postedDate = new Date(posting.postedDate);
          return postedDate <= currentDate;
        });

        setJobPostings(filteredJobPostings);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tin tuyển dụng:', error);
        message.error('Không thể lấy danh sách tin tuyển dụng');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  return (
    <div className="job-postings-list" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Danh Sách Tin Tuyển Dụng</Title>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={jobPostings}
          renderItem={posting => (
            <List.Item>
              <Card
                title={<span style={{ fontWeight: 'bold' }}>{posting.title}</span>}
                extra={<Link to={`/job-postings/${posting.id}`}><Button type="primary">Xem Thêm</Button></Link>}
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}
              >
                <p>{posting.description}</p>
                <p><strong>Địa điểm:</strong> {posting.location}</p>
                <p><strong>Hạn chót:</strong> {new Date(posting.deadline).toLocaleDateString()}</p>
                <p><strong>Vị trí:</strong> {posting.positionName || 'N/A'}</p> {/* Hiển thị tên của Position */}
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default JobBoard;
