import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import ViolationModal from "../../../components/modelpopup/ViolationModal";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { base_url } from "../../../base_urls";
import { Avatar_02, Avatar_09 } from "../../../Routes/ImagePath";
import EmployeeListFilter from "../../../components/EmployeeListFilter";


const Violation = () => {
  const [violations, setViolations] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violations`, {withCredentials: true});
      setViolations(response.data);
      await updateStats(response.data);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${base_url}/api/employee/getAllEmployees`, {withCredentials: true});
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };
  const updateStats = async (violationsData) => {
    try {
      const employeesData = await fetchEmployees();
      const totalEmployees = employeesData.length > 0 ? employeesData.length : 0;
      const totalViolations = violationsData.length;
      const pendingViolations = violationsData.filter(v => v.status === "Pending").length;
      const rejectedViolations = violationsData.filter(v => v.status === "Rejected").length;

      setStatsData([
        {
          title: "Violation Employee",
          value: totalEmployees,
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
          title: "Rejected",
          value: rejectedViolations,
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
      await axios.post(`${base_url}/api/violations`, data, {withCredentials: true});
      fetchViolations();
    } catch (error) {
      console.error("Error adding violation:", error);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await axios.put(`${base_url}/api/violations/${id}`, data, {withCredentials: true});
      fetchViolations();
    } catch (error) {
      console.error("Error editing violation:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${base_url}/api/violations/${deleteId}`, {withCredentials: true});
      fetchViolations();
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting violation:", error);
    }
  };

  const handleClose = () => {
    setShowDeleteModal(false);
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
    // {
    //   title: "ViolationType",
    //   dataIndex: "violationType",
    // },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (text) => (
        <span>
          {text.length > 10 ? `${text.substring(0, 8)}...` : text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown action-label text-center">
          <Link
            className="btn btn-white btn-sm btn-rounded "
            to="#"
            aria-expanded="false"
          >
            <i
              className={
                text === "New"
                  ? "far fa-dot-circle text-purple"
                  : text === "Pending"
                  ? "far fa-dot-circle text-info"
                  : text === "Cancel"
                  ? "far fa-dot-circle text-danger"
                  : "far fa-dot-circle text-success"
              }
            />{" "}
            {text}
          </Link>
        </div>
      ),
    },
    {
      title: "Action",
      render: () => (
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
              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3" key={index}>
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
              <EmployeeListFilter/>
              <SearchBox />
                <Table
                  columns={columns}
                  dataSource={userElements}
                  className="table-striped"
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
        <ViolationModal onAdd={handleAdd}  onEdit={handleEdit}
        />
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