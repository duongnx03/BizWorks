import React, { useEffect, useState } from "react";
import { Form, Radio, Button, message, Card, Typography, Spin, Input, notification } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls"; 
import { useParams, useNavigate } from "react-router-dom"; 

const { Title, Text } = Typography;

const ExamAnswerPage = () => {
  const { examId } = useParams(); 
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const employeeId = 1; // Replace with actual dynamic employee ID from context or auth state

  useEffect(() => {
    if (examId) {
      checkSubmission();
    }
  }, [examId]);

  const checkSubmission = async () => {
    try {
      const response = await axios.get(`${base_url}/api/answers/exams/${examId}/employees/${employeeId}/check-submission`, { withCredentials: true });
      if (response.data) {
        message.warning("Bạn đã gửi bài thi này rồi.");
        navigate(`/exam-result/${examId}`);
      } else {
        fetchQuestions();
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái gửi bài thi:", error.response ? error.response.data : error.message);
      message.error("Lỗi khi kiểm tra trạng thái gửi bài thi.");
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/training-programs/exams/${examId}/questions`, { withCredentials: true });
      setQuestions(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy câu hỏi:", error.response ? error.response.data : error.message);
      message.error("Lấy câu hỏi không thành công.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    try {
      const values = form.getFieldsValue();
      console.log("Đang gửi câu trả lời với giá trị:", values); 

      const answers = Object.keys(values).map((questionId) => ({
        questionId: questionId,
        answerText: values[questionId],
        examId: examId,
        employeeId: employeeId,
      }));

      await Promise.all(
        answers.map((answer) =>
          axios.post(`${base_url}/api/answers`, answer, { withCredentials: true })
        )
      );

      message.success("Gửi câu trả lời thành công.");
      form.resetFields(); 

      navigate(`/exam-result/${examId}`);
    } catch (error) {
      console.error("Lỗi khi gửi câu trả lời:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400 && error.response.data.message === "Bài thi đã được gửi trước đó.") {
        notification.error({
          message: 'Lỗi gửi',
          description: 'Bài thi đã được gửi trước đó.',
        });
      } else {
        notification.error({
          message: 'Lỗi gửi',
          description: error.response ? error.response.data.message : error.message,
        });
      }
    }
  };

  const handleCalculateScore = () => {
    calculateTotalScore();
  };

  const calculateTotalScore = () => {
    const values = form.getFieldsValue(); 
    let score = 0;

    questions.forEach(question => {
      const userAnswer = values[question.id]; 
      const correctAnswer = question.correctAnswer; 
      const questionPoints = question.points; 

      if (userAnswer === correctAnswer) {
        score += questionPoints;
      }
    });

    console.log("Tổng điểm tính được:", score); 
    setTotalScore(score); 
  };

  const renderQuestion = (question) => {
    const options = question.answerOptions ? question.answerOptions.split(";") : [];
    return (
      <Card
        key={question.id}
        style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Form.Item
          name={String(question.id)}
          label={<Text strong>{question.questionText}</Text>}
          rules={[{ required: true, message: 'Vui lòng cung cấp câu trả lời!' }]} >
          {question.isMultipleChoice ? (
            <Radio.Group>
              {options.map((option, index) => (
                <Radio key={index} value={option}>
                  {String.fromCharCode(65 + index)}. {option}
                </Radio>
              ))}
            </Radio.Group>
          ) : (
            <Input.TextArea rows={4} placeholder="Nhập câu trả lời của bạn" />
          )}
        </Form.Item>
      </Card>
    );
  };

  return (
    <div className="exam-answer-page" style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Trả Lời Các Câu Hỏi Trong Bài Kiểm Tra
      </Title>

      {loading ? (
        <Spin tip="Đang tải câu hỏi..." size="large" />
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
          >
            {questions.length > 0 ? questions.map(renderQuestion) : <Text>Không có câu hỏi nào</Text>}
          </Form>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              type="primary"
              onClick={submitAnswers}
            >
              Gửi và Hoàn Thành
            </Button>
           
          </div>
        </>
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Title level={3}>Tổng Điểm: {totalScore}</Title>
      </div>
    </div>
  );
};

export default ExamAnswerPage;
