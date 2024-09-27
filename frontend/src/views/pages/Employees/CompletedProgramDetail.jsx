import React, { useEffect, useState, useContext } from "react";
import { Spin, Avatar, Button, Card, List, Descriptions, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../../base_urls";
import { AuthContext } from "../../../Routes/AuthContext";

const CompletedProgramDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [completedProgram, setCompletedProgram] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const { username } = useContext(AuthContext);

    const fetchCompletedProgramDetails = async () => {
        try {
            const response = await axios.get(`${base_url}/api/training-programs/completed/${id}`, { withCredentials: true });
            setCompletedProgram(response.data);

            // Lấy danh sách tham gia từ API
            const participantsResponse = await axios.get(`${base_url}/api/training-programs/${id}/participants`, { withCredentials: true });
            setParticipants(participantsResponse.data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching completed program details:", error);
            message.error("Không thể lấy thông tin chương trình đã hoàn thành.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedProgramDetails();
    }, [id]);

    if (loading) {
        return <Spin tip="Đang tải..." />;
    }

    if (!completedProgram) {
        return <p>Không tìm thấy chương trình đã hoàn thành.</p>;
    }

    return (
        <Card title="Chi Tiết Chương Trình Đào Tạo Đã Hoàn Thành" style={{ margin: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
                <Descriptions.Item label="Tiêu Đề" labelStyle={{ fontWeight: "bold" }}>{completedProgram.title}</Descriptions.Item>
                <Descriptions.Item label="Mô Tả" labelStyle={{ fontWeight: "bold" }}>{completedProgram.description}</Descriptions.Item>
                <Descriptions.Item label="Ngày Bắt Đầu" labelStyle={{ fontWeight: "bold" }}>{completedProgram.startDate}</Descriptions.Item>
                <Descriptions.Item label="Ngày Kết Thúc" labelStyle={{ fontWeight: "bold" }}>{completedProgram.endDate}</Descriptions.Item>
                <Descriptions.Item label="Số Người Tham Gia" labelStyle={{ fontWeight: "bold" }}>{participants.length}</Descriptions.Item>
            </Descriptions>

            <h3 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>Danh Sách Tham Gia</h3>
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
                    </List.Item>
                )}
            />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="primary" onClick={() => navigate("completed-training-programs")}>
                    Quay lại danh sách chương trình đã hoàn thành
                </Button>
            </div>
        </Card>
    );
};

export default CompletedProgramDetail;
