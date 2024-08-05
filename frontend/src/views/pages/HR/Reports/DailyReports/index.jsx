import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import DailyReportTable from "./DailyReportTable";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const DailyReports = () => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [summary, setSummary] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartmentState] = useState(null);
  const [selectedPosition, setSelectedPositionState] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/attendance/summary', {
      withCredentials: true,
    })
      .then(response => {
        if (response.data.data) {
          setSummary(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetch summary api: ", error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/attendance/getByDate', { withCredentials: true })
      .then(response => {
        if (response.data.data) {
          setData(response.data.data);
          setFilteredData(response.data.data); // Initialize filteredData
        }
      })
      .catch(error => {
        console.error("Error fetch attendance by date: ", error);
      });
  }, []);

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

  const handleLabelClick = () => {
    setFocused(true);
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    filterData(value, selectedDepartment, selectedPosition);
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };

  const handleDepartmentChange = (selected) => {
    setSelectedDepartmentState(selected);
    filterData(inputValue, selected, selectedPosition);
  };

  const handlePositionChange = (selected) => {
    setSelectedPositionState(selected);
    filterData(inputValue, selectedDepartment, selected);
  };

  const filterData = (name, department, position) => {
    const filtered = data.filter(item => {
      const matchesName = item.employee.fullname.toLowerCase().includes(name.toLowerCase());
      const matchesDepartment = department ? item.employee.department === department.label : true;
      const matchesPosition = position ? item.employee.position === position.label : true;
      return matchesName && matchesDepartment && matchesPosition;
    });
    setFilteredData(filtered);
    setNoData(filtered.length === 0);
  };

  const handleClearFilters = () => {
    setInputValue("");
    setSelectedDepartmentState(null);
    setSelectedPositionState(null);
    setFilteredData(data);
    setNoData(false);
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

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Daily Report"
          title="Dashboard"
          subtitle="Daily Report"
        />

        <div className="row justify-content-center">
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body text-center">
                <h3>{summary.totalEmployees}</h3>
                <p>Total Employees</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-success">
                  <b>{summary.checkedInEmployees}</b>
                </h3>
                <p>Today Present</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-danger">
                  <b>{summary.absentEmployees}</b>
                </h3>
                <p>Today Absent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row filter-row space">
          <div className="col-sm-6 col-md-3">
            <div
              className={
                focused || inputValue !== ""
                  ? "input-block form-focus focused"
                  : "input-block form-focus"
              }
            >
              <input
                type="text"
                className="form-control floating"
                value={inputValue}
                onFocus={handleLabelClick}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
              <label className="focus-label" onClick={handleLabelClick}>
                Employee Name
              </label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                options={departments}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                placeholder="Select"
                styles={customStyles}
              />
              <label className="focus-label">Department</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                options={selectedDepartment ? departments.find(dept => dept.value === selectedDepartment.value)?.positions : []}
                value={selectedPosition}
                onChange={handlePositionChange}
                placeholder="Select"
                styles={customStyles}
              />
              <label className="focus-label">Position</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                marginLeft: 'auto', // Align to the right
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {noData ? (<div className="alert alert-warning">No data found</div>) : (<DailyReportTable data={filteredData} />)}
      </div>
    </div>
  );
};

export default DailyReports;
