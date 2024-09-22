import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, message, Button, Row, Col, Alert } from 'antd';
import axios from 'axios';
import { base_url } from '../../../base_urls'; // Đảm bảo bạn đã cấu hình base_url đúng
import JobApplicationModal from '../../../components/modelpopup/JobApplicationModal'; // Điều chỉnh đường dẫn nếu cần

const { Title, Paragraph } = Typography;

const JobBoardDetail = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const [jobPosting, setJobPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await axios.get(`${base_url}/api/job-postings/${id}`, { withCredentials: true });
        setJobPosting(response.data.data);
      } catch (error) {
        console.error('Error fetching job posting:', error);
        message.error('Không thể tải tin tuyển dụng');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosting();
  }, [id]);

  const formatSalary = (min, max) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div className="job-posting-detail">
      {loading ? (
        <Spin size="large" />
      ) : jobPosting ? (
        <Row justify="center" style={{ padding: '20px' }}>
          <Col xs={24} md={18} lg={14}>
            <Card bordered={false}>
              <Title level={2}>{jobPosting.title}</Title>
              <Paragraph>{jobPosting.description}</Paragraph>
              <Paragraph>
                <strong>Địa điểm:</strong> {jobPosting.location}
              </Paragraph>
              <Paragraph>
                <strong>Loại hình công việc:</strong> {jobPosting.employmentType}
              </Paragraph>
              <Paragraph>
                <strong>Vị trí:</strong> {jobPosting.positionName || 'N/A'}
              </Paragraph>
              <Paragraph>
                <strong>Yêu cầu:</strong> {jobPosting.requirements}
              </Paragraph>
              <Paragraph>
                <strong>Mức lương:</strong> {formatSalary(jobPosting.salaryRangeMin, jobPosting.salaryRangeMax)}
              </Paragraph>
              <Paragraph>
                <strong>Ngày đăng:</strong> {new Date(jobPosting.postedDate).toLocaleDateString()}
              </Paragraph>
              <Paragraph>
                <strong>Hạn nộp đơn:</strong> {new Date(jobPosting.deadline).toLocaleDateString()}
              </Paragraph>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Ứng tuyển ngay
              </Button>
            </Card>

            <JobApplicationModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              jobPostingId={jobPosting.id}
            />
          </Col>
        </Row>
      ) : (
        <Row justify="center" style={{ padding: '20px' }}>
          <Col xs={24} md={18} lg={14}>
            <Alert message="Không tìm thấy tin tuyển dụng" type="error" showIcon />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default JobBoardDetail;
