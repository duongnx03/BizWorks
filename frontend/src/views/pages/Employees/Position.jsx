import React, { useEffect, useState } from "react";
import { Table, message, Button } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { base_url } from "../../../base_urls";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import PositionModal from "../../../components/modelpopup/PositionModal";

const Position = () => {
  const { departmentId } = useParams();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, [departmentId]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/api/positions/by-department`, {
        params: { departmentId }
      });
      console.log("Positions data:", response.data); // Kiểm tra dữ liệu
      setPositions(response.data);
    } catch (error) {
      message.error("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  };

  const handlePositionCreated = () => {
    fetchPositions(); // Refresh the positions list
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Position Name",
      dataIndex: "positionName",
      sorter: (a, b) => a.positionName.localeCompare(b.positionName),
      width: "40%",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
      width: "40%",
    },
  ];

  const positionElements = positions.map((position) => ({
    key: position.id,
    id: position.id,
    positionName: position.positionName,
    employeeName: position.employee ? position.employee.fullname : "N/A", // Hiển thị fullname
  }));

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-end mb-3">
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                style={{ backgroundColor: '#FF6600', borderColor: '#FF6600' }}
              >
                Add Position
              </Button>
            </div>
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={positionElements}
                  loading={loading}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PositionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onPositionCreated={handlePositionCreated}
        departmentId={departmentId}
      />
    </>
  );
};

export default Position;
