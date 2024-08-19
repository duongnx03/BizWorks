import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const getHours = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};

const calculateWorkTime = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return "00:00";

  const checkInDate = new Date(checkInTime);
  const checkOutDate = new Date(checkOutTime);
  const diffInMilliseconds = checkOutDate - checkInDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return `${hours}.${minutes < 10 ? '0' : ''}${minutes} hrs`;
};

const getCurrentWorkTime = (checkInTime) => {
  if (!checkInTime) return "00:00";

  const checkInDate = new Date(checkInTime);
  const now = new Date();
  const diffInMilliseconds = now - checkInDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return `${hours}.${minutes < 10 ? '0' : ''}${minutes} hrs`;
};

const updateTodayActivity = async (setAttendance, setTodayActivity) => {
  try {
    const response = await axios.get('http://localhost:8080/api/attendance/getByEmailAndDate', { withCredentials: true });
    if (response.data.data) {
      const data = response.data.data;
      setAttendance(data);
      setTodayActivity({
        checkInTime: data?.checkInTime ? new Date(data.checkInTime).toLocaleString() : "",
        checkOutTime: data?.checkOutTime ? new Date(data.checkOutTime).toLocaleString() : "",
        workTime: data?.checkInTime && data?.checkOutTime
          ? calculateWorkTime(data.checkInTime, data.checkOutTime)
          : "00:00"
      });
    }
  } catch (error) {
    console.error("Error fetching attendance data: ", error);
  }
};

const AttendanceEmployee = () => {
  const [attendance, setAttendance] = useState([]);
  const [systemTime, setSystemTime] = useState(new Date());
  const [totalWorkTime, setTotalWorkTime] = useState({
    totalWorkTimeInWeek: 0,
    totalWorkTimeInMonth: 0,
    totalOvertimeInMonth: 0
  });
  const [todayActivity, setTodayActivity] = useState({
    checkInTime: "",
    checkOutTime: "",
    workTime: "00:00",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSystemTime(new Date()); // Directly update the state with the current time
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval when component unmounts
  }, []);

  useEffect(() => {
    updateTodayActivity(setAttendance, setTodayActivity);
  }, []);

  useEffect(() => {
    const fetchTotalWorkTime = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/attendance/totalWorkAndOvertime', { withCredentials: true });
        if (response.data.data) {
          setTotalWorkTime(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching total work time: ", error);
      }
    };
    fetchTotalWorkTime();
  }, []);

  const handleCheckIn = async () => {
    const now = new Date();
    const checkInTime = new Date();
    checkInTime.setHours(7, 58, 0); // 7h58 sáng

    setLoading(true);

    if (now < checkInTime) {
      alert("You cannot check in before 7:58 AM.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/attendance/checkIn', {}, { withCredentials: true });
      await updateTodayActivity(setTodayActivity);
    } catch (error) {
      console.error("Error during check-in: ", error);
    } finally {
      setLoading(false);
    }
  };


  const handleCheckOut = async () => {
    const now = new Date();
    const checkOutTime = new Date();
    checkOutTime.setHours(16, 58, 0); // 4h58 chiều

    setLoading(true);

    if (now < checkOutTime) {
      alert("You cannot check out before 4:58 PM.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/attendance/checkOut', {}, { withCredentials: true });
      await updateTodayActivity(setTodayActivity);
    } catch (error) {
      console.error("Error during check-out: ", error);
    } finally {
      setLoading(false);
    }
  };


  const isCheckOutAvailable = () => {
    const checkOutStartTime = new Date(systemTime);
    checkOutStartTime.setHours(16, 58, 0); // 4h58 chiều

    return attendance && attendance.checkInTime && systemTime >= checkOutStartTime;
  };

  const calculateWorkTimeDisplay = () => {
    if (todayActivity.checkInTime) {
      return todayActivity.checkOutTime
        ? calculateWorkTime(todayActivity.checkInTime, todayActivity.checkOutTime)
        : getCurrentWorkTime(todayActivity.checkInTime);
    }
    return "00:00";
  };

  return (  
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs maintitle="Attendance" title="Dashboard" subtitle="Attendance" />

        <div className="row">
          <div className="col-md-4">
            <div className="card punch-status">
              <div className="card-body">
                <h5 className="card-title">
                  Timesheet <small className="text-muted"> {systemTime.toLocaleString()}</small>
                </h5>
                <div className="punch-info">
                  <div className="punch-hours">
                    <span>{calculateWorkTimeDisplay()}</span>
                  </div>
                </div>
                <div className="punch-btn-section">
                  {todayActivity.checkInTime && !todayActivity.checkOutTime ? (
                    <button
                      type="button"
                      className={`btn ${isCheckOutAvailable() ? 'btn-primary' : 'btn-secondary'} punch-btn`}
                      onClick={handleCheckOut}
                      disabled={!isCheckOutAvailable()}
                    >
                      {loading ? <ClipLoader size={24} color={"#fff"} /> : "Check Out"}
                    </button>
                  ) : todayActivity.checkOutTime ? (
                    <button
                      type="button"
                      className="btn btn-success punch-btn"
                      disabled
                    >
                      Has Checked
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary punch-btn"
                      onClick={handleCheckIn}
                    >
                      {loading ? <ClipLoader size={24} color={"#fff"} /> : "Check In"}
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card att-statistics">
              <div className="card-body">
                <h5 className="card-title">Statistics</h5>
                <div className="stats-list">
                  <div className="stats-info">
                    <p>
                      This Week
                      <strong>
                        {totalWorkTime?.totalWorkTimeInWeek || 0} <small>/ 40 hrs</small>
                      </strong>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${(getHours(totalWorkTime?.totalWorkTimeInWeek || '0:00') / 40) * 100}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  <div className="stats-info">
                    <p>
                      This Month
                      <strong>
                        {totalWorkTime?.totalWorkTimeInMonth || 0} <small>/ 160 hrs</small>
                      </strong>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${(getHours(totalWorkTime?.totalWorkTimeInMonth || '0:00') / 160) * 100}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  <div className="stats-info">
                    <p>
                      Overtime in Month
                      <strong>
                        {totalWorkTime?.totalOvertimeInMonth || 0} <small>/ 8 hrs</small>
                      </strong>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${(getHours(totalWorkTime?.totalOvertimeInMonth || '0:00') / 8) * 100}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card recent-activity">
              <div className="card-body">
                <h5 className="card-title">Today Activity</h5>
                <ul className="res-activity-list">
                  {todayActivity.checkInTime &&
                    <li>
                      <p className="mb-0">Check In at</p>
                      <p className="res-activity-time">
                        <i className="fa-regular fa-clock"></i> {todayActivity.checkInTime}
                      </p>
                    </li>
                  }
                  {todayActivity.checkOutTime &&
                    <li>
                      <p className="mb-0">Check Out at</p>
                      <p className="res-activity-time">
                        <i className="fa-regular fa-clock"></i> {todayActivity.checkOutTime}
                      </p>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceEmployee;
