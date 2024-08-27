import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "antd";
import EditSalaryModal from "../../../../../components/modelpopup/EditSalaryModal";
import DeleteModal from "../../../../../components/modelpopup/deletePopup";
import SearchBox from "../../../../../components/SearchBox";

const SalaryTable = ({ data, loading }) => {
  const [selectedSalary, setSelectedSalary] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleGenerateSlip = (salary) => {
    setSelectedSalary(salary);
    navigate("/salary-view", { state: { salary } }); // Navigate to PaySlip page with salary data
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employee",
      render: (employee) => (
        <div className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={employee.avatar} /> {/* Assuming employee has an avatar field */}
          </Link>
          <Link to="/profile">
            {employee.fullname}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.employee.fullname.localeCompare(b.employee.fullname),
    },
    {
      title: "Email",
      dataIndex: "employee",
      render: (employee) => employee.email,
      sorter: (a, b) => a.employee.email.localeCompare(b.employee.email),
    },
    {
      title: "Department",
      dataIndex: "employee",
      render: (employee) => employee.department, // Assuming department is part of employee
    },
    {
      title: "Position",
      dataIndex: "employee",
      render: (employee) => employee.position, // Assuming position is part of employee
    },
    {
      title: "Salary Date",
      dataIndex: "dateSalary",
      render: (dateSalary) => new Date(dateSalary).toLocaleDateString(), // Format date
      sorter: (a, b) => new Date(a.dateSalary) - new Date(b.dateSalary),
    },
    {
      title: "Net Salary",
      dataIndex: "totalSalary",
      render: (text) => <span>${text.toFixed(2)}</span>,
      sorter: (a, b) => a.totalSalary - b.totalSalary,
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
      render: (record) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleGenerateSlip(record)}
        >
          Generate Slip
        </button>
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
              loading={loading}
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
