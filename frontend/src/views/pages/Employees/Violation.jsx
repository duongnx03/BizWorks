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
import { Avatar_02, Avatar_09 } from "../../../Routes/ImagePath";

const Violation = () => {
  const [violations, setViolations] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editViolationData, setEditViolationData] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violations`, {
        withCredentials: true,
      });
      setViolations(response.data);
      await updateStats(response.data);
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
      const employeeIds = violationsData.map((v) => v.employeeId);
      const uniqueEmployeeIds = [...new Set(employeeIds)];
      const totalEmployeesWithViolations = uniqueEmployeeIds.length;
      const totalViolations = violationsData.length;
      const pendingViolations = violationsData.filter(
        (v) => v.status === "Pending"
      ).length;
      const cancelViolations = violationsData.filter(
        (v) => v.status === "Cancel"
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
        },
        {
          title: "Cancel",
          value: cancelViolations,
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
    employeeId: item.employeeId,
    employee: item.employee?.fullname || "Loading...",
    role: item.role,
    reason: item.reason,
    violationTypeId: item.violationTypeId,
    violationType: item.violationType?.type || "Loading...",
    date: item.violationDate,
    image: item.employee?.image || Avatar_02,
    apimage: item.employee?.apimage || Avatar_09,
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
          <Link to="/profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <Link to="/profile">{text}</Link>
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "ViolationType",
      dataIndex: "violationType",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (text) => (
        <span>{text.length > 10 ? `${text.substring(0, 8)}...` : text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
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
                  : text === "Resolved"
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
                onClick={() => handleStatusChange(record.id, "Pending")}
              >
                <i className="far fa-dot-circle text-danger" /> Pending
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusChange(record.id, "Resolved")}
              >
                <i className="far fa-dot-circle text-success" /> Resolved
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusChange(record.id, "Cancel")}
              >
                <i className="far fa-dot-circle text-secondary" /> Cancel
              </button>
            </li>
          </ul>
        </div>
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
