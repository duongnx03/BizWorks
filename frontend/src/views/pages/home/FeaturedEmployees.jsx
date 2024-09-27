import React from "react";
import { Card, Image } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedEmployees = () => {
    const employees = [
        {
          name: "Pham Phu Dien",
          position: "Team Leader",
          description: "Led the team to achieve 120% of the project goals, improving overall efficiency.",
          image: "https://img-cdn.pixlr.com/image-generator/history/65ba5701b4f4f4419f746bc3/806ecb58-167c-4d20-b658-a6a6b2f221e9/medium.webp"
        },
        {
          name: "Nguyen Xuan Duong",
          position: "HR Manager",
          description: "Successfully implemented a new recruitment strategy, reducing hiring time by 30%.",
          image: "https://gratisography.com/wp-content/uploads/2024/03/gratisography-vr-glasses-800x525.jpg"
        },
        {
          name: "Nguyen Minh Tri",
          position: "Developer",
          description: "Developed a key feature that increased user engagement by 40% and received positive feedback.",
          image: "https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80"
        },
        {
          name: "Ho Quoc Trong",
          position: "Designer",
          description: "Redesigned the company's website, leading to a 50% increase in customer satisfaction.",
          image: "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
        }
      ];
      
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
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
        card: {
            width: "90%",
            margin: "0 auto",
            border: "none",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            textAlign: "center",
            borderRadius: "15px",
            display: "flex", // Sử dụng flexbox
            alignItems: "center", // Canh giữa
            padding: "20px", // Thêm padding cho card
        },
        avatar: {
            width: "120px",
            height: "120px",
            objectFit: "cover",
            border: "4px solid #007bff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "box-shadow 0.3s ease, transform 0.3s ease"
        },
        info: {
            marginLeft: "20px", // Khoảng cách giữa ảnh và thông tin
            textAlign: "left" // Căn trái cho thông tin
        },
        name: {
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#007bff",
            margin: "10px 0 5px 0"
        },
        position: {
            fontSize: "1rem",
            color: "#6c757d",
            marginBottom: "5px"
        },
        description: {
            fontSize: "0.9rem",
            color: "#495057"
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Featured Employees</h3>
            <Slider {...settings}>
                {employees.map((employee, index) => (
                    <div key={index}>
                        <Card style={styles.card}>
                            <Image
                                src={employee.image}
                                roundedCircle
                                style={styles.avatar}
                                alt={employee.name}
                            />
                            <div style={styles.info}>
                                <Card.Title style={styles.name}>{employee.name}</Card.Title>
                                <Card.Text style={styles.position}>{employee.position}</Card.Text>
                                <Card.Text style={styles.description}>{employee.description}</Card.Text>
                            </div>
                        </Card>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default FeaturedEmployees;
