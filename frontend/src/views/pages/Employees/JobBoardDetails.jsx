import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, message, Button, Row, Col, Alert } from 'antd';
import axios from 'axios';
import { base_url } from '../../../base_urls';
import JobApplicationModal from '../../../components/modelpopup/JobApplicationModal';

const { Title, Paragraph } = Typography;

const JobBoardDetail = () => {
  const { id } = useParams();
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
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div className="job-posting-detail" style={{ padding: '20px' }}>
      {loading ? (
        <Spin size="large" />
      ) : jobPosting ? (
        <Row justify="center">
          <Col xs={24} md={18} lg={14}>
            <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
              <Title level={2} style={{ color: '#333' }}>{jobPosting.title}</Title>
              
              <Paragraph style={{ fontSize: '16px', marginBottom: '20px' }}><strong>Mô tả:</strong></Paragraph>
              <Paragraph>{jobPosting.description}</Paragraph>
              
              <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Địa điểm:</Paragraph>
                  <Paragraph>{jobPosting.location}</Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Loại hình công việc:</Paragraph>
                  <Paragraph>{jobPosting.employmentType}</Paragraph>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Vị trí:</Paragraph>
                  <Paragraph>{jobPosting.positionName || 'N/A'}</Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Yêu cầu:</Paragraph>
                  <Paragraph>{jobPosting.requirements}</Paragraph>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Mức lương:</Paragraph>
                  <Paragraph>{formatSalary(jobPosting.salaryRangeMin, jobPosting.salaryRangeMax)}</Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Ngày đăng:</Paragraph>
                  <Paragraph>{new Date(jobPosting.postedDate).toLocaleDateString()}</Paragraph>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Paragraph style={{ fontWeight: 'bold' }}>Hạn nộp đơn:</Paragraph>
                  <Paragraph>{new Date(jobPosting.deadline).toLocaleDateString()}</Paragraph>
                </Col>
              </Row>

              <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginTop: '20px', width: '100%' }}>
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
