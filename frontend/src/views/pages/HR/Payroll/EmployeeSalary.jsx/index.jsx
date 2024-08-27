import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import "react-datepicker/dist/react-datepicker.css";
import AddSalaryModal from "../../../../../components/modelpopup/AddSalaryModal";
import SalaryTable from "./SalaryTable";
import { base_url } from "../../../../../base_urls";

const EmployeeSalary = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTwo, setSelectedDateTwo] = useState(null);
  const [dateTwo, setDateTwo] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/salaries`, { withCredentials: true });
      console.log('Fetched data:', response.data); // Kiểm tra dữ liệu nhận được
  
      if (Array.isArray(response.data.data)) {
        setSalaryData(response.data.data);
      } else {
        console.error('Data is not an array:', response.data.data);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
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
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocusTwo = () => {
    setDateTwo(true);
  };

  const handleBlurTwo = () => {
    setDateTwo(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDateChangeTwo = (date) => {
    setSelectedDateTwo(date);
  };

  const options = [
    { value: "--Select--", label: "--Select--" },
    { value: "A01", label: "A01" },
    { value: "A02", label: "A02" },
  ];

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
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
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
                  Salary Code
                </label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="--Select--"
                  onChange={setSelectedOption}
                  options={options}
                  className="select floating"
                  styles={customStyles}
                />
                <label className="focus-label">Department</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div
                className={`input-block mb-3 form-focus ${
                  isFocused ? "focused" : ""
                }`}
              >
                <div className="cal-icon focused">
                  <DatePicker
                    className="form-control floating datetimepicker"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
                <label className="focus-label">From</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <div
                className={`input-block mb-3 form-focus ${
                  dateTwo ? "focused" : ""
                }`}
              >
                <div className="cal-icon">
                  <DatePicker
                    className="form-control floating datetimepicker"
                    selected={selectedDateTwo}
                    onChange={handleDateChangeTwo}
                    onFocus={handleFocusTwo}
                    onBlur={handleBlurTwo}
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
                <label className="focus-label">To</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
              <Link to="#" className="btn btn-success w-100">
                {" "}
                Payment{" "}
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
