// ActivityList.js
import React, { useEffect, useState } from 'react';
import { Button, List, Modal, Spin } from 'antd';
import axios from 'axios';
import RegistrationForm from './RegistrationForm';
import { base_url } from "../../../../base_urls";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${base_url}/api/extracurricular-activities`, { withCredentials: true });
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const showModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedActivity(null);
  };

  if (loading) {
    return <Spin tip="Loading activities..." />;
  }

  return (
    <div>
      <h2>Extracurricular Activities</h2>
      <List
        bordered
        dataSource={activities}
        renderItem={(activity) => (
          <List.Item>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <Button type="primary" onClick={() => showModal(activity)}>
              Register
            </Button>
          </List.Item>
        )}
      />

      <Modal
        title={`Register for ${selectedActivity?.title}`}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {selectedActivity && <RegistrationForm activity={selectedActivity} onCancel={handleCancel} />}
      </Modal>
    </div>
  );
};

export default ActivityList;
