import React, { useState } from "react";
import { Modal, Form, Input, Switch, Divider, Button, InputNumber, message } from 'antd';
import axios from "axios";
import { base_url } from "../../base_urls"; // Import base_url

const QuestionModal = ({ visible, onClose, onQuestionAdded, examId }) => {
  const [form] = Form.useForm();
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [answerOptions, setAnswerOptions] = useState([]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...answerOptions];
    newOptions[index] = value;
    setAnswerOptions(newOptions);
  };

  const handleAddOption = () => {
    setAnswerOptions((prevOptions) => [...prevOptions, '']);
  };

  const handleFinish = async (values) => {
    console.log("Dữ liệu Form:", values); // Log debugging
    console.log("Các tùy chọn trả lời:", answerOptions); // Log debugging

    if (values.isMultipleChoice && answerOptions.length === 0) {
      message.error('Vui lòng thêm ít nhất một tùy chọn trả lời cho câu hỏi trắc nghiệm.');
      return;
    }

    const questionData = {
      questionText: values.questionText,
      isMultipleChoice: values.isMultipleChoice,
      answerOptions: values.isMultipleChoice ? answerOptions.join(';') : '', // Chuyển mảng thành chuỗi phân cách bằng dấu chấm phẩy
      correctAnswer: values.correctAnswer,
      points: values.points,
    };

    try {
      const response = await axios.post(
        `${base_url}/api/training-programs/exams/${examId}/questions`,
        questionData,
        { withCredentials: true }
      );
      console.log("Phản hồi từ server:", response.data); // Log debugging
      message.success('Đã thêm câu hỏi thành công');
      form.resetFields();
      onQuestionAdded();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm câu hỏi:", error.response ? error.response.data : error.message);
      message.error('Thêm câu hỏi không thành công. Vui lòng kiểm tra quyền của bạn.');
    }
  };

  return (
    <Modal
      title="Thêm Câu Hỏi"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isMultipleChoice: false }}>
        <Form.Item
          name="questionText"
          label="Nội dung câu hỏi"
          rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="isMultipleChoice" label="Trắc nghiệm" valuePropName="checked">
          <Switch
            checked={isMultipleChoice}
            onChange={(checked) => {
              setIsMultipleChoice(checked);
              if (!checked) {
                setAnswerOptions([]); // Xóa tùy chọn khi chuyển sang câu hỏi không phải trắc nghiệm
              }
              form.setFieldsValue({ isMultipleChoice: checked });
            }}
          />
        </Form.Item>

        {isMultipleChoice && (
          <>
            <Divider>Các tùy chọn trả lời</Divider>
            {answerOptions.map((option, index) => (
              <Form.Item key={index} label={`Tùy chọn ${index + 1}`}>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </Form.Item>
            ))}
            <Button type="dashed" onClick={handleAddOption}>
              Thêm Tùy Chọn
            </Button>
          </>
        )}

        <Form.Item
          name="correctAnswer"
          label="Đáp án đúng"
          rules={[{ required: true, message: "Vui lòng nhập đáp án đúng!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="points"
          label="Điểm"
          rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuestionModal;
