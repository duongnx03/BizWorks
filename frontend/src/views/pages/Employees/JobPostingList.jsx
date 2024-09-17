import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../components/SearchBox";
import JobPostingModal from "../../../components/modelpopup/JobPostingModal"; // Updated import
import { base_url } from "../../../base_urls";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobPostingToDelete, setJobPostingToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [jobPostingToUpdate, setJobPostingToUpdate] = useState(null); // State for the job posting to update

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await axios.get(`${base_url}/api/job-postings/list`, { withCredentials: true });
      if (response.data?.data) {
        setJobPostings(response.data.data);
      } else {
        setJobPostings([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job postings:", error);
      message.error("Failed to fetch job postings");
      setJobPostings([]);
      setLoading(false);
    }
  };

  const handleJobPostingCreated = () => {
    fetchJobPostings(); // Refresh the list
    setModalVisible(false); // Close the modal
  };

  const openDeleteModal = (id) => {
    setJobPostingToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setJobPostingToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (jobPostingToDelete) {
        await axios.delete(`${base_url}/api/job-postings/${jobPostingToDelete}/delete`, { withCredentials: true });
        fetchJobPostings(); // Refresh the list after deletion
        handleDeleteModalClose();
        message.success("Job posting deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting job posting:", error);
      message.error("Failed to delete job posting");
    }
  };

  const openJobPostingModal = (jobPosting = null) => {
    setJobPostingToUpdate(jobPosting); // Set job posting to update
    setModalVisible(true);
  };

  const jobPostingElements = jobPostings.map(posting => ({
    key: posting.id,
    id: posting.id,
    title: posting.title,
    description: posting.description,
    postedDate: posting.postedDate,
    deadline: posting.deadline,
    location: posting.location,
    minSalary: posting.salaryRangeMin,
    maxSalary: posting.salaryRangeMax,
    positionName: posting.positionName // Added positionName
  }));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "30%",
    },
    {
      title: "Posted Date",
      dataIndex: "postedDate",
      width: "15%",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      width: "15%",
    },
    {
      title: "Location",
      dataIndex: "location",
      width: "10%",
    },
    {
      title: "Position",
      dataIndex: "positionName", // Added positionName column
      width: "10%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <div className="action-buttons">
          <Button onClick={() => openDeleteModal(record.id)} type="link" danger>
            Delete
          </Button>
          <Button onClick={() => openJobPostingModal(record)} type="link">
            Update
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <SearchBox />
              <div className="d-flex justify-content-end mb-3">
                <Button onClick={() => openJobPostingModal(null)} type="primary">
                  Add Job Posting
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={jobPostingElements}
                loading={loading}
                className="table-striped"
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>

      <JobPostingModal
        isVisible={modalVisible}
        jobPosting={jobPostingToUpdate} // Pass the job posting to update
        onJobPostingCreated={handleJobPostingCreated} // Pass the correct prop
        onCancel={() => setModalVisible(false)}
      />
      {deleteModalOpen && (
        <DeleteModal
          id={jobPostingToDelete}
          Name="Delete Job Posting"
          onDelete={handleDelete}
          onClose={handleDeleteModalClose}
        />
      )}
    </div>
  );
};

export default JobPostingList;
