import React from "react";
import { Link } from "react-router-dom";
import Salary from "../../../../../assets/json/employeeSalary";
import { Table } from "antd";
import EditSalaryModal from "../../../../../components/modelpopup/EditSalaryModal";
import DeleteModal from "../../../../../components/modelpopup/deletePopup";
import SearchBox from "../../../../../components/SearchBox";

const SalaryTable = () => {
  const data = Salary.Salary;
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={record.avatar} />
          </Link>
          <Link to="/profile">
            {text} <span>{record.name}</span>
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    // {
    //   title: "Code",
    //   dataIndex: "employeeId",
    //   sorter: (a, b) => a.employeeId.length - b.employeeId.length,
    // },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Position",
      dataIndex: "positions",
    },
    {
      title: "Salary Date",
      dataIndex: "joiningDate",
      sorter: (a, b) => a.joiningDate.length - b.joiningDate.length,
    },
    {
      title: "Net Salary",
      dataIndex: "salary",
      render: (text) => <span>${text}</span>,
      sorter: (a, b) => a.salary.length - b.salary.length,
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
              data-bs-target="#edit_salary"
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
    {
      title: "Payslip",
      render: () => (
        <Link className="btn btn-sm btn-primary" to="/salary-view">
          Generate Slip
        </Link>
      ),
    },
  ];
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
          <SearchBox />
            <Table
              className="table-striped"
              style={{ overflowX: "auto" }}
              columns={columns}
              dataSource={data}
              rowKey={(record) => record.id}
            />
            
          </div>
        </div>
      </div>

      <EditSalaryModal />
      <DeleteModal Name="Delete Salary" />
    </>
  );
};

export default SalaryTable;
