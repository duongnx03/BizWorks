import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Input } from "antd";
import axios from "axios";
import { base_url } from "../../../base_urls";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const CompletedTrainingPrograms = () => {
    const [completedPrograms, setCompletedPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [sortedInfo, setSortedInfo] = useState({
        columnKey: null,
        order: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCompletedPrograms();
    }, []);

    const fetchCompletedPrograms = async () => {
        try {
            const response = await axios.get(`${base_url}/api/training-programs/completed`, { withCredentials: true });
            if (response.data) {
                setCompletedPrograms(response.data);
            } else {
                setCompletedPrograms([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching completed programs:", error);
            message.error("Failed to fetch completed programs");
            setCompletedPrograms([]);
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    const filteredData = completedPrograms.filter(program =>
        program.title.toLowerCase().includes(searchText.toLowerCase()) ||
        program.description.toLowerCase().includes(searchText.toLowerCase())
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
            width: "30%",
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        },
        {
            title: "Description",
            dataIndex: "description",
            width: "40%",
            render: (text) => (
                <div style={{ maxHeight: '50px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            width: "10%",
            render: date => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            sortOrder: sortedInfo.columnKey === 'startDate' && sortedInfo.order,
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            width: "10%",
            render: date => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
            sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order,
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/completed_training_program/${record.id}`)}
                >
                    Xem Chi Tiết
                </Button>
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
        </div>
    );
};

export default CompletedTrainingPrograms;
