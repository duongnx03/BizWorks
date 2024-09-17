import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, message, Empty } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";

const TrainingProgramDetails = () => {
  const { id } = useParams(); // Lấy tham số id từ URL
  const [trainingProgram, setTrainingProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingProgramDetails();
  }, [id]);

  const fetchTrainingProgramDetails = async () => {
    try {
      const response = await axios.get(`${base_url}/api/training-programs/${id}`, { withCredentials: true });
      console.log('API Response:', response.data);

      if (response.data) {
        setTrainingProgram(response.data);
      } else {
        message.error("No training program data found");
        setTrainingProgram({ employees: [] });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training program details:", error);
      message.error("Failed to fetch training program details");
      setLoading(false);
    }
  };

  const employeeColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Position",
      dataIndex: "positionName",
      key: "positionName",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => <img src={text} alt="avatar" style={{ width: 50, height: 50 }} />
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            {trainingProgram ? (
              <div>
                <h2>Training Program Details</h2>
                <p><strong>Title:</strong> {trainingProgram.title}</p>
                <p><strong>Description:</strong> {trainingProgram.description}</p>
                <p><strong>Type:</strong> {trainingProgram.type}</p>
                <h3>Employees Participating</h3>
                {trainingProgram.employees && trainingProgram.employees.length > 0 ? (
                  <Table
                    columns={employeeColumns}
                    dataSource={trainingProgram.employees}
                    loading={loading}
                    rowKey="id"
                  />
                ) : (
                  <Empty description="No employees participating" />
                )}
              </div>
            ) : (
              <Empty description="No training program found" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgramDetails;
