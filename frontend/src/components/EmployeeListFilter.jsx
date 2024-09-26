import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa";

const EmployeeListFilter = ({
  handleSearchInputChange,
  setSelectedDepartment,
  setSelectedPosition,
  setStartDate,
}) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartmentState] = useState(null);
  const [selectedPosition, setSelectedPositionState] = useState(null);
  const [startDate, setStartDateState] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/departments",
          {
            withCredentials: true,
          }
        );

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

  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

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
    handleSearchInputChange(e);
  };

  const handleClearFilters = () => {
    setSelectedDepartmentState(null);
    setSelectedPositionState(null);
    setStartDateState(null);
    setInputValue("");
    setSelectedDepartment(null);
    setSelectedPosition(null);
    setStartDate(null);
    handleSearchInputChange({ target: { value: "" } });
  };

  return (
    <div className="row filter-row">
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
            Employee Code
          </label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus select-focus">
          <Select
            options={departments}
            value={selectedDepartment}
            onChange={(selected) => {
              setSelectedDepartmentState(selected);
              setSelectedDepartment(selected);

              setSelectedPositionState(null);
              setSelectedPosition(null);
            }}
            placeholder="Select"
            styles={customStyles}
          />
          <label className="focus-label">Department</label>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus select-focus">
          <Select
            options={
              selectedDepartment
                ? departments.find(
                    (dept) => dept.value === selectedDepartment.value
                  )?.positions
                : []
            }
            value={selectedPosition}
            onChange={(selected) => {
              setSelectedPositionState(selected);
              setSelectedPosition(selected);
            }}
            placeholder="Select"
            styles={customStyles}
          />
          <label className="focus-label">Position</label>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus select-focus">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDateState(date);
              setStartDate(date);
            }}
            placeholderText="Select date"
            className="form-control floating"
            dateFormat="MM/dd/yyyy"
          />
          <label className="focus-label">Start Date</label>
        </div>
      </div>

      {/* Clear button aligned to the right */}
      <div
        className="col-sm-12"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {inputValue || selectedDepartment || selectedPosition || startDate ? (
          <button
            type="button"
            className="btn btn-clear"
            onClick={handleClearFilters}
            title="Clear Filters"
            style={{
              border: "none",
              background: "none",
              color: "#FF902F",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginLeft: "auto", // Align to the right
            }}
          >
            <FaTimes />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeListFilter;
