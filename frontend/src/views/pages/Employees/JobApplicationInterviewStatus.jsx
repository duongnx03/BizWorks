import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import moment from "moment";

const JobApplicationInterviewStatus = () => {
  const [interviewStatus, setInterviewStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewStatus();
  }, []);

  const fetchInterviewStatus = async () => {
    try {
      const response = await axios.get(`${base_url}/api/interview-schedules/status`, { withCredentials: true });
      setInterviewStatus(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching interview status:", error);
      message.error("Failed to fetch interview status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "applicantEmail",
      width: "25%",
    },
    {
      title: "Interview Date",
      dataIndex: "interviewDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD HH:mm") : "N/A"),
      width: "25%",
    },
    {
      title: "Location",
      dataIndex: "location",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      render: (status) => (status ? (status === "ACCEPTED" ? "Accepted" : "Rejected") : "Pending"),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={interviewStatus}
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

export default JobApplicationInterviewStatus;
