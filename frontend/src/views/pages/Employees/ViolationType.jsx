import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../components/SearchBox";
import ViolationTypeModal from "../../../components/modelpopup/ViolationTypeModal";
import { base_url } from "../../../base_urls";

const ViolationType = () => {
  const [violationTypes, setViolationTypes] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchViolationTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/violation-types` ,{withCredentials: true});
      setViolationTypes(response.data);
    } catch (error) {
      console.error("Error fetching violation types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolationTypes();
  }, []);

  const handleAdd = async (data) => {
    try {
      await axios.post(`${base_url}/api/violation-types`, data, {withCredentials: true});
      fetchViolationTypes();
    } catch (error) {
      console.error("Error adding violation type:", error);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await axios.put(`${base_url}/api/violation-types/${id}`, data, {withCredentials: true});
      fetchViolationTypes();
    } catch (error) {
      console.error("Error editing violation type:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${base_url}/api/violation-types/${deleteId}`, {withCredentials: true});
      fetchViolationTypes();
      setDeleteId(null); // Clear the delete ID after successful deletion
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting violation type:", error);
    }
  };
  const handleClose = () => {
    setShowDeleteModal(false);
  };

  const userElements = violationTypes.map((item, index) => ({
    key: index,
    id: item.id,
    index: index + 1,
    violationType: item.type,
    violationMoney: item.violationMoney,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (text, record) => <span>{record.index}</span>,
      sorter: (a, b) => a.index - b.index,
      width: "10%",
    },
    {
      title: "ViolationType Name",
      dataIndex: "violationType",
      sorter: (a, b) => a.violationType.length - b.violationType.length,
      width: "70%",
    },
    {
      title: "Violation Money",
      dataIndex: "violationMoney",
      render: (text) => <span>${text}</span>,
      sorter: (a, b) => a.violationMoney - b.violationMoney,
      width: "40%",
    },
    {
      title: "Action",
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
              data-bs-toggle="modal"
              data-bs-target="#edit_violationType"
              onClick={() => setEditData(record)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              onClick={() => setDeleteId(record.id)}
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
            maintitle="ViolationType"
            title="Dashboard"
            subtitle="ViolationType"
            modal="#add_violationType"
            name="Add ViolationType"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={userElements?.length > 0 ? userElements : []}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViolationTypeModal
        onAdd={handleAdd}
        onEdit={handleEdit}
        editData={editData}
      />
      <DeleteModal
        Name="Delete ViolationType"
        onConfirm={handleDelete}
        onClose={handleClose}
      />
    </>
  );
};

export default ViolationType;
