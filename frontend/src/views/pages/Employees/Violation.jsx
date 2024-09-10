import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import AddViolation from "../../../components/modelpopup/AddViolation";
import EditViolation from "../../../components/modelpopup/EditViolation";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { base_url } from "../../../base_urls";
import { Avatar_02 } from "../../../Routes/ImagePath";

const Violation = () => {
  const [violations, setViolations] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editViolationData, setEditViolationData] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole'));

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violations`, {
        withCredentials: true,
      });
      setViolations(response.data.data);
      await updateStats(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching violations:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${base_url}/api/employee/getAllEmployees`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };

  const updateStats = async (violationsData) => {
    try {
      // Fetch tất cả các nhân viên
      const allEmployees = await fetchEmployees();
  
      // Lấy tháng và năm hiện tại
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Tháng hiện tại (0-11)
      const currentYear = currentDate.getFullYear(); // Năm hiện tại
  
      // Lọc các vi phạm trong tháng hiện tại
      const violationsThisMonth = violationsData.filter((v) => {
        const violationDate = new Date(v.violationDate); // Chuyển đổi chuỗi ngày thành đối tượng Date
        return (
          violationDate.getMonth() === currentMonth &&
          violationDate.getFullYear() === currentYear
        );
      });
  
      // Tìm những nhân viên có vi phạm trong tháng hiện tại
      const employeeIdsWithViolations = violationsThisMonth.map((v) => v.id);
      const uniqueEmployeeIdsWithViolations = [...new Set(employeeIdsWithViolations)];
  
      // Đếm tổng số nhân viên có vi phạm và tổng số vi phạm trong tháng hiện tại
      const totalEmployeesWithViolations = uniqueEmployeeIdsWithViolations.length;
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
          value: totalEmployeesWithViolations, // Nhân viên có vi phạm trong tháng hiện tại
          month: "this month",
        },
        {
          title: "Total Violation",
          value: totalViolations, // Tổng số vi phạm trong tháng hiện tại
          month: "this month",
        },
        {
          title: "Pending Request",
          value: pendingViolations, // Vi phạm đang chờ xử lý trong tháng hiện tại
        },
        {
          title: "Rejected",
          value: rejectedViolations, // Vi phạm bị từ chối trong tháng hiện tại
        },
      ]);
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };
  
  

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleAdd = async (data) => {
    try {
      await axios.post(`${base_url}/api/violations`, data, {
        withCredentials: true,
      });
      fetchViolations();
    } catch (error) {
      console.error(
        "Error adding violation:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${base_url}/api/violations/${id}`, {
        withCredentials: true,
      });
      setEditViolationData(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching violation data:", error);
    }
  };

  const handleSaveEdit = async (data) => {
    try {
      await axios.put(`${base_url}/api/violations/${data.id}`, data, {
        withCredentials: true,
      });
      fetchViolations();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating violation:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${base_url}/api/violations/${deleteId}`, {
        withCredentials: true,
      });
      fetchViolations();
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting violation:", error);
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
    employeeId: item.id,
    employee: item.employee?.fullname || "Loading...",
    empcode: item.employee?.empCode || "Loading...",
    department: item.employee?.departmentName || "Loading...",
    position: item.employee?.positionName || "Loading...",
    role: item.role,
    description: item.description,
    violationTypeId: item.violationTypeId,
    violationType: item.violationType?.type || "Loading...",
    date: item.violationDate,
    avatar: item.employee?.avatar || Avatar_02,
    status: item.status,
  }));

  const handleStatusChange = async (violationId, newStatus) => {
    try {
      await axios.put(
        `${base_url}/api/violations/${violationId}/status`,
        null,
        {
          params: { status: newStatus },
          withCredentials: true,
        }
      );
      fetchViolations(); // Cập nhật lại danh sách vi phạm sau khi thay đổi trạng thái
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
          <Link to="/client-profile" className="avatar">
            <img alt="" src={record.avatar} />
          </Link>
          <Link to="/client-profile">{text} - {record.empcode}</Link>
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    // {
    //   title: "Position",
    //   dataIndex: "position",
    // },
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
            // Nếu role là EMPLOYEE thì chỉ hiển thị status mà không có dropdown
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
      sorter: (a, b) => a.status.length - b.status.length,
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
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa fa-trash m-r-5" /> Delete
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
              {/* Page Header */}
              <Breadcrumbs
                maintitle="Violation"
                title="Dashboard"
                subtitle="Violation"
                modal="#add_violation"
                name="Add Violation"
              />

              {/* /Page Header */}
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
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    {/* <SearchBox /> */}
                    <Table
                      columns={columns}
                      dataSource={userElements}
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
        <EditViolation onEdit={handleEdit} />
        <DeleteModal
          show={showDeleteModal}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default Violation;
