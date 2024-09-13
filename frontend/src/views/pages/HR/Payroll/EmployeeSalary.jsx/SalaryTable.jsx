// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Table, Button, Input } from "antd";
// import EditSalaryModal from "../../../../../components/modelpopup/EditSalaryModal";
// import DeleteModal from "../../../../../components/modelpopup/deletePopup";

// const SalaryTable = ({ data, loading }) => {
//   const [selectedSalary, setSelectedSalary] = useState(null);
//   const [totalSalary, setTotalSalary] = useState(0);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [showCheckbox, setShowCheckbox] = useState(false);
//   const [filteredData, setFilteredData] = useState(data);
//   const [searchValue, setSearchValue] = useState('');
//   const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     const calculateTotalSalary = () => {
//       const total = filteredData.reduce((acc, item) => acc + item.totalSalary, 0);
//       setTotalSalary(total);
//     };

//     calculateTotalSalary();
//   }, [filteredData]);

//   useEffect(() => {
//     setFilteredData(data);
//   }, [data]);

//   const handleGenerateSlip = (salary) => {
//     setSelectedSalary(salary);
//     navigate("/salary-view", { state: { salary } });
//   };

//   const handleSelectChange = (selectedRowKeys) => {
//     setSelectedRowKeys(selectedRowKeys);
//   };

//   const handlePaymentRequest = () => {
//     setShowCheckbox(!showCheckbox);
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchValue(value);

//     const filtered = data.filter(item => {
//       const employee = item.employees[0] || {};
//       return (
//         (employee.fullname && employee.fullname.toLowerCase().includes(value)) ||
//         (item.salaryCode && item.salaryCode.toLowerCase().includes(value))
//       );
//     });

//     setFilteredData(filtered);
//   };

//   const handleStatusChange = (id, newStatus) => {
//     // Implement status change logic here
//     console.log(`Changing status of ${id} to ${newStatus}`);
//   };

//   const columns = [
//     {
//       title: "Employee Name",
//       dataIndex: "employees",
//       render: (employees) => (
//         employees.length > 0 ? (
//           <div className="table-avatar">
//             <Link to="/profile" className="avatar">
//               <img alt="" src={employees[0].avatar} />
//             </Link>
//             <Link to="/profile">
//               {employees[0].fullname} - {employees[0].empCode}
//             </Link>
//           </div>
//         ) : "No Employee"
//       ),
//       sorter: (a, b) => a.employees[0]?.fullname.localeCompare(b.employees[0]?.fullname),
//     },
//     {
//       title: "Email",
//       dataIndex: "employees",
//       render: (employees) => {
//         if (employees.length > 0) {
//           const emailPrefix = employees[0].email.split('@')[0];
//           return emailPrefix.length > 10 ? `${emailPrefix.slice(0, 10)}...` : emailPrefix;
//         }
//         return "No Email";
//       },
//       sorter: (a, b) => a.employees[0]?.email.split('@')[0].localeCompare(b.employees[0]?.email.split('@')[0]),
//     },
//     {
//       title: "Department",
//       dataIndex: "employees",
//       render: (employees) => employees.length > 0 ? employees[0].departmentName : "No Department",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (text, record) => (
//         <>
//           {userRole === "MANAGE" || userRole === "ADMIN" ? (
//             <div className="dropdown action-label">
//               <Button
//                 className="btn btn-white btn-sm btn-rounded dropdown-toggle"
//                 type="button"
//                 id={`dropdownMenuButton-${record.id}`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <i
//                   className={
//                     text === "Pending"
//                       ? "far fa-dot-circle text-primary"
//                       : text === "Approved"
//                       ? "far fa-dot-circle text-info"
//                       : text === "Paid"
//                       ? "far fa-dot-circle text-success"
//                       : "far fa-dot-circle text-danger"
//                   }
//                 />{" "}
//                 {text}
//               </Button>
//               <ul
//                 className="dropdown-menu"
//                 aria-labelledby={`dropdownMenuButton-${record.id}`}
//               >
//                 <li>
//                   <button
//                     className="dropdown-item"
//                     onClick={() => handleStatusChange(record.id, "Approved")}
//                   >
//                     <i className="far fa-dot-circle text-info" /> Approved
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className="dropdown-item"
//                     onClick={() => handleStatusChange(record.id, "Rejected")}
//                   >
//                     <i className="far fa-dot-circle text-danger" /> Rejected
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className="dropdown-item"
//                     onClick={() => handleStatusChange(record.id, "Rejected")}
//                   >
//                     <i className="far fa-dot-circle text-success" /> Paid
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           ) : (
//             <span>
//               <i
//                 className={
//                   text === "Pending"
//                       ? "far fa-dot-circle text-primary"
//                       : text === "Approved"
//                       ? "far fa-dot-circle text-info"
//                       : text === "Paid"
//                       ? "far fa-dot-circle text-success"
//                       : "far fa-dot-circle text-danger"
//                 }
//               />{" "}
//               {text}
//             </span>
//           )}
//         </>
//       ),
//       sorter: (a, b) => a.status.length - b.status.length,
//     },
//     {
//       title: "Month",
//       dataIndex: "month",
//       render: (month) => `${month}`,
//       sorter: (a, b) => a.month - b.month,
//     },
//     // {
//     //   title: "Year",
//     //   dataIndex: "year",
//     //   render: (year) => `${year}`,
//     //   sorter: (a, b) => a.year - b.year,
//     // },
//     // {
//     //   title: "Salary Date",
//     //   dataIndex: "dateSalary",
//     //   render: (dateSalary) => dateSalary ? new Date(dateSalary).toLocaleDateString() : "Unknown",
//     //   sorter: (a, b) => new Date(a.dateSalary) - new Date(b.dateSalary),
//     // },
//     {
//       title: "Net Salary",
//       dataIndex: "totalSalary",
//       render: (text) => <span>${text.toFixed(2)}</span>,
//       sorter: (a, b) => a.totalSalary - b.totalSalary,
//     },
//     {
//       title: "Action",
//       render: (text, record) => (
//         <div className="dropdown dropdown-action text-end">
//           <Link
//             to="#"
//             className="action-icon dropdown-toggle"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             <i className="material-icons">more_vert</i>
//           </Link>
//           <div className="dropdown-menu dropdown-menu-right">
//             <Link
//               className="dropdown-item"
//               to="#"
//               data-bs-toggle="modal"
//               data-bs-target="#edit_salary"
//             >
//               <i className="fa fa-pencil m-r-5" /> Edit
//             </Link>
//             <Link
//               className="dropdown-item"
//               to="#"
//               data-bs-toggle="modal"
//               data-bs-target="#delete"
//             >
//               <i className="fa fa-trash m-r-5" /> Delete
//             </Link>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Details",
//       render: (record) => (
//         <Button
//           className="btn btn-sm btn-primary"
//           onClick={() => handleGenerateSlip(record)}
//         >
//           View
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="row">
//         <div className="col-md-12">
//           <div className="table-responsive">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <Input 
//                 placeholder="Search..."
//                 value={searchValue}
//                 onChange={handleSearch}
//                 style={{ width: 200 }}
//               />
//               <Button 
//                 type="primary" 
//                 onClick={handlePaymentRequest}
//               >
//                 {showCheckbox ? "Hide" : "Request Payment"}
//               </Button>
//               <div className="-flex justify-codntent-end">
//                 <h5>Total Salary to be Paid: <span className="text-success">${totalSalary.toFixed(2)}</span></h5>
//               </div>
//             </div>
//             <Table
//               className="table-striped"
//               style={{ overflowX: "auto" }}
//               columns={columns}
//               dataSource={filteredData}
//               rowKey={(record) => record.id}
//               loading={loading}
//               rowSelection={showCheckbox ? {
//                 selectedRowKeys,
//                 onChange: handleSelectChange,
//               } : null}
//             />
//           </div>
//         </div>
//       </div>

//       <EditSalaryModal />
//       <DeleteModal Name="Delete Salary" />
//     </>
//   );
// };

// export default SalaryTable;
