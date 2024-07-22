import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, message, Button } from "antd";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../components/SearchBox";
import DepartmentModal from "../../../components/modelpopup/DepartmentModal";
import { base_url } from "../../../base_urls";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${base_url}/api/departments`);
      setDepartments(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch departments");
      setLoading(false);
    }
  };

  const handleDepartmentCreated = () => {
    fetchDepartments(); // Refresh department list after creation
  };

  const departmentElements = departments.map((department, index) => ({
    key: index,
    id: department.id,
    department: department.departmentName,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Department Name",
      dataIndex: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      width: "70%",
    },
    {
      title: "Actions",
      className: "text-end",
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
            {/* <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_department"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link> */}
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
          {/* <Button onClick={() => navigate(`/positions/${record.id}`)}>
            View Positions
          </Button> */}
        </div>
      ),
      width: "20%",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Department"
            title="Dashboard"
            subtitle="Department"
            modal="#add_department"
            name="Add Department"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={departmentElements}
                  loading={loading}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepartmentModal onDepartmentCreated={handleDepartmentCreated} />
      <DeleteModal
        id={departments.length > 0 ? departments[0].id : null}
        Name="Delete Department"
        onDelete={fetchDepartments}
      />
    </>
  );
};

export default Department;
