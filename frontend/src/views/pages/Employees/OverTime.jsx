import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";

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

const getType = (type) => {
  switch (type) {
    case "noon_overtime":
      return "Overtime noon from 12h to 13h";
    case "30m_overtime":
      return "Overtime after work 30 minutes";
    case "1h_overtime":
      return "Overtime after work 1 hour";
    case "1h30_overtime":
      return "Overtime after work 1 hour 30 minutes";
    case "2h_overtime":
      return "Overtime after work 2 hours";
    default:
      return "Invalid type";
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "00:00";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const formatTimeAMPM = (timeString) => {
  if (!timeString) return "00:00 AM";
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const OverTime = () => {
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;

  const fetchOvertimes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/overtime/getByEmail",
        {
          withCredentials: true,
        }
      );
      if (response.data.data) {
        // Sắp xếp nhân viên theo ID từ mới đến cũ
        const sortedEmployees = response.data.data.sort((a, b) => b.id - a.id);
        setOvertimes(sortedEmployees);
      }
      setLoading(false);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu nhân viên:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimes();
  }, []);

  const sortedOvetimes = React.useMemo(() => {
    return overtimes;
  }, [overtimes]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentOvetimes = sortedOvetimes.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(sortedOvetimes.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs
              maintitle="Overtime"
              title="Dashboard"
              subtitle="Overtime"
            />
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  {loading ? (
                    <div className="alert alert-info">Loading...</div>
                  ) : (
                    <>
                      <table className="table table-striped table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Overtime Start</th>
                            <th>Overtime End</th>
                            <th>Check Out Time</th>
                            <th>Note</th>
                            <th>Reason for Overtime</th>
                            <th>Description</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOvetimes.map((overtime) => (
                            <tr key={overtime.id}>
                              <td>{formatTime(overtime.overtimeStart)}</td>
                              <td>{formatTime(overtime.overtimeEnd)}</td>
                              <td>{formatTimeAMPM(overtime.checkOutTime)}</td>
                              <td>{getType(overtime.type)}</td>
                              <td>{overtime.reason}</td>
                              <td>{overtime.description}</td>
                              <td
                                className={`text-center ${getStatusStyle(
                                  overtime.status
                                )}`}
                              >
                                {overtime.status}
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
        </div>
      </div>
    </>
  );
};

export default OverTime;
