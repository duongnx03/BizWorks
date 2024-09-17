import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import { useParams, useNavigate } from "react-router-dom";

const Exam = () => {
  const { trainingProgramId } = useParams(); // Get the trainingProgramId from route parameters
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    if (trainingProgramId) {
      fetchExams();
    }
  }, [trainingProgramId]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/training-programs/${trainingProgramId}/exams`, { withCredentials: true });
      console.log("Fetched exams:", response.data);
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      message.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = async (values) => {
    try {
      await axios.post(`${base_url}/api/training-programs/${trainingProgramId}/exams`, values, { withCredentials: true });
      fetchExams();
      setModalVisible(false);
      message.success("Exam added successfully");
    } catch (error) {
      console.error("Error adding exam:", error);
      message.error("Failed to add exam");
    }
  };

  const handleDeleteExam = async () => {
    if (examToDelete) {
      try {
        await axios.delete(`${base_url}/api/training-programs/${trainingProgramId}/exams/${examToDelete}`, { withCredentials: true });
        fetchExams();
        setDeleteModalVisible(false);
        setExamToDelete(null);
        message.success("Exam deleted successfully");
      } catch (error) {
        console.error("Error deleting exam:", error);
        message.error("Failed to delete exam");
      }
    }
  };

  const handleViewQuestions = (examId) => {
    navigate(`/exam/${trainingProgramId}/${examId}/questions`); // Navigate to the Question page with the examId
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Exam Date & Time",
      dataIndex: "examDateTime",
      key: "examDateTime",
      render: (date) => date ? new Date(date).toLocaleString() : "N/A",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Duration",
      dataIndex: "examDuration",
      key: "examDuration",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button onClick={() => handleViewQuestions(record.id)} style={{ marginRight: 8 }}>
            View Questions
          </Button>
          <Button danger onClick={() => { setExamToDelete(record.id); setDeleteModalVisible(true); }}>
            Delete
          </Button>
        </div>
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
                  Add Exam
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={exams}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Add Exam"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddExam}
          layout="vertical"
        >
          <Form.Item
            name="subjectName"
            label="Subject Name"
            rules={[{ required: true, message: "Please enter the subject name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="examDateTime"
            label="Exam Date & Time"
            rules={[{ required: true, message: "Please select the exam date & time" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="examDuration"
            label="Exam Duration"
            rules={[{ required: true, message: "Please enter the exam duration" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Exam
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeleteExam}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this exam?</p>
      </Modal>
    </>
  );
};

export default Exam;
