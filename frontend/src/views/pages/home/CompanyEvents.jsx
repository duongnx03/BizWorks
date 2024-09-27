import React, { useState } from "react";
import { Card, Image } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CompanyEvents = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const events = [
    {
      title: "Recruitment Fair",
      date: "2024-10-10",
      description: "Join us for the recruitment fair at our headquarters. Come to meet and interview directly!",
      image: "https://www.ismartrecruit.com/upload/blog/main_image/Banner_Designs_(1)2.webp"
    },
    {
      title: "Internal Training Program",
      date: "2024-10-15",
      description: "A training program for new employees to enhance skills and knowledge.",
      image: "https://cl-wpml.careerlink.vn/cam-nang-viec-lam/wp-content/uploads/2024/01/04083617/development-knowledge-study-education-concept-1024x673.jpg"
    },
    {
      title: "Year-End Party",
      date: "2024-12-20",
      description: "Year-end party to celebrate the successes achieved throughout the year.",
      image: "https://inlysugiare.com/UserFile/editor/t12.jpg"
    }
  ];

  const truncateDescription = (description, length) => {
    return description.length > length ? description.substring(0, length) + "..." : description;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const styles = {
    container: {
      backgroundColor: "#f8f9fa",
      padding: "40px 0"
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#343a40",
      marginBottom: "30px",
      textAlign: "center"
    },
    card: (isHovered) => ({
      border: "none",
      backgroundColor: "#ffffff",
      boxShadow: isHovered ? "0 8px 24px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
      borderRadius: "15px",
      margin: "0 10px",
      overflow: "hidden",
      height: "440px",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: isHovered ? "scale(1.05)" : "scale(1)",
      cursor: "pointer",
    }),
    eventImage: {
      width: "100%",
      height: "250px",
      objectFit: "cover",
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px"
    },
    eventTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginTop: "15px"
    },
    eventDate: {
      fontSize: "1rem",
      color: "#6c757d"
    },
    eventDescription: {
      marginBottom: "35px",
      flexGrow: 1 
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Company Events</h2>
      <Slider {...settings}>
        {events.map((event, index) => (
          <div key={index}>
            <Card
              style={styles.card(hoveredIndex === index)} // Call function to pass parameter
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image src={event.image} style={styles.eventImage} alt={event.title} />
              <Card.Body>
                <Card.Title style={styles.eventTitle}>{event.title}</Card.Title>
                <Card.Text style={styles.eventDate}>{event.date}</Card.Text>
                <Card.Text style={styles.eventDescription}>{truncateDescription(event.description, 100)}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CompanyEvents;
