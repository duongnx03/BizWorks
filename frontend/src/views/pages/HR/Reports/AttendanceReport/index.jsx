import React, { useState, useEffect, useRef } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import Select from "react-select";
import AttendanceReportTable from "./AttendanceReportTable";
import { DatePicker } from "antd";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const ITEMS_PER_PAGE = 9;

const AttendanceReport = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltered, setIsFiltered] = useState(false);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/departments", {
          withCredentials: true,
        });

        const departmentOptions = response.data.map((dept) => ({
          value: dept.id,
          label: dept.departmentName,
          positions: dept.positions.map((pos) => ({
            value: pos.id,
            label: pos.positionName,
          })),
        }));

        setDepartments(departmentOptions);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/attendance/getAll", { withCredentials: true });
        const sortedData = response.data.data.sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate));
        setData(sortedData);
        setFilteredData(sortedData);
        setTotalPages(Math.ceil(sortedData.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const hasFilters = inputValue || selectedDepartment || selectedPosition || fromDate || toDate;
    setIsFiltered(hasFilters);

    let result = data;

    if (inputValue) {
      result = result.filter(record =>
        record.employee.fullname.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    if (selectedDepartment) {
      result = result.filter(record =>
        record.employee.department === selectedDepartment.label
      );
    }

    if (selectedPosition) {
      result = result.filter(record =>
        record.employee.position === selectedPosition.label
      );
    }

    if (fromDate && toDate) {
      result = result.filter(record => {
        const recordDate = new Date(record.attendanceDate);
        return recordDate >= new Date(fromDate) && recordDate <= new Date(toDate).setHours(23, 59, 59, 999);
      });
    }

    setFilteredData(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
  }, [inputValue, selectedDepartment, selectedPosition, fromDate, toDate, data]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [inputValue, selectedDepartment, selectedPosition, fromDate, toDate]);

  const handleClearFilters = () => {
    setInputValue("");
    setSelectedDepartment(null);
    setSelectedPosition(null);
    setFromDate(null);
    setToDate(null);

    if (fromDateRef.current) {
      fromDateRef.current.blur();
    }
    if (toDateRef.current) {
      toDateRef.current.blur();
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the data for the current page
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Attendance Reports"
          title="Dashboard"
          subtitle="Attendance Reports"
        />

        <div className="row filter-row space">
          <div className="col-sm-6 col-md-3">
            <div className={focused || inputValue !== "" ? "input-block form-focus focused" : "input-block form-focus"}>
              <input
                type="text"
                className="form-control floating"
                value={inputValue}
                onFocus={() => setFocused(true)}
                onBlur={() => { if (inputValue === "") setFocused(false); }}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <label className="focus-label" onClick={() => setFocused(true)}>
                Employee Name
              </label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                placeholder="Select Department"
                value={selectedDepartment}
                onChange={(dept) => {
                  setSelectedDepartment(dept);
                  setSelectedPosition(null);
                }}
                options={departments}
                className="select floating"
                styles={customStyles}
              />
              <label className="focus-label">Department</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                placeholder="Select Position"
                value={selectedPosition}
                onChange={setSelectedPosition}
                options={selectedDepartment ? selectedDepartment.positions : []}
                className="select floating"
                styles={customStyles}
              />
              <label className="focus-label">Position</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <DatePicker
                placeholder="From Date"
                className="form-control floating"
                value={fromDate ? fromDate : null}
                onChange={handleFromDateChange}
                ref={fromDateRef}
                format="YYYY-MM-DD"
              />
              <label className="focus-label">From</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <DatePicker
                placeholder="To Date"
                className="form-control floating"
                value={toDate ? toDate : null}
                onChange={handleToDateChange}
                ref={toDateRef}
                format="YYYY-MM-DD"
              />
              <label className="focus-label">To</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-9 d-flex align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-clear"
              title="Clear Filters"
              onClick={handleClearFilters}
              style={{
                border: 'none',
                background: 'none',
                color: '#FF902F',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginLeft: 'auto',
              }}
            >
              <FaTimes /> 
            </button>
          </div>
        </div>

        {/* Render table only if filters are applied */}
        {isFiltered ? (
          paginatedData.length ? (
            <>
              <AttendanceReportTable data={paginatedData} />
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
          ) : (
            <p className="alert alert-warning">No data available for the selected filters.</p>
          )
        ) : (
          <p className="alert alert-info">Please apply filters to view the data.</p>
        )}
      </div>
    </div>
  );
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

export default AttendanceReport;
