import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa";

const AttendanceEmployeeFilter = ({ onDateRangeChange }) => {
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
    onDateRangeChange(date, selectedToDate);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    onDateRangeChange(selectedFromDate, date);
  };

  return (
    <div className="row filter-row">
      <div className="col-sm-3">
        <div className="input-block form-focus select-focus">
          <div className="cal-icon">
            <DatePicker
              selected={selectedFromDate}
              onChange={handleFromDateChange}
              type="date"
              className="form-control floating datetimepicker"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <label className="focus-label">From</label>
        </div>
      </div>
      <div className="col-sm-3">
        <div className="input-block form-focus select-focus">
          <div className="cal-icon">
            <DatePicker
              selected={selectedToDate}
              onChange={handleToDateChange}
              type="date"
              className="form-control floating datetimepicker"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <label className="focus-label">To</label>
        </div>
      </div>
      <div className="col-sm-6" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-clear"
          title="Clear Filters"
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
          onClick={() => {
            setSelectedFromDate(null);
            setSelectedToDate(null);
            onDateRangeChange(null, null);
          }}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default AttendanceEmployeeFilter;
