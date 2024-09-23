import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {
  Table,
  notification,
  Modal,
  Button,
  Avatar,
  Input,
  Select,
} from "antd"; // Import Select
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { base_url } from "../../../base_urls";
import { Avatar_02 } from "../../../Routes/ImagePath";

const { Option } = Select; // Destructure Option from Select

const openNotificationWithError = (message) => {
  notification.error({
    message: "Error",
    description: <span style={{ color: "#ed2d33" }}>{message}</span>,
    placement: "topRight",
  });
};

const openNotificationWithSuccess = (message) => {
  notification.success({
    message: "Success",
    description: (
      <div>
        <span style={{ color: "#09b347" }}>{message}</span>
        <button
          onClick={() => notification.destroy()}
          style={{
            border: "none",
            background: "transparent",
            float: "right",
            cursor: "pointer",
          }}
        >
          <CloseCircleOutlined style={{ color: "#09b347" }} />
        </button>
      </div>
    ),
    placement: "topRight",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  });
};

const ViolationUser = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [hasComplaint, setHasComplaint] = useState(false);

  const fetchUserViolations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violations/user`, {
        withCredentials: true,
      });
      const sortedViolations = response.data.sort(
        (a, b) => new Date(b.violationDate) - new Date(a.violationDate)
      );
      setViolations(sortedViolations);
      setFilteredViolations(sortedViolations);
    } catch (error) {
      openNotificationWithError(
        `Error fetching violations: ${error.response?.data || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const checkComplaintExists = async (violationId) => {
    try {
      const response = await axios.get(
        `${base_url}/api/violation_complaints/exists/${violationId}`,
        {
          withCredentials: true,
        }
      );
      return response.data; // true hoặc false
    } catch (error) {
      openNotificationWithError(
        `Error checking complaint existence: ${error.message}`
      );
      return false; // Hoặc xử lý lỗi phù hợp
    }
  };

  useEffect(() => {
    fetchUserViolations();
  }, []);

  useEffect(() => {
    const filtered = violations.filter((violation) => {
      const matchesName = violation.employee?.fullname
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesDate = searchDate
        ? new Date(violation.violationDate).toLocaleDateString() ===
          new Date(searchDate).toLocaleDateString()
        : true;
      const matchesStatus = searchStatus
        ? violation.status.toLowerCase() === searchStatus.toLowerCase()
        : true;
      return matchesName && matchesDate && matchesStatus;
    });
    setFilteredViolations(filtered);
  }, [searchName, searchDate, searchStatus, violations]);

  const handleViewDetails = async (violation) => {
    setSelectedViolation(violation);
    const exists = await checkComplaintExists(violation.id); // Kiểm tra sự tồn tại của khiếu nại
    setHasComplaint(exists); // Cập nhật trạng thái hasComplaint
  };

  const handleCloseDetails = () => {
    setSelectedViolation(null);
    setHasComplaint(false); // Đặt lại trạng thái khi đóng modal
  };
  const showComplaintModal = () => {
    setIsComplaintModalVisible(true);
  };

  const handleComplaintModalCancel = () => {
    setIsComplaintModalVisible(false);
    setComplaintDescription(""); // Reset description khi đóng modal
  };

  const handleComplaint = async () => {
    if (selectedViolation) {
      const exists = await checkComplaintExists(selectedViolation.id);

      if (exists) {
        openNotificationWithError("This violation already has a complaint.");
        return;
      }

      try {
        await axios.post(
          `${base_url}/api/violation_complaints`,
          {
            employee: { id: selectedViolation.employee.id }, // Chỉnh sửa ở đây
            violation: { id: selectedViolation.id }, // Chỉnh sửa ở đây
            description: complaintDescription,
            status: "PENDING",
          },
          {
            withCredentials: true,
          }
        );
        openNotificationWithSuccess("Complaint filed successfully.");
        handleComplaintModalCancel(); // Đóng modal sau khi gửi thành công
        handleCloseDetails(); // Có thể giữ hoặc bỏ tùy theo logic của bạn
      } catch (error) {
        openNotificationWithError(`Error filing complaint: ${error.message}`);
      }
    }
  };


  return (
    <>
      <style>
        {`
          .violation-message {
            border-bottom: 1px solid #f0f0f0;
            padding: 10px 0;
            display: flex;
            flex-direction: column;
            cursor: pointer;
          }

          .message-header {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
          }

          .message-date {
            margin-left: auto; 
            font-weight: bold;
          }

          .message-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .message-body p {
            margin: 0;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .search-filters {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .search-filters .ant-input {
            flex: 1;
            margin-right: 10px;
          }

          .search-filters .ant-input:last-child {
            margin-right: 0;
          }
        `}
      </style>

      <div className="page-wrapper">
        <div className="content container-fluid">
        <h2>Your Violation Records</h2>
        <h5>Dashboard / My Violations </h5><br/>
          <div className="search-filters">
            <Input
              placeholder="Search"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <Select
              placeholder="Select Status"
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
              style={{ width: 200 }}
            >
              <Option value="">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
          <br />

          {loading ? (
            <div className="text-center w-100">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                <div className="col-md-12">
                  <div className="message-list">
                    {filteredViolations.map((violation) => (
                      <div key={violation.id} className="violation-message">
                        <div className="message-header">
                          <Avatar
                            src={violation.employee.avatar || Avatar_02}
                          />
                          <strong>{violation.employee.fullname} </strong>
                          <span className="message-date">
                            {new Date(
                              violation.violationDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="message-body">
                          <p>
                            {violation.violationType.type}:{" "}
                            {violation.description.substring(0, 20)}...
                          </p>
                          <Button
                            type="link"
                            onClick={() => handleViewDetails(violation)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        title="Violation Details: "
        visible={!!selectedViolation}
        onCancel={handleCloseDetails}
        footer={[
          <Button 
            key="complaint" 
            type="primary" 
            onClick={showComplaintModal}
            disabled={hasComplaint} // Khóa nút nếu đã có khiếu nại
          >
            File Complaint
          </Button>,
          <Button key="back" onClick={handleCloseDetails}>
            Close
          </Button>,
        ]}
      >
        {selectedViolation && (
          <div>
            <p>
              <strong>Violation Type:</strong>{" "}
              {selectedViolation.violationType.type}
            </p>
            <p>
              <strong>Violation Money:</strong>{" "}
              {selectedViolation.violationType.violationMoney}
            </p>
            <p>
              <strong>Description:</strong> {selectedViolation.description}
            </p>
            <p>
              <strong>Date:</strong> {selectedViolation.violationDate}
            </p>
            <p>
              <strong>Status:</strong> {selectedViolation.status}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="File Complaint"
        visible={isComplaintModalVisible}
        onCancel={handleComplaintModalCancel}
        footer={[
          <Button key="back" onClick={handleComplaintModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleComplaint}
            disabled={!complaintDescription}
          >
            Submit
          </Button>,
        ]}
      >
        <p>
          <strong>Violation:</strong> {selectedViolation?.violationType.type}
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Enter your complaint description"
          value={complaintDescription}
          onChange={(e) => setComplaintDescription(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default ViolationUser;
