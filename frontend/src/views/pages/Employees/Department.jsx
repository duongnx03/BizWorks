import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${base_url}/api/departments`);
      setDepartments(response.data); // Adjust if the API response structure differs
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch departments");
      setLoading(false);
    }
  };

  const handleDepartmentCreated = () => {
    fetchDepartments(); // Refresh department list after creation
  };

  const openDeleteModal = (id) => {
    setDepartmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDepartmentToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${base_url}/api/departments/${departmentToDelete}`);
      fetchDepartments(); // Refresh department list after deletion
    } catch (error) {
      message.error("Failed to delete department");
    } finally {
      handleDeleteModalClose(); // Close modal
    }
  };

  const departmentElements = departments.map((department) => ({
    key: department.id,
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
      width: "50%",
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
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => openDeleteModal(record.id)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
            <Link
              className="dropdown-item"
              to={`/positions/${record.id}`}
            >
              <i className="fa fa-eye m-r-5" /> View Positions
            </Link>
          </div>
        </div>
      ),
      width: "40%",
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
          <div className="row mb-3">
            <div className="col-md-12 text-end">
              <Button
                type="primary"
                data-bs-toggle="modal"
                data-bs-target="#add_department"
              >
                Add Department
              </Button>
            </div>
          </div>
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
      {deleteModalOpen && (
        <DeleteModal
          id={departmentToDelete}
          Name="Delete Department"
          onDelete={handleDelete}
          onClose={handleDeleteModalClose}
        />
      )}
    </>
  );
};

export default Department;
