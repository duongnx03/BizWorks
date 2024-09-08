import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LeaderAddEmployeeModelPopup from "../../../components/modelpopup/LeaderAddEmployeeModelPopop";

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

const LeaderEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  const sortedEmployees = React.useMemo(() => {
    return employees;
  }, [employees]);

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

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#leader_add_employee"
            name="Add Employee to Department"
          />
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                {loading ? (
                  <div className="alert alert-info">Loading...</div>
                ) : (
                  <>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Employee Infomation</th>
                          <th>Email</th>
                          <th>Start Date</th>
                          <th>Description</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <Link
                                  to={`/client-profile/${employee.id}`}
                                  className="me-3"
                                >
                                  <div
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      alt="Employee Avatar"
                                      src={
                                        employee.avatar || "default-avatar.png"
                                      }
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  </div>
                                </Link>
                                <div>
                                  <Link
                                    to={`/client-profile/${employee.id}`}
                                    className="text-decoration-none fw-bold text-dark"
                                  >
                                    {employee.empCode} - {employee.fullname}
                                  </Link>
                                  <div className="mt-1">
                                    <span className="d-block fw-semibold">
                                      {employee.departmentName}
                                    </span>
                                    <span className="d-block text-muted">
                                      {employee.positionName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{employee.email}</td>
                            <td>
                              {new Date(
                                employee.startDate
                              ).toLocaleDateString()}
                            </td>
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
        <LeaderAddEmployeeModelPopup refreshEmployeeList={fetchEmployees} />
      </div>
    </div>
  );
};

export default LeaderEmployees;
