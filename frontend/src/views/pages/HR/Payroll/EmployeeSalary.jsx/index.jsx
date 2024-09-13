import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Table, Button } from "antd";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import AddSalaryModal from "../../../../../components/modelpopup/AddSalaryModal";
import EditSalaryModal from "../../../../../components/modelpopup/EditSalaryModal";
import DeleteModal from "../../../../../components/modelpopup/deletePopup";
import { base_url } from "../../../../../base_urls";

const EmployeeSalary = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [inputEmployeeName, setInputEmployeeName] = useState("");
  const [inputSalaryCode, setInputSalaryCode] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeNameFocused, setEmployeeNameFocused] = useState(false);
  const [salaryCodeFocused, setSalaryCodeFocused] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [totalSalary, setTotalSalary] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [editSalaryId, setEditSalaryId] = useState(null);

  const navigate = useNavigate();

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year };
  });

  useEffect(() => {
    fetchSalaries();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const filtered = salaryData.filter((item) => {
      const employee = item.employees[0] || {};
      const departmentMatch = selectedOption
        ? employee.departmentName === selectedOption.label
        : true;

      return (
        employee.fullname &&
        employee.fullname
          .toLowerCase()
          .includes(inputEmployeeName.toLowerCase()) &&
        item.salaryCode &&
        item.salaryCode.toLowerCase().includes(inputSalaryCode.toLowerCase()) &&
        departmentMatch &&
        (selectedMonth ? item.month === selectedMonth.value : true) &&
        (selectedYear ? item.year === selectedYear.value : true)
      );
    });

    setFilteredData(filtered);
    const total = filtered.reduce((acc, item) => acc + item.totalSalary, 0);
    setTotalSalary(total);
  }, [
    inputEmployeeName,
    inputSalaryCode,
    selectedOption,
    selectedMonth,
    selectedYear,
    salaryData,
  ]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/salaries`, {
        withCredentials: true,
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // Convert month to numeric value if needed
      const formattedData = data.map((item) => ({
        ...item,
        month: parseInt(item.month, 10), // Convert month to number
      }));
      setSalaryData(formattedData);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${base_url}/api/departments`, {
        withCredentials: true,
      });
      setDepartmentOptions(
        response.data.map((department) => ({
          value: department.id,
          label: department.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleEmployeeNameFocus = () => setEmployeeNameFocused(true);
  const handleEmployeeNameBlur = () =>
    !inputEmployeeName && setEmployeeNameFocused(false);
  const handleSalaryCodeFocus = () => setSalaryCodeFocused(true);
  const handleSalaryCodeBlur = () =>
    !inputSalaryCode && setSalaryCodeFocused(false);

  const handleEmployeeNameChange = (e) => setInputEmployeeName(e.target.value);

  const handleSalaryCodeChange = (e) => setInputSalaryCode(e.target.value);

  const handleSelectDepartmentChange = (selected) =>
    setSelectedOption(selected);

  const handleSelectMonthChange = (selected) => setSelectedMonth(selected);

  const handleSelectYearChange = (selected) => setSelectedYear(selected);

  const handleGenerateSlip = (salary) => {
    setSelectedSalary(salary);
    navigate("/salary-view", { state: { salary } });
  };

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handlePaymentRequest = () => {
    setShowCheckbox(!showCheckbox);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  const handleEditClick = async (id) => {
    setEditSalaryId(id);
    // Open modal programmatically
    document.getElementById('edit_salary').classList.add('show');
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employees",
      render: (employees) =>
        employees.length > 0 ? (
          <div className="table-avatar">
            <Link to="/profile" className="avatar">
              <img alt="" src={employees[0].avatar} />
            </Link>
            <Link to="/profile">
              {employees[0].fullname} - {employees[0].empCode}
            </Link>
          </div>
        ) : (
          "No Employee"
        ),
      sorter: (a, b) =>
        a.employees[0]?.fullname.localeCompare(b.employees[0]?.fullname),
    },
    {
      title: "Email",
      dataIndex: "employees",
      render: (employees) => {
        if (employees.length > 0) {
          const emailPrefix = employees[0].email.split("@")[0];
          return emailPrefix.length > 10
            ? `${emailPrefix.slice(0, 10)}...`
            : emailPrefix;
        }
        return "No Email";
      },
      sorter: (a, b) =>
        a.employees[0]?.email
          .split("@")[0]
          .localeCompare(b.employees[0]?.email.split("@")[0]),
    },
    {
      title: "Department",
      dataIndex: "employees",
      render: (employees) =>
        employees.length > 0 ? employees[0].departmentName : "No Department",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span>
          <i
            className={
              text === "Pending"
                ? "far fa-dot-circle text-primary"
                : text === "Approved"
                ? "far fa-dot-circle text-info"
                : text === "Paid"
                ? "far fa-dot-circle text-success"
                : "far fa-dot-circle text-danger"
            }
          />{" "}
          {text}
        </span>
      ),
    },
    {
      title: "Month",
      dataIndex: "month",
      render: (month) =>
        months.find((m) => m.value === month)?.label || "Unknown",
      sorter: (a, b) => a.month - b.month,
    },
    {
      title: "Year",
      dataIndex: "year",
      render: (year) => `${year}`,
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Net Salary",
      dataIndex: "totalSalary",
      render: (text) => <span>${text.toFixed(2)}</span>,
      sorter: (a, b) => a.totalSalary - b.totalSalary,
    },
    {
      title: "Details",
      render: (record) => (
        <Button
          className="btn btn-sm btn-primary"
          onClick={() => handleGenerateSlip(record)}
        >
          View
        </Button>
      ),
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
              onClick={() => handleEditClick(record.id)}
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
  ];

  const hasFiltersApplied = () => {
    return (
      selectedOption ||
      selectedMonth ||
      selectedYear ||
      inputEmployeeName ||
      inputSalaryCode
    );
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee Salary"
            title="Dashboard"
            subtitle="Salary"
            modal="#add_salary"
            name="Add Salary"
          />
  
          <div className="row filter-row">
            {/* Các trường tìm kiếm */}
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div
                className={`input-block form-focus ${
                  employeeNameFocused || inputEmployeeName ? "focused" : ""
                }`}
              >
                <input
                  type="text"
                  className="form-control floating"
                  value={inputEmployeeName}
                  onFocus={handleEmployeeNameFocus}
                  onBlur={handleEmployeeNameBlur}
                  onChange={handleEmployeeNameChange}
                />
                <label
                  className="focus-label"
                  onClick={handleEmployeeNameFocus}
                >
                  Employee Name
                </label>
              </div>
            </div>
            {/* Các trường tìm kiếm khác */}
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div
                className={`input-block form-focus ${
                  salaryCodeFocused || inputSalaryCode ? "focused" : ""
                }`}
              >
                <input
                  type="text"
                  className="form-control floating"
                  value={inputSalaryCode}
                  onFocus={handleSalaryCodeFocus}
                  onBlur={handleSalaryCodeBlur}
                  onChange={handleSalaryCodeChange}
                />
                <label className="focus-label" onClick={handleSalaryCodeFocus}>
                  Salary Code
                </label>
              </div>
            </div>
            {/* Các trường tìm kiếm khác */}
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select--"
                  onChange={handleSelectDepartmentChange}
                  options={departmentOptions}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Department</label>
              </div>
            </div>
            {/* Các trường tìm kiếm khác */}
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select Month--"
                  onChange={handleSelectMonthChange}
                  options={months}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Month</label>
              </div>
            </div>
            {/* Các trường tìm kiếm khác */}
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select Year--"
                  onChange={handleSelectYearChange}
                  options={years}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Year</label>
              </div>
            </div>
            {/* Các nút khác */}
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <Link
                to="#"
                className="btn btn-success w-100"
                onClick={handlePaymentRequest}
              >
                {showCheckbox ? "Hide" : "Select Payment"}
              </Link>
            </div>
          </div>
  
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex justify-content-end">
                    <h5>
                      Total salary due this month:{" "}
                      <span className="text-success">
                        ${totalSalary.toFixed(2)}
                      </span>
                    </h5>
                  </div>
                  {/* Nút Reset */}
                  {hasFiltersApplied() && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to="#"
                        className="btn btn-link"
                        onClick={() => {
                          setSelectedOption(null);
                          setSelectedMonth(null);
                          setSelectedYear(null);
                          setInputEmployeeName("");
                          setInputSalaryCode("");
                        }}
                        style={{
                          border: "none",
                          background: "none",
                          color: "#FF902F",
                          fontSize: "18px",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        x
                      </Link>
                    </div>
                  )}
                </div>
  
                <Table
                  className="table-striped"
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={filteredData}
                  rowKey={(record) => record.id}
                  loading={loading}
                  rowSelection={
                    showCheckbox
                      ? {
                          selectedRowKeys,
                          onChange: handleSelectChange,
                        }
                      : null
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <AddSalaryModal onAddSuccess={fetchSalaries} />
      <EditSalaryModal
        salaryId={editSalaryId}
        onEditSuccess={fetchSalaries}
        onClose={() => setEditSalaryId(null)} // Ensure the modal closes
      />
      <DeleteModal Name="Delete Salary" />
    </>
  );
};

export default EmployeeSalary;
