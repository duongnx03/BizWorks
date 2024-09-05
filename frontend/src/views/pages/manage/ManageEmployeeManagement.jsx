import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import EmployeeListFilter from "../../../components/EmployeeListFilter";
import AllEmployeeAddPopup from "../../../components/modelpopup/AllEmployeeAddPopup";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-info text-white";
    case "Approved":
      return "bg-success text-white";
    case "Rejected":
      return "bg-danger text-white";
    default:
      return "bg-secondary";
  }
};

const ManageEmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [noData, setNoData] = useState(false);
  const recordsPerPage = 9;

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/emp-queue/getBySender",
        {
          withCredentials: true,
        }
      );
      if (response.data.data) {
        // Sắp xếp nhân viên theo ID từ mới đến cũ
        const sortedEmployees = response.data.data.sort((a, b) => b.id - a.id);
        setEmployees(sortedEmployees);
        setFilteredEmployees(sortedEmployees);
      }
      setLoading(false);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu nhân viên:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesEmpCode = employee.empCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment
        ? employee.department === selectedDepartment.label
        : true;
      const matchesPosition = selectedPosition
        ? employee.position === selectedPosition.label
        : true;
      const matchesStartDate = startDate
        ? new Date(employee.startDate).toLocaleDateString() ===
          new Date(startDate).toLocaleDateString()
        : true;
      return (
        matchesEmpCode &&
        matchesDepartment &&
        matchesPosition &&
        matchesStartDate
      );
    });
    setFilteredEmployees(filtered);
    setNoData(filtered.length === 0);
  }, [searchTerm, selectedDepartment, selectedPosition, startDate, employees]);

  const sortedEmployees = React.useMemo(() => {
    return filteredEmployees;
  }, [filteredEmployees]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(sortedEmployees.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectedDepartment = (department) => {
    setSelectedDepartment(department);
  };

  const handleSelectedPosition = (position) => {
    setSelectedPosition(position);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#add_employee"
            name="Add Leader"
          />
          <EmployeeListFilter
            handleSearchInputChange={handleSearchInputChange}
            setSelectedDepartment={handleSelectedDepartment}
            setSelectedPosition={handleSelectedPosition}
            setStartDate={handleStartDate}
          />
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                {loading ? (
                  <div className="alert alert-info">Loading...</div>
                ) : noData ? (
                  <div className="alert alert-warning">No data found</div>
                ) : (
                  <>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>
                            Employee Infomation
                          </th>
                          <th>
                            Email 
                          </th>
                          <th>
                            Start Date
                          </th>
                          <th>
                            Department
                          </th>
                          <th>
                            Position
                          </th>
                          <th>Description</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>
                              <span className="table-avatar">
                                <Link
                                  to={`/client-profile/${employee.id}`}
                                  className="avatar"
                                >
                                  <img
                                    alt=""
                                    src={
                                      employee.avatar || "default-avatar.png"
                                    }
                                  />
                                </Link>5
                                <Link to={`/client-profile/${employee.id}`}>
                                  {employee.empCode} - {employee.fullname}
                                </Link>
                              </span>
                            </td>
                            <td>{employee.email}</td>
                            <td>
                              {new Date(
                                employee.startDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{employee.departmentName}</td>
                            <td>{employee.positionName}</td>
                            <td>{employee.description}</td>
                            <td
                              className={`text-center ${getStatusStyle(
                                employee.status
                              )}`}
                            >
                              {employee.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "10px 0",
                      }}
                    >
                      <nav>
                        <ul className="pagination" style={{ margin: 0 }}>
                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index + 1}
                              className={`page-item ${
                                index + 1 === currentPage ? "active" : ""
                              }`}
                              style={{ margin: "0 2px" }}
                            >
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className="page-link"
                                style={{
                                  backgroundColor:
                                    index + 1 === currentPage
                                      ? "#FF902F"
                                      : "#fff",
                                  borderColor:
                                    index + 1 === currentPage
                                      ? "#FF902F"
                                      : "#dee2e6",
                                  color:
                                    index + 1 === currentPage
                                      ? "#fff"
                                      : "#373B3E",
                                }}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <AllEmployeeAddPopup refreshEmployeeList={fetchEmployees} />
      </div>
    </div>
  );
};

export default ManageEmployeeManagement;
