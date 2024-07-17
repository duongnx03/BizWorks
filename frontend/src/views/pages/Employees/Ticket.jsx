import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import { Avatar_02, Avatar_05 } from "../../../Routes/ImagePath";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import TicketModelPopup from "../../../components/modelpopup/TicketModelPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TicketFilter from "../../../components/TicketFilter";
import { base_url } from "../../../base_urls";

const Ticket = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(base_url + "/api/ticket.json").then((res) => setUsers(res.data));
  }, []);

  const data = [
    {
      id: 1,
      image: Avatar_02,
      name: "John Doe",
      ticketid: "TKT-0001",
      ticketsubject: "Internet Issue",
      createddate: "5 Jan 2023 07:21 AM",
      lastreply: "5 Jan 2023 11.12 AM	",
      priority: "High",
      status: "New",
    },
    {
      id: 2,
      image: Avatar_05,
      name: "Catherine Manseau",
      ticketid: "TKT-0001",
      ticketsubject: "Laptop Issue",
      createddate: "5 Jan 2023 07:21 AM",
      lastreply: "5 Jan 2023 11.12 AM	",
      priority: "High",
      status: "New",
    },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Ticket Id",
      dataIndex: "ticketid",
      render: () => (
        <Link
          onClick={() => localStorage.setItem("minheight", "true")}
          to="/ticket-view"
        >
          #TKT-0001
        </Link>
      ),
      sorter: (a, b) => a.ticketid.length - b.ticketid.length,
    },

    {
      title: "Ticket Subject",
      dataIndex: "ticketsubject",
      sorter: (a, b) => a.ticketsubject.length - b.ticketsubject.length,
    },
    {
      title: "Assigned Staff",
      dataIndex: "name",
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
      title: "Created Date",
      dataIndex: "createddate",
      sorter: (a, b) => a.createddate.length - b.createddate.length,
    },

    {
      title: "Last Reply",
      dataIndex: "lastreply",
      sorter: (a, b) => a.lastreply.length - b.lastreply.length,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: () => (
        <div className="dropdown action-label">
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="far fa-dot-circle text-danger" /> High{" "}
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-danger" /> High
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-warning" /> Medium
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-success" /> Low
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.priority.length - b.priority.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => (
        <div className="dropdown action-label text-center">
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="far fa-dot-circle text-danger" /> New
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-info" /> Open
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-info" /> Reopened
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-danger" /> On Hold
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-success" /> Closed
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-success" /> In Progress
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-danger" /> Cancelled
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
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
              data-bs-target="#edit_ticket"
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
      sorter: true,
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Tickets"
            title="Dashboard"
            subtitle="Tickets"
            modal="#add_ticket"
            name="Add Ticket"
          />

          <div className="row">
            <div className="col-md-12">
              <div className="card-group m-b-30">
                {users?.map((user, index) => (
                  <div className="card" key={index}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">{user.title}</span>
                        </div>
                        <div>
                          <span
                            className={
                              user.percentage.includes("-")
                                ? "text-danger"
                                : "text-success"
                            }
                          >
                            {user.percentage}
                          </span>
                        </div>
                      </div>
                      <h3 className="mb-3">{user.value}</h3>
                      <div className="progress mb-2" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: "70%" }}
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TicketFilter />

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={data?.length > 0 ? data : []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TicketModelPopup />
      <DeleteModal Name="Delete Ticket" />
    </>
  );
};

export default Ticket;
