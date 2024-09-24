import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Input } from "antd";
import axios from "axios";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import JobPostingModal from "../../../components/modelpopup/JobPostingModal";
import { base_url } from "../../../base_urls";

const { Search } = Input;

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobPostingToDelete, setJobPostingToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [jobPostingToUpdate, setJobPostingToUpdate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({
    columnKey: null,
    order: null,
  });

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
    fetchJobPostings();
    setModalVisible(false);
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
        fetchJobPostings();
        handleDeleteModalClose();
        message.success("Job posting deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting job posting:", error);
      message.error("Failed to delete job posting");
    }
  };

  const openJobPostingModal = (jobPosting = null) => {
    setJobPostingToUpdate(jobPosting);
    setModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const filteredData = jobPostings.filter(posting =>
    posting.title.toLowerCase().includes(searchText.toLowerCase()) ||
    posting.description.toLowerCase().includes(searchText.toLowerCase()) ||
    posting.location.toLowerCase().includes(searchText.toLowerCase()) ||
    new Date(posting.postedDate).toLocaleDateString().includes(searchText.toLowerCase()) ||
    new Date(posting.deadline).toLocaleDateString().includes(searchText.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (!sortedInfo.columnKey) return 0;

    const key = sortedInfo.columnKey;
    const order = sortedInfo.order === 'ascend' ? 1 : -1;

    if (a[key] < b[key]) return -1 * order;
    if (a[key] > b[key]) return 1 * order;
    return 0;
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: "20%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "30%",
      sorter: (a, b) => a.description.localeCompare(b.description),
      sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
      render: (text) => (
        <div style={{ maxHeight: '50px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {text}
        </div>
      ),
    },
    {
      title: "Posted Date",
      dataIndex: "postedDate",
      width: "15%",
      sorter: (a, b) => new Date(a.postedDate) - new Date(b.postedDate),
      render: date => new Date(date).toLocaleDateString(),
      sortOrder: sortedInfo.columnKey === 'postedDate' && sortedInfo.order,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      width: "15%",
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
      render: date => new Date(date).toLocaleDateString(),
      sortOrder: sortedInfo.columnKey === 'deadline' && sortedInfo.order,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: "10%",
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortOrder: sortedInfo.columnKey === 'location' && sortedInfo.order,
    },
    {
      title: "Position",
      dataIndex: "positionName",
      width: "10%",
      sorter: (a, b) => a.positionName.localeCompare(b.positionName),
      sortOrder: sortedInfo.columnKey === 'positionName' && sortedInfo.order,
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
              <Search
                placeholder="Search"
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
                allowClear
              />
              <div className="d-flex justify-content-end mb-3">
                <Button onClick={() => openJobPostingModal(null)} type="primary">
                  Add Job Posting
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={sortedData}
                loading={loading}
                className="table-striped"
                rowKey="id"
                onChange={handleChange}
                pagination={{ pageSize: 10 }} // You can adjust pagination as needed
              />
            </div>
          </div>
        </div>
      </div>

      <JobPostingModal
        isVisible={modalVisible}
        jobPosting={jobPostingToUpdate}
        onJobPostingCreated={handleJobPostingCreated}
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
