import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  message,
  Spin,
  Avatar,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  Table,
} from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import moment from "moment";

const { Title, Text } = Typography;

const TrainingProgramDetails = () => {
  const { id } = useParams();
  const [trainingProgram, setTrainingProgram] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainingContents, setTrainingContents] = useState([]);
  const [form] = Form.useForm();

  // State for adding new content visibility
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const fetchTrainingProgramDetails = async () => {
    console.log("Fetching training program details for ID:", id); // Log ID being fetched
    try {
      const response = await axios.get(`${base_url}/api/training-programs/${id}`, { withCredentials: true });
      console.log("Training Program Response:", response.data); // Log the response data
      setTrainingProgram(response.data);

      // Fetch training content
      const trainingContentResponse = await axios.get(`${base_url}/api/training-contents/program/${id}`, { withCredentials: true });
      console.log("Training Content Response:", trainingContentResponse.data); // Log the training content response
      setTrainingContents(trainingContentResponse.data);

      if (response.data.participantIds && response.data.participantIds.length > 0) {
        const participantsResponse = await axios.post(`${base_url}/api/employee/batch`, response.data.participantIds, { withCredentials: true });
        console.log("Participants Response:", participantsResponse.data); // Log participants response
        setParticipants(participantsResponse.data);
        
        // Hiển thị thông tin nhân viên trong console
        console.log("Danh sách nhân viên tham gia:", participantsResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training program details:", error);
      message.error("Không tải được chi tiết chương trình đào tạo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingProgramDetails();
  }, [id]); // Chỉ gọi khi `id` thay đổi

  const handleCreateContent = async (values) => {
    try {
      await axios.post(`${base_url}/api/training-contents`, {
        title: values.title,
        coreKnowledge: values.coreKnowledge,
        softSkills: values.softSkills,
        professionalSkills: values.professionalSkills,
        trainingProgramId: id,
      }, { withCredentials: true });

      message.success("Nội dung đào tạo đã được thêm thành công!");
      fetchTrainingProgramDetails(); // Refresh the list of training contents
      form.resetFields(); // Reset form fields
      setIsAddingContent(false); // Close the form
    } catch (error) {
      console.error("Error creating training content:", error);
      message.error("Thêm nội dung đào tạo thất bại.");
    }
  };

  // Function to show modal with selected content
  const showModal = (content) => {
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedContent(null);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!trainingProgram) {
    return <p>Không tìm thấy chương trình đào tạo.</p>;
  }

  // Tạo dữ liệu bảng cho các nhân viên tham gia và nội dung đào tạo của họ
  const employeeTrainingData = Array.isArray(participants) ? participants.map(participant => {
    const trainingRecord = {
      key: participant.id,
      name: participant.fullname || "Tên không xác định",
      empCode: participant.empCode || "Mã không xác định", // Thêm empCode vào dữ liệu
      coreKnowledge: trainingContents.map(content => content.coreKnowledge).join(", "),
      softSkills: trainingContents.map(content => content.softSkills).join(", "),
      professionalSkills: trainingContents.map(content => content.professionalSkills).join(", "),
    };

    console.log("Training Record:", trainingRecord); // Log training record for each participant
    return trainingRecord;
  }) : [];

  // Định nghĩa cột cho bảng hiển thị nội dung đào tạo theo từng nhân viên
  const columns = [
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Avatar>{text ? text.charAt(0) : '?'}</Avatar>
          <Text strong style={{ marginLeft: '8px' }}>{text || 'Tên không xác định'}</Text>
          <Text style={{ marginLeft: '8px' }}> - {record.empCode}</Text>
        </div>
      ),
    },
    {
      title: 'Kiến Thức Cơ Bản',
      dataIndex: 'coreKnowledge',
      key: 'coreKnowledge',
    },
    {
      title: 'Kỹ Năng Mềm',
      dataIndex: 'softSkills',
      key: 'softSkills',
    },
    {
      title: 'Kỹ Năng Chuyên Môn',
      dataIndex: 'professionalSkills',
      key: 'professionalSkills',
    },
  ];

  return (
    <Card title="Chi Tiết Chương Trình Đào Tạo" style={{ margin: "20px" }}>
      <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
        <Descriptions.Item label="Tiêu Đề"><Text strong>{trainingProgram.title}</Text></Descriptions.Item>
        <Descriptions.Item label="Mô Tả">{trainingProgram.description}</Descriptions.Item>
        <Descriptions.Item label="Ngày Bắt Đầu">{moment(trainingProgram.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Ngày Kết Thúc">{moment(trainingProgram.endDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Số Người Tham Gia">{participants.length}</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginBottom: "10px" }}>Nội Dung Đào Tạo Theo Từng Nhân Viên</Title>
      <Table
        dataSource={employeeTrainingData}
        columns={columns}
        pagination={false}
        bordered
      />

      <Button
        type="dashed"
        onClick={() => setIsAddingContent(!isAddingContent)}
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        {isAddingContent ? "Ẩn Form Thêm Nội Dung" : "Thêm Nội Dung Đào Tạo"}
      </Button>

      {isAddingContent && (
        <Form form={form} onFinish={handleCreateContent} style={{ marginTop: "20px" }}>
          <Form.Item name="title" label="Tiêu Đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="coreKnowledge" label="Kiến Thức Cơ Bản" rules={[{ required: true, message: "Vui lòng nhập kiến thức cơ bản!" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="softSkills" label="Kỹ Năng Mềm" rules={[{ required: true, message: "Vui lòng nhập kỹ năng mềm!" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="professionalSkills" label="Kỹ Năng Chuyên Môn" rules={[{ required: true, message: "Vui lòng nhập kỹ năng chuyên môn!" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm Nội Dung Đào Tạo
            </Button>
          </Form.Item>
        </Form>
      )}

      <Modal
        title="Chi Tiết Nội Dung Đào Tạo"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedContent && (
          <>
            <Title level={5}>{selectedContent.title}</Title>
            <Text strong>Kiến Thức Cơ Bản:</Text> <Text>{selectedContent.coreKnowledge}</Text><br />
            <Text strong>Kỹ Năng Mềm:</Text> <Text>{selectedContent.softSkills}</Text><br />
            <Text strong>Kỹ Năng Chuyên Môn:</Text> <Text>{selectedContent.professionalSkills}</Text><br />
          </>
        )}
      </Modal>
    </Card>
  );
};

export default TrainingProgramDetails;
