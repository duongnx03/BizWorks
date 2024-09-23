import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "antd";
import { base_url } from "../../../../../base_urls";
import { useNavigate } from "react-router-dom";

const SalaryUser = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleGenerateSlip = (salary) => {
    setSelectedSalary(salary);
    navigate("/salary-view", { state: { salary } });
  };

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/salaries/user`, {
        withCredentials: true,
      });
      const data = response.data.data || [];
      setSalaryData(data);
    } catch (error) {
      console.error("Error fetching user salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Salary Code",
      dataIndex: "salaryCode",
      sorter: (a, b) => a.salaryCode.localeCompare(b.salaryCode),
    },
    {
      title: "Month",
      dataIndex: "month",
      sorter: (a, b) => a.month - b.month,
      render: (month) =>
        new Date(0, month - 1).toLocaleString("default", { month: "long" }),
    },
    {
      title: "Year",
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Net Salary",
      dataIndex: "totalSalary",
      render: (text) => <span>${text.toFixed(2)}</span>,
      sorter: (a, b) => a.totalSalary - b.totalSalary,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span>
          <i
            className={
              text === "Pending"
                ? "far fa-dot-circle text-primary"
                : text === "Approved"
                ? "far fa-dot-circle text-info"
                : text === "Paid"
                ? "far fa-dot-circle text-success"
                : "far fa-dot-circle text-danger"
            }
          />{" "}
          {text}
        </span>
      ),
    },
    {
        title: "Details",
        render: (record) => (
          <Button
            className="btn btn-sm btn-primary"
            onClick={() => handleGenerateSlip(record)}
          >
            View
          </Button>
        ),
      },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="salary-user">
          <h2>Your Salary Records</h2>
          <h5>Dashboard / My Salaries </h5>
          <br />
          <Table
            columns={columns}
            dataSource={salaryData}
            loading={loading}
            rowKey="id"
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryUser;
