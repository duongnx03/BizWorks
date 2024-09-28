import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, notification } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import AddViolation from "../../../components/modelpopup/AddViolation";
import EditViolation from "../../../components/modelpopup/EditViolation";
import { base_url } from "../../../base_urls";
import { Avatar_02 } from "../../../Routes/ImagePath";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const openNotificationWithError = (message) => {
  notification.error({
    message: "Error",
    description: <span style={{ color: "#ed2d33" }}>{message}</span>,
    placement: "top",
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
    placement: "top",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  });
};

const Violation = () => {
  const [violations, setViolations] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editViolationData, setEditViolationData] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(() =>
    sessionStorage.getItem("userRole")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullnameOrCodeFilter, setFullnameOrCodeFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null); // Using Date type for better comparison
  const [statusFilter, setStatusFilter] = useState("");

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violations`, {
        withCredentials: true,
      });
      const sortedViolations = response.data.data.sort(
        (a, b) => new Date(b.violationDate) - new Date(a.violationDate)
      );
      setViolations(sortedViolations);
      await updateStats(sortedViolations);
    } catch (error) {
      openNotificationWithError(
        `Error fetching violations: ${error.response?.data || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${base_url}/api/employee/getEmployeesByRole`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      openNotificationWithError(`Error fetching employees: ${error}`);
      return [];
    }
  };

  const updateStats = async (violationsData) => {
    try {
      const allEmployees = await fetchEmployees();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Tháng hiện tại (0-11)
      const currentYear = currentDate.getFullYear(); // Năm hiện tại
      const violationsThisMonth = violationsData.filter((v) => {
        //filter violation this month
        const violationDate = new Date(v.violationDate); // Chuyển đổi chuỗi ngày thành đối tượng Date
        return (
          violationDate.getMonth() === currentMonth &&
          violationDate.getFullYear() === currentYear
        );
      });
      const employeeIdsWithViolations = new Set(
        violationsThisMonth
          .map((v) => v.employee?.id)
          .filter((id) => id != null)
      );
      const totalEmployeesWithViolations = employeeIdsWithViolations.size;
      const totalViolations = violationsThisMonth.length;
      const pendingViolations = violationsThisMonth.filter(
        (v) => v.status === "Pending"
      ).length;
      const rejectedViolations = violationsThisMonth.filter(
        (v) => v.status === "Rejected"
      ).length;

      setStatsData([
        {
          title: "Violation Staff",
          value: totalEmployeesWithViolations,
          month: "this month",
        },
        {
          title: "Total Violation",
          value: totalViolations,
          month: "this month",
        },
        {
          title: "Pending Request",
          value: pendingViolations,
          month: "this month",
        },
        {
          title: "Rejected",
          value: rejectedViolations,
          month: "this month",
        },
      ]);
    } catch (error) {
      openNotificationWithError(`Error updating stats: ${error}`);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleAdd = async (data) => {
    if (isSubmitting) return false;

    setIsSubmitting(true);

    try {
      await axios.post(`${base_url}/api/violations`, data, {
        withCredentials: true,
      });
      await fetchViolations();
      openNotificationWithSuccess("Violation added successfully.");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      openNotificationWithError(
        ` ${errorMessage}`
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Fetching data for violation id:", id);
      const response = await axios.get(`${base_url}/api/violations/${id}`, {
        withCredentials: true,
      });
  
      if (response.data.status === "SUCCESS" && response.data.data) {
        setEditViolationData(response.data);
        setShowEditModal(true);
      } else {
        openNotificationWithError(
          `Invalid violation data: ${response.data.message || response.data.data}`
        );
      }
    } catch (error) {
      openNotificationWithError(`Error fetching violation data: ${error.message || error}`);
    }
  };
  
  const handleSaveEdit = async (data) => {
    if (!data.id) {
      openNotificationWithError("Violation ID is missing");
      return;
    }
  
    try {
      const response = await axios.put(
        `${base_url}/api/violations/${data.id}`,
        data,
        {
          withCredentials: true,
        }
      );
      
      if (response.data.status === "SUCCESS") {
        fetchViolations();
        openNotificationWithSuccess("Violation updated successfully.");
        setShowEditModal(false);
      } else {
        // Kiểm tra lỗi từ máy chủ
        if (response.data.message) {
          openNotificationWithError(`Error updating violation: ${response.data.message}`);
        } else {
          openNotificationWithError(`Error updating violation: Unknown error`);
        }
      }
    } catch (error) {
      // Kiểm tra lỗi từ máy chủ
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      openNotificationWithError(`Error updating violation: ${errorMessage}`);
    }
  };
  

  const handleStatusChange = async (violationId, newStatus) => {
    const currentViolation = violations.find(v => v.id === violationId);
    if (currentViolation && currentViolation.status === newStatus) {
      openNotificationWithError("The new state is no different from the current state.");
      return;
    }
    try {
      await axios.put(
        `${base_url}/api/violations/${violationId}/status`,
        null,
        {
          params: { status: newStatus },
          withCredentials: true,
        }
      );
      fetchViolations();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      openNotificationWithError(`Error updating status: ${errorMessage}`);
    }
  };
  

  const handleClose = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
  };

  const userElements = violations.map((item, index) => ({
    key: index,
    id: item.id,
    index: index + 1,
    employeeId: item.employee?.id || "Loading...",
    employee: item.employee?.fullname || "Loading...",
    empcode: item.employee?.empCode || "Loading...",
    department: item.employee?.departmentName || "Loading...",
    position: item.employee?.positionName || "Loading...",
    role: item.role || "Loading...",
    description: item.description || "Loading...",
    violationTypeId: item.violationTypeId || "Loading...",
    violationType: item.violationType?.type || "Loading...",
    date: item.violationDate || "Loading...",
    avatar: item.employee?.avatar || Avatar_02,
    status: item.status || "Loading...",
  }));

  const filteredElements = userElements.filter((item) => {
    const matchesNameOrCode =
      item.employee
        .toLowerCase()
        .includes(fullnameOrCodeFilter.toLowerCase()) ||
      item.empcode.toLowerCase().includes(fullnameOrCodeFilter.toLowerCase());

    const matchesDepartment = item.department
      .toLowerCase()
      .includes(departmentFilter.toLowerCase());

    const matchesDate = dateFilter
      ? moment(item.date).isSame(dateFilter, "day")
      : true;

    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return (
      matchesNameOrCode && matchesDepartment && matchesDate && matchesStatus
    );
  });

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (text, record) => <span>{record.index}</span>,
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Employee",
      dataIndex: "employee",
      render: (text, record) => (
        <span className="table-avatar">
          <Link to={`/client-profile/${record.employeeId}`} className="avatar">
            <img alt="" src={record.avatar} />
          </Link>
          <Link to={`/client-profile/${record.employeeId}`}>
            {text} - {record.empcode}
          </Link>
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Date Violation",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "ViolationType",
      dataIndex: "violationType",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <span>{text.length > 10 ? `${text.substring(0, 8)}...` : text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          {userRole === "MANAGE" || userRole === "ADMIN" ? (
            <div className="dropdown action-label">
              <button
                className="btn btn-white btn-sm btn-rounded dropdown-toggle"
                type="button"
                id={`dropdownMenuButton-${record.id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  className={
                    text === "Pending"
                      ? "far fa-dot-circle text-danger"
                      : text === "Approved"
                      ? "far fa-dot-circle text-success"
                      : "far fa-dot-circle text-secondary"
                  }
                />{" "}
                {text}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby={`dropdownMenuButton-${record.id}`}
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleStatusChange(record.id, "Approved")}
                  >
                    <i className="far fa-dot-circle text-success" /> Approved
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleStatusChange(record.id, "Rejected")}
                  >
                    <i className="far fa-dot-circle text-secondary" /> Rejected
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <span>
              <i
                className={
                  text === "Pending"
                    ? "far fa-dot-circle text-danger"
                    : text === "Approved"
                    ? "far fa-dot-circle text-success"
                    : "far fa-dot-circle text-secondary"
                }
              />{" "}
              {text}
            </span>
          )}
        </>
      ),
    },

    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_violation"
              onClick={() => handleEdit(record.id)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {loading ? (
            <div className="text-center w-100">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <Breadcrumbs
                maintitle="Violation"
                title="Dashboard"
                subtitle="Violation"
                modal="#add_violation"
                name="Add Violation"
              />
              <div className="row">
                {statsData.map((data, index) => (
                  <div
                    className="col-md-6 col-sm-6 col-lg-6 col-xl-3"
                    key={index}
                  >
                    <div className="stats-info">
                      <h6>{data.title}</h6>
                      <h4>
                        {data.value} <small>{data.month}</small>
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row mb-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name or Code"
                    value={fullnameOrCodeFilter}
                    onChange={(e) => setFullnameOrCodeFilter(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filter by Department"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  />
                </div>
                <div className="col-md-3" >
                <div className="cal-icon">
                  <DatePicker
                    selected={dateFilter}
                    onChange={(date) => setDateFilter(date)}
                    className="form-control"
                    placeholderText="Filter by Date"
                  />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={filteredElements} 
                      className="table-striped"
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <AddViolation onAdd={handleAdd} />
        <EditViolation
          show={showEditModal}
          onClose={handleClose}
          onSave={handleSaveEdit}
          violationData={editViolationData}
          userRole={userRole}
        />
      </div>
    </>
  );
};

export default Violation;
