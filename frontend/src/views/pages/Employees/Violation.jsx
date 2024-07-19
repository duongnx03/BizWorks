import React from "react";
import { Link } from "react-router-dom";
import { Avatar_02, Avatar_09 } from "../../../Routes/ImagePath";
import { Table } from "antd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import AddViolation from "../../../components/modelpopup/AddViolation";
import DeleteModal from "../../../components/modelpopup/DeleteModal";

const Violation = () => {
  const statsData = [
    {
      title: "Employee",
      value: 2,
      month: "this month",
    },
    {
      title: "Count",
      value: 2,
      month: "this month",
    },
    {
      title: "Pending Request",
      value: 1,
    },
    {
      title: "Rejected",
      value: 0,
    },
  ];
  const data = [
    {
      id: 1,
      image: Avatar_02,
      employee: "Dien",
      role: "Web Designer",
      reason: "Tied",
      violationType: "Late",
      date: "1 Jan 2023",
      apimage: Avatar_09,
      status: "New",
    },
    {
        id: 2,
        image: Avatar_02,
        employee: "Tri",
        role: "Web Designer",
        reason: "Tied",
        violationType: "Sleep",
        date: "1 Jan 2023",
        apimage: Avatar_09,
        status: "Pending",
      },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id.length - b.id.length,
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
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "ViolationType",
      dataIndex: "violationType",
      sorter: (a, b) => a.violationType.length - b.violationType.length,
    },

    {
      title: "Reason",
      dataIndex: "reason",
      sorter: (a, b) => a.reason.length - b.reason.length,
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
                  : text === "Approved"
                  ? "far fa-dot-circle text-success"
                  : "far fa-dot-circle text-danger"
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
                    {data.value} <span>{data.month}</span>
                  </h4>
                </div>
              </div>
            ))}
          </div>
          {/* /Overtime Statistics */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  className="table-striped"
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      <AddViolation />
      <DeleteModal Name="Delete Violation" />
    </>
  );
};

export default Violation;
