import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';
import { base_url } from '../../../../base_urls';
import moment from 'moment';

const ApprovedRequestsPage = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`${base_url}/api/job-applications/approved-status-change-requests`, { withCredentials: true });
      if (response.data?.data) {
        setApprovedRequests(response.data.data);
      } else {
        setApprovedRequests([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      message.error("Failed to fetch approved requests");
      setApprovedRequests([]);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Applicant Name',
      dataIndex: ['jobApplication', 'applicantName'], // Sửa lại dataIndex
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: ['jobApplication', 'applicantEmail'], // Sửa lại dataIndex
      width: '25%',
    },
    {
      title: 'Phone',
      dataIndex: ['jobApplication', 'applicantPhone'], // Sửa lại dataIndex
      width: '15%',
    },
    {
      title: 'Application Date',
      dataIndex: ['jobApplication', 'applicationDate'], // Sửa lại dataIndex
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
      width: '15%',
    },
    {
      title: 'Requested Status',
      dataIndex: 'newStatus',
      width: '15%',
    },
    {
      title: 'Approval Date',
      dataIndex: 'approvalDate',
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
      width: '15%',
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
                dataSource={approvedRequests}
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

export default ApprovedRequestsPage;
