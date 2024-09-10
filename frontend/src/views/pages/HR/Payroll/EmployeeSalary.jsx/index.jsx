import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import AddSalaryModal from "../../../../../components/modelpopup/AddSalaryModal";
import SalaryTable from "./SalaryTable";
import { base_url } from "../../../../../base_urls";

const EmployeeSalary = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [inputEmployeeName, setInputEmployeeName] = useState("");
  const [inputSalaryCode, setInputSalaryCode] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeNameFocused, setEmployeeNameFocused] = useState(false);
  const [salaryCodeFocused, setSalaryCodeFocused] = useState(false);
  
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year };
  });

  useEffect(() => {
    fetchSalaries();
    fetchDepartments();
  }, [inputEmployeeName, inputSalaryCode, selectedOption, selectedMonth, selectedYear]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const params = {
        employeeName: inputEmployeeName,
        salaryCode: inputSalaryCode,
        department: selectedOption ? selectedOption.value : '',
        month: selectedMonth ? selectedMonth.value : '',
        year: selectedYear ? selectedYear.value : ''
      };
      const response = await axios.get(`${base_url}/api/salaries`, {
        params,
        withCredentials: true
      });
      setSalaryData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${base_url}/api/departments`, { withCredentials: true });
      setDepartmentOptions(response.data.map(department => ({
        value: department.id,
        label: department.name,
      })));
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleEmployeeNameFocus = () => setEmployeeNameFocused(true);
  const handleEmployeeNameBlur = () => inputEmployeeName === "" && setEmployeeNameFocused(false);
  const handleSalaryCodeFocus = () => setSalaryCodeFocused(true);
  const handleSalaryCodeBlur = () => inputSalaryCode === "" && setSalaryCodeFocused(false);
  
  const handleEmployeeNameChange = (e) => setInputEmployeeName(e.target.value);
  const handleSalaryCodeChange = (e) => setInputSalaryCode(e.target.value);

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
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className={`input-block form-focus ${employeeNameFocused || inputEmployeeName ? 'focused' : ''}`}>
                <input
                  type="text"
                  className="form-control floating"
                  value={inputEmployeeName}
                  onFocus={handleEmployeeNameFocus}
                  onBlur={handleEmployeeNameBlur}
                  onChange={handleEmployeeNameChange}
                />
                <label className="focus-label" onClick={handleEmployeeNameFocus}>
                  Employee Name
                </label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className={`input-block form-focus ${salaryCodeFocused || inputSalaryCode ? 'focused' : ''}`}>
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
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select--"
                  onChange={setSelectedOption}
                  options={departmentOptions}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Department</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select Month--"
                  onChange={setSelectedMonth}
                  options={months}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Month</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select Year--"
                  onChange={setSelectedYear}
                  options={years}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Year</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <Link to="#" className="btn btn-success w-100">
                {" "}Payment{" "}
              </Link>
            </div>
          </div>

          <SalaryTable data={salaryData} loading={loading} />
        </div>
      </div>
      <AddSalaryModal />
    </>
  );
};

export default EmployeeSalary;
