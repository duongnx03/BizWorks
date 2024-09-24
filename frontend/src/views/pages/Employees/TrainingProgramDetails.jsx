import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  List,
  message,
  Spin,
  Avatar,
  Button,
  Popover,
  Row,
  Col,
} from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import moment from "moment";

const TrainingProgramDetails = () => {
  const { id } = useParams();
  const [trainingProgram, setTrainingProgram] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [trainingDates, setTrainingDates] = useState([]);
  const [activeAttendance, setActiveAttendance] = useState(null);

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
      message.error("Không tải được chi tiết chương trình đào tạo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingProgramDetails();
  }, [id]);

  useEffect(() => {
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

  const handleAttendanceButtonClick = (participantId) => {
    setActiveAttendance(activeAttendance === participantId ? null : participantId);
  };

  const renderAttendanceButtons = (participantId) => {
    return trainingDates.map((date) => (
      <Button
        key={date}
        type="primary"
        onClick={() => handleAttendance(participantId, date)}
        disabled={attendanceRecords[participantId]?.[date]}
        style={{ marginLeft: "10px", marginBottom: "5px" }}
      >
        {attendanceRecords[participantId]?.[date] ? `Đã Điểm Danh (${date})` : `Điểm Danh (${date})`}
      </Button>
    ));
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!trainingProgram) {
    return <p>Không tìm thấy chương trình đào tạo.</p>;
  }

  return (
    <Card title="Chi Tiết Chương Trình Đào Tạo" style={{ margin: "20px" }}>
      <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
        <Descriptions.Item label="Tiêu Đề">{trainingProgram.title}</Descriptions.Item>
        <Descriptions.Item label="Mô Tả">{trainingProgram.description}</Descriptions.Item>
        <Descriptions.Item label="Ngày Bắt Đầu">{trainingProgram.startDate}</Descriptions.Item>
        <Descriptions.Item label="Ngày Kết Thúc">{trainingProgram.endDate}</Descriptions.Item>
        <Descriptions.Item label="Số Người Tham Gia">{participants.length}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginBottom: "10px" }}>Danh Sách Tham Gia</h3>
      <List
        bordered
        dataSource={participants}
        renderItem={(participant) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{participant.fullName ? participant.fullName.charAt(0) : "?"}</Avatar>}
              title={participant.fullName || "Tên không xác định"}
              description={participant.email || "Chưa có email"}
            />
            <Popover
              content={renderAttendanceButtons(participant.id)}
              title="Chọn Ngày Điểm Danh"
              trigger="click"
              onClick={() => handleAttendanceButtonClick(participant.id)}
            >
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
              >
                Điểm Danh
              </Button>
            </Popover>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TrainingProgramDetails;
