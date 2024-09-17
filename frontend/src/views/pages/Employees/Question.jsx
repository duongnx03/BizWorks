import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import { useParams } from "react-router-dom";
import QuestionModal from './QuestionModal'; // Adjust the path as needed

const Question = () => {
  const { examId } = useParams(); // Get examId from route parameters
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchQuestions();
    }
  }, [examId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/training-programs/exams/${examId}/questions`, { withCredentials: true });
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error.response ? error.response.data : error.message);
      message.error("Failed to fetch questions. Check your permissions or contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (newQuestion) => {
    fetchQuestions(); // Refresh questions list after adding a new question
    message.success("Question added successfully");
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${base_url}/api/training-programs/exams/${examId}/questions/${id}`, { withCredentials: true });
      fetchQuestions();
      message.success("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error("Failed to delete question");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Question Text",
      dataIndex: "questionText",
      key: "questionText",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this question?"
          onConfirm={() => handleDeleteQuestion(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-between mb-3">
                <Button type="primary" onClick={() => setModalVisible(true)}>
                  Add Question
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={questions}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>

      <QuestionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        examId={examId} // Make sure examId is passed
        onQuestionAdded={handleAddQuestion}
      />
    </>
  );
};

export default Question;
