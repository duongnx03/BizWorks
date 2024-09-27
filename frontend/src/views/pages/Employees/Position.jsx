import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Button, message, Modal, Select } from "antd";
import axios from "axios";
import Breadcrumbs from "../../../components/Breadcrumbs";
import PositionModal from "../../../components/modelpopup/PositionModal";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { base_url } from "../../../base_urls";

const Position = () => {
    const { departmentId } = useParams();
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [positionModalOpen, setPositionModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState(null);
    const [assignEmployeeModalOpen, setAssignEmployeeModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchPositions();
        fetchEmployees();
    }, [departmentId]);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${base_url}/api/positions/by-department`, {
                params: { departmentId },
                withCredentials: true,
            });
            setPositions(response.data);
        } catch (error) {
            message.error("Failed to fetch positions.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${base_url}/api/employee/getAllEmployees`, { withCredentials: true });
        if (response.data.status === "SUCCESS" && Array.isArray(response.data.data)) {
          setEmployees(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          message.error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        message.error("Failed to fetch employees");
      } finally {
      }
    };
    const handlePositionCreated = () => {
        fetchPositions();
        setPositionModalOpen(false);
        setSelectedPosition(null);
    };

    const openDeleteModal = (id) => {
        setPositionToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${base_url}/api/positions/${positionToDelete}`, { withCredentials: true });
            setPositions(positions.filter(position => position.id !== positionToDelete));
            handleDeleteModalClose();
        } catch (error) {
            message.error("Failed to delete position.");
        } finally {
            handleDeleteModalClose();
        }
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setPositionToDelete(null);
    };

    const openAssignEmployeeModal = (position) => {
        setSelectedPosition(position);
        setAssignEmployeeModalOpen(true);
    };

    const handleAssignEmployee = async () => {
        try {
            await axios.post(`${base_url}/api/positions/${selectedPosition.id}/assign-employee/${selectedEmployee}`, null, { withCredentials: true });
            message.success("Employee assigned to position successfully");
            fetchPositions();
            setAssignEmployeeModalOpen(false);
        } catch (error) {
            message.error("Failed to assign employee.");
        }
    };

    const handleAssignEmployeeModalClose = () => {
        setAssignEmployeeModalOpen(false);
        setSelectedEmployee(null);
    };

    const positionElements = Array.isArray(positions) ? positions.map((position) => ({
      key: position.id,
      id: position.id,
      positionName: position.positionName,
      basicSalary: position.basicSalary,
      employeeNames: position.employees ? position.employees.map(employee => employee.fullname).join(', ') : 'None',
  })) : [];
  
  const columns = [
    {
        title: "ID",
        dataIndex: "id",
        sorter: (a, b) => a.id - b.id,
        width: "10%",
    },
    {
        title: "Position Name",
        dataIndex: "positionName",
        sorter: (a, b) => a.positionName.localeCompare(b.positionName),
        width: "50%",
    },
    {
        title: "Basic Salary",
        dataIndex: "basicSalary",
        render: (text) => <span>${text.toFixed(2)}</span>,
        sorter: (a, b) => a.basicSalary.localeCompare(b.positionName),
        width: "50%",
    },
    {
        title: "Employee Names",
        dataIndex: "employeeNames",
        sorter: (a, b) => a.employeeNames.localeCompare(b.employeeNames),
        width: "20%",
    },
    {
        title: "Actions",
        className: "text-end",
        render: (text, record) => (
            <div className="dropdown dropdown-action text-end">
                <Link
                    to="#"
                    className="action-icon dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="material-icons">more_vert</i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                    <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => {
                            setSelectedPosition(record);
                            setPositionModalOpen(true);
                        }}
                    >
                        <i className="fa fa-pencil m-r-5" /> Edit
                    </Link>
                    <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => openDeleteModal(record.id)}
                    >
                        <i className="fa fa-trash m-r-5" /> Delete
                    </Link>
                    <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => openAssignEmployeeModal(record)}
                    >
                        <i className="fa fa-user m-r-5" /> Assign Employee
                    </Link>
                </div>
            </div>
        ),
        width: "20%",
    },
];
    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="row mb-3">
                        <div className="col-md-12 text-end">
                            <Button
                                type="primary"
                                onClick={() => {
                                    setSelectedPosition(null);
                                    setPositionModalOpen(true);
                                }}
                            >
                                Add Position
                            </Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={positionElements}
                                    loading={loading}
                                    className="table-striped"
                                    rowKey="id"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PositionModal 
    visible={positionModalOpen} 
    onPositionCreated={handlePositionCreated} 
    onClose={() => setPositionModalOpen(false)} 
    position={selectedPosition} 
    departmentId={departmentId} // Make sure this is a valid department ID
/>

            {deleteModalOpen && (
                <DeleteModal
                    id={positionToDelete}
                    Name="Delete Position"
                    onDelete={handleDelete}
                    onClose={handleDeleteModalClose}
                />
            )}

            <Modal
                title="Assign Employee"
                visible={assignEmployeeModalOpen}
                onOk={handleAssignEmployee}
                onCancel={handleAssignEmployeeModalClose}
            >
                <Select
                    placeholder="Select an employee"
                    style={{ width: '100%' }}
                    onChange={setSelectedEmployee}
                >
                    {employees.map(employee => (
                        <Select.Option key={employee.id} value={employee.id}>
                            {employee.name}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        </>
    );
};

export default Position;
