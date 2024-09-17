import React, { useEffect, useState } from "react";
import { Typography, Card, Spin, Button, message } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls"; 
import { useParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ExamResultPage = () => {
  const { examId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const employeeId = 1; 

  useEffect(() => {
    if (examId) {
      fetchExamResult();
    }
  }, [examId]);

  const fetchExamResult = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/answers/exams/${examId}/employees/${employeeId}/total-score`, { withCredentials: true });
      setResult(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy kết quả bài thi:", error.response ? error.response.data : error.message);
      message.error("Lấy kết quả bài thi không thành công.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/'); 
  };

  return (
    <div className="exam-result-page" style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Kết Quả Bài Kiểm Tra
      </Title>

      {loading ? (
        <Spin tip="Đang tải kết quả..." size="large" />
      ) : result !== null ? (
        <Card
          style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Title level={3}>Tổng Điểm: {result}</Title>
          <Text>Thời gian làm bài: (Chưa được cung cấp bởi API)</Text>
          <div style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={handleBack}>
              Quay Lại
            </Button>
          </div>
        </Card>
      ) : (
        <Text>Không có kết quả nào để hiển thị.</Text>
      )}
    </div>
  );
};

export default ExamResultPage;
