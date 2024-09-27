import React, { useContext, useEffect, useState } from "react";
import { Spin, Avatar, Button, Popover, Card, List, Descriptions, message, Modal } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { base_url } from "../../../base_urls";
import moment from "moment";
import { AuthContext } from "../../../Routes/AuthContext";

const TrainingProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainingProgram, setTrainingProgram] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [trainingDates, setTrainingDates] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const { userRole, username } = useContext(AuthContext);

  const generateTrainingDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = moment(startDate);
    const end = moment(endDate);

    while (currentDate.isSameOrBefore(end)) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "days");
    }
    return dates;
  };

  const fetchTrainingProgramDetails = async () => {
    try {
      const response = await axios.get(`${base_url}/api/training-programs/${id}`, { withCredentials: true });
      setTrainingProgram(response.data);
      const { startDate, endDate } = response.data;

      if (new Date(startDate) > new Date(endDate)) {
        message.error("Ngày bắt đầu không thể sau ngày kết thúc.");
        setLoading(false);
        return;
      }

      setTrainingDates(generateTrainingDates(startDate, endDate));

      if (response.data.participantIds && response.data.participantIds.length > 0) {
        const participantsResponse = await axios.post(`${base_url}/api/employee/batch`, response.data.participantIds, { withCredentials: true });
        setParticipants(participantsResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training program details:", error);
    }
  };

  useEffect(() => {
    fetchTrainingProgramDetails();

    const storedRecords = localStorage.getItem(`attendanceRecords_${id}`);
    if (storedRecords) {
      setAttendanceRecords(JSON.parse(storedRecords));
    }
  }, [id]);

  const handleAttendance = async (participantId, date) => {
    try {
      await axios.post(
        `${base_url}/api/training-programs/${id}/attendance/${participantId}?attendanceDate=${date}`,
        {},
        { withCredentials: true }
      );

      const updatedRecords = {
        ...attendanceRecords,
        [participantId]: {
          ...(attendanceRecords[participantId] || {}),
          [date]: true,
        },
      };

      setAttendanceRecords(updatedRecords);
      localStorage.setItem(`attendanceRecords_${id}`, JSON.stringify(updatedRecords));
      message.success(`Đã điểm danh thành công cho ngày ${date}!`);
    } catch (error) {
      console.error("Error marking attendance:", error);
      const errorMessage = error.response?.data?.message || "Điểm danh thất bại";
      message.error(errorMessage);
    }
  };



  const renderAttendanceButtons = (participantId) => {
    const today = moment().format("YYYY-MM-DD");

    return trainingDates.map((date) => {
      const isToday = moment(date).isSame(today, 'day');

      return (
        <Button
          key={date}
          type="primary"
          onClick={() => handleAttendance(participantId, date)}
          disabled={attendanceRecords[participantId]?.[date] || !isToday}
          style={{ marginLeft: "10px", marginBottom: "5px" }}
        >
          {attendanceRecords[participantId]?.[date] ? `Đã Điểm Danh (${date})` : `Điểm Danh (${date})`}
        </Button>
      );
    });
  };

  const handleCompleteProgram = () => {
    const today = moment().startOf('day');
    const endDate = moment(trainingProgram.endDate).startOf('day');
  
    Modal.confirm({
      title: "Xác nhận hoàn thành chương trình",
      content: today.isBefore(endDate) ? "Chương trình chưa đến ngày kết thúc. Bạn có chắc chắn muốn đánh dấu hoàn thành không?" : "Bạn có chắc chắn muốn đánh dấu hoàn thành chương trình không?",
      onOk: async () => {
        try {
          await axios.put(`${base_url}/api/training-programs/${id}/complete`, {}, { withCredentials: true });
          setIsCompleted(true);
          message.success("Chương trình đào tạo đã được đánh dấu hoàn thành.");
          navigate("/training-programs");
        } catch (error) {
          console.error("Error completing training program:", error);
          message.error("Đánh dấu hoàn thành chương trình đào tạo thất bại.");
        }
      },
      onCancel() {
        // Người dùng không xác nhận
      },
    });
  };

  if (loading) {
    return <Spin tip="Đang tải..." />;
  }

  if (!trainingProgram) {
    return <p>Không tìm thấy chương trình đào tạo.</p>;
  }

  return (
    <Card title="Chi Tiết Chương Trình Đào Tạo" style={{ margin: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
        <Descriptions.Item label="Tiêu Đề" labelStyle={{ fontWeight: "bold" }}>{trainingProgram.title}</Descriptions.Item>
        <Descriptions.Item label="Mô Tả" labelStyle={{ fontWeight: "bold" }}>{trainingProgram.description}</Descriptions.Item>
        <Descriptions.Item label="Ngày Bắt Đầu" labelStyle={{ fontWeight: "bold" }}>{trainingProgram.startDate}</Descriptions.Item>
        <Descriptions.Item label="Ngày Kết Thúc" labelStyle={{ fontWeight: "bold" }}>{trainingProgram.endDate}</Descriptions.Item>
        <Descriptions.Item label="Số Người Tham Gia" labelStyle={{ fontWeight: "bold" }}>{participants.length}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>Danh Sách Tham Gia</h3>
      {userRole === "ADMIN" && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Button
            type="primary"
            onClick={handleCompleteProgram}
            disabled={isCompleted} 
            style={{ backgroundColor: isCompleted ? "#52c41a" : "#1890ff", borderColor: isCompleted ? "#52c41a" : "#1890ff" }}
          >
            {isCompleted ? "Chương Trình Đã Hoàn Thành" : "Đánh Dấu Hoàn Thành Chương Trình"}
          </Button>
        </div>
      )}

      <List
        bordered
        dataSource={participants}
        renderItem={(participant) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{participant.fullName ? participant.fullName.charAt(0) : "?"}</Avatar>}
              title={<span style={{ fontWeight: "bold" }}>{participant.fullName || "Tên không xác định"}</span>}
              description={participant.email || "Chưa có email"}
            />
            <div>
              {participant.username === username && (
                <Popover
                  content={renderAttendanceButtons(participant.id)}
                  title="Chọn Ngày Điểm Danh"
                  trigger="click"
                >
                  <Button
                    type="primary"
                    style={{ marginLeft: "10px" }}
                  >
                    Điểm Danh
                  </Button>
                </Popover>
              )}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TrainingProgramDetails;
