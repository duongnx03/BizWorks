import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";

const RejectedApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);   

  const fetchApplications = async () => {
    try {
        const response = await axios.get(`${base_url}/api/rejected-applications`, { withCredentials: true });
        if (response.data?.data) {
        setApplications(response.data.data);
      } else {
        setApplications([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      message.error("Failed to fetch job applications");
      setApplications([]);
      setLoading(false);
    }
  };

  const downloadResume = async (fileName) => {
    try {
      const response = await axios.get(`${base_url}/api/files/download/${fileName}`, {
        responseType: 'blob', // Đảm bảo yêu cầu dữ liệu dưới dạng blob
        withCredentials: true, // Nếu cần thiết, để gửi cookies
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file: " + error.message);
    }
  };

  const applicationElements = applications.map(application => ({
    key: application.id,
    id: application.id,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    applicantPhone: application.applicantPhone,
    resumeUrl: application.resumeUrl,
    applicationDate: application.applicationDate,
    status: application.status,
  }));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "applicantName",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "applicantEmail",
      width: "25%",
    },
    {
      title: "Phone",
      dataIndex: "applicantPhone",
      width: "15%",
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      render: (fileName) => (
        <Button onClick={() => downloadResume(fileName)}>
          Download Resume
        </Button>
      ),
      width: "15%",
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <div className="d-flex justify-content-end mb-3">
                {/* Add any additional UI elements here if needed */}
              </div>
              <Table
                columns={columns}
                dataSource={applicationElements}
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

export default RejectedApplicationsList;
