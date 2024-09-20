import React, { useContext, useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";
import { base_url } from "../../../../base_urls";
import { AuthContext } from "../../../../Routes/AuthContext";
import { useNavigate } from "react-router-dom";

const InterviewScheduleList = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const [interviewSchedules, setInterviewSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchInterviewSchedules();
  }, [isLoggedIn, userRole, navigate]);

  const fetchInterviewSchedules = async () => {
    try {
      const response = await axios.get(`${base_url}/api/interview-schedules`, { withCredentials: true });
      setInterviewSchedules(response.data); // Trực tiếp gán dữ liệu
      setLoading(false);
    } catch (error) {
      console.error("Error fetching interview schedules:", error);
      message.error("Failed to fetch interview schedules");
      setInterviewSchedules([]);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },

    {
      title: "Interview Date",
      dataIndex: "interviewDate",
      width: "25%",
      render: (date) => new Date(date).toLocaleString(), // Hiển thị định dạng ngày
    },
    {
      title: "Interviewers",
      dataIndex: "interviewers",
      width: "20%",
    },
    {
      title: "Location",
      dataIndex: "location",
      width: "25%",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3 className="page-title">Interview Schedules</h3>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={interviewSchedules}
                loading={loading}
                className="table-striped"
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduleList;
