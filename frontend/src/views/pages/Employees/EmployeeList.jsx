import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import EmployeeListFilter from "../../../components/EmployeeListFilter";
import AllEmployeeAddPopup from "../../../components/modelpopup/AllEmployeeAddPopup";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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
      const response = await axios.get('http://localhost:8080/api/employee/getAllEmployees', {
        withCredentials: true,
      });
      if (response.data.data) {
        // Sắp xếp nhân viên theo ID từ mới đến cũ
        const sortedEmployees = response.data.data.sort((a, b) => b.id - a.id);
        setEmployees(sortedEmployees);
        setFilteredEmployees(sortedEmployees);
      }
      setLoading(false);
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy dữ liệu nhân viên:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee => {
      const matchesEmpCode = employee.empCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment
        ? employee.department === selectedDepartment.label
        : true;
      const matchesPosition = selectedPosition
        ? employee.position === selectedPosition.label
        : true;
      const matchesStartDate = startDate
        ? new Date(employee.startDate).toLocaleDateString() === new Date(startDate).toLocaleDateString()
        : true;
      return matchesEmpCode && matchesDepartment && matchesPosition && matchesStartDate;
    });
    setFilteredEmployees(filtered);
    setNoData(filtered.length === 0);
  }, [searchTerm, selectedDepartment, selectedPosition, startDate, employees]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    if (sortConfig.key) {
      const sortedData = [...filteredEmployees].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sortedData;
    }
    return filteredEmployees;
  }, [filteredEmployees, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstRecord, indexOfLastRecord);

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
            name="Add Manage"
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
                          <th onClick={() => handleSort('empCode')}>
                            Employee Infomation {getSortIcon('empCode')}
                          </th>
                          <th onClick={() => handleSort('email')}>
                            Email {getSortIcon('email')}
                          </th>
                          <th onClick={() => handleSort('startDate')}>
                            Start Date {getSortIcon('startDate')}
                          </th>
                          <th onClick={() => handleSort('department')}>
                            Department {getSortIcon('department')}
                          </th>
                          <th onClick={() => handleSort('position')}>
                            Position {getSortIcon('position')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmployees.map(employee => (
                          <tr key={employee.id}>
                            <td>
                              <span className="table-avatar">
                                <Link to={`/client-profile/${employee.id}`} className="avatar">
                                  <img alt="" src={employee.avatar || "default-avatar.png"} />
                                </Link>
                                <Link to={`/client-profile/${employee.id}`}>
                                  {employee.empCode} - {employee.fullname}
                                </Link>
                              </span>
                            </td>
                            <td>{employee.email}</td>
                            <td>{new Date(employee.startDate).toLocaleDateString()}</td>
                            <td>{employee.department}</td>
                            <td>{employee.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
                      <nav>
                        <ul className="pagination" style={{ margin: 0 }}>
                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index + 1}
                              className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                              style={{ margin: '0 2px' }}
                            >
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className="page-link"
                                style={{
                                  backgroundColor: index + 1 === currentPage ? '#FF902F' : '#fff',
                                  borderColor: index + 1 === currentPage ? '#FF902F' : '#dee2e6',
                                  color: index + 1 === currentPage ? '#fff' : '#373B3E',
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

export default EmployeeList;
