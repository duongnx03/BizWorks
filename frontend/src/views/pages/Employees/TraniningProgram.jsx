import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, message, Button } from "antd";
import axios from "axios";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../components/SearchBox";
import TrainingProgramModal from "../../../components/modelpopup/TrainingProgramModal";
import { base_url } from "../../../base_urls";

const TrainingProgram = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainingProgramToDelete, setTrainingProgramToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();  // Add this line

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      const response = await axios.get(`${base_url}/api/training-programs`);
      console.log("API response:", response.data); // Log response data
      if (Array.isArray(response.data)) {
        setTrainingPrograms(response.data); // Adjusted for array response
      } else {
        setTrainingPrograms([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training programs:", error); // Log error
      message.error("Failed to fetch training programs");
      setTrainingPrograms([]);
      setLoading(false);
    }
  };

  const handleTrainingProgramCreated = () => {
    fetchTrainingPrograms(); // Refresh training program list after creation
    setModalVisible(false); // Close the modal after creation
  };

  const openDeleteModal = (id) => {
    setTrainingProgramToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setTrainingProgramToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (trainingProgramToDelete) {
        await axios.delete(`${base_url}/api/training-programs/${trainingProgramToDelete}`);
        fetchTrainingPrograms(); // Refresh training program list after deletion
        handleDeleteModalClose(); // Close modal
        message.success("Training program deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting training program:", error); // Log error
      message.error("Failed to delete training program");
    }
  };

  const openTrainingProgramModal = () => {
    setModalVisible(true);
  };

  const trainingProgramElements = trainingPrograms.map((program) => ({
    key: program.id,
    id: program.id,
    programName: program.programName,
    departmentName: program.departmentName,
    trainerName: program.trainerName,
    startDate: new Date(program.startDate).toLocaleDateString(),
    endDate: new Date(program.endDate).toLocaleDateString(),
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Program Name",
      dataIndex: "programName",
      sorter: (a, b) => a.programName.localeCompare(b.programName),
      width: "25%",
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
      width: "25%",
    },
    {
      title: "Trainer Name",
      dataIndex: "trainerName",
      sorter: (a, b) => a.trainerName.localeCompare(b.trainerName),
      width: "20%",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      width: "10%",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      width: "10%",
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
              onClick={() => openDeleteModal(record.id)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
            <Link
              className="dropdown-item"
              to={`/training-programs/${record.id}`}
            >
              <i className="fa fa-eye m-r-5" /> View Details
            </Link>
            <Link
              className="dropdown-item"
              to={`/attendance/${record.id}`} // Updated path
            >
              <i className="fa fa-calendar-check m-r-5" /> Attendance
            </Link>
          </div>
        </div>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <div className="d-flex justify-content-end mb-3">
                  <Button
                    onClick={openTrainingProgramModal}
                    type="primary"
                  >
                    Add Training Program
                  </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={trainingProgramElements}
                  loading={loading}
                  className="table-striped"
                  rowKey="id" // Adjusted to rowKey as string
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrainingProgramModal
        isVisible={modalVisible}
        onTrainingProgramCreated={handleTrainingProgramCreated}
        onCancel={() => setModalVisible(false)}
      />
      {deleteModalOpen && (
        <DeleteModal
          id={trainingProgramToDelete}
          Name="Delete Training Program"
          onDelete={handleDelete}
          onClose={handleDeleteModalClose}
        />
      )}
    </>
  );
};

export default TrainingProgram;
