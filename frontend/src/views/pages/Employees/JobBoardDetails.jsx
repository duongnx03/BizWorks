import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, message, Button } from 'antd';
import axios from 'axios';
import { base_url } from '../../../base_urls'; // Đảm bảo bạn đã cấu hình base_url đúng
import JobApplicationModal from '../Employees/JobApplicationModal'; // Điều chỉnh đường dẫn nếu cần

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
        message.error('Failed to fetch job posting');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosting();
  }, [id]);

  return (
    <div className="job-posting-detail">
      {loading ? (
        <Spin size="large" />
      ) : jobPosting ? (
        <>
          <Card>
            <Title level={2}>{jobPosting.title}</Title>
            <Paragraph>{jobPosting.description}</Paragraph>
            <Paragraph><strong>Location:</strong> {jobPosting.location}</Paragraph>
            <Paragraph><strong>Employment Type:</strong> {jobPosting.employmentType}</Paragraph>
          <Paragraph><strong>Position:</strong> {jobPosting.positionName || 'N/A'}</Paragraph> {/* Hiển thị tên của Position */}

            <Paragraph><strong>Requirements:</strong> {jobPosting.requirements}</Paragraph>
            <Paragraph><strong>Salary Range:</strong> {jobPosting.salaryRangeMin} - {jobPosting.salaryRangeMax}</Paragraph>
            <Paragraph><strong>Posted Date:</strong> {new Date(jobPosting.postedDate).toLocaleDateString()}</Paragraph>
            <Paragraph><strong>Deadline:</strong> {new Date(jobPosting.deadline).toLocaleDateString()}</Paragraph>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Apply Now
            </Button>
          </Card>

          <JobApplicationModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            jobPostingId={jobPosting.id}
          />
        </>
      ) : (
        <p>Job posting not found</p>
      )}
    </div>
  );
};

export default JobBoardDetail;
