import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header"; // Tái sử dụng Header component

const About = () => {
  return (
    <>
      <Header /> {/* Sử dụng Header đã tái sử dụng */}

      <Container className="mt-5">
        <h1 className="text-center mb-5">About Bizworks</h1>

        <Row className="mb-4">
          <Col md={6}>
            <img
              src="https://media.istockphoto.com/id/1455758589/vi/anh/doanh-nh%C3%A2n-l%C3%A0m-vi%E1%BB%87c-tr%C3%AAn-m%C3%A1y-t%C3%ADnh-x%C3%A1ch-tay-%C4%91%E1%BB%83-ti%E1%BA%BFp-th%E1%BB%8B-k%E1%BB%B9-thu%E1%BA%ADt-s%E1%BB%91-th%C3%B4ng-minh-tr%C3%AAn-m%C3%A0n-h%C3%ACnh-%E1%BA%A3o.jpg?s=2048x2048&w=is&k=20&c=6CIzsPxpOkjjQ6vvZShS1CCNrpdfN5Zn1q8ogRLnDE8="
              alt="About Bizworks"
              className="img-fluid"
              style={{ borderRadius: "8px" }}
            />
          </Col>
          <Col md={6}>
            <h2>About Us</h2>
            <p>
              Bizworks is a cutting-edge technology company that specializes in developing innovative HR management solutions. We strive to empower businesses by providing tools that enhance operational efficiency, streamline recruitment processes, and foster growth.
            </p>
            <p>
              Our mission is to bridge the gap between technology and human resources, offering modern solutions for talent management, performance tracking, and employee development.
            </p>
          </Col>
        </Row>

        <h2 className="text-center mb-4">Our Values</h2>
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Innovation</Card.Title>
                <Card.Text>
                  We continuously innovate to provide businesses with the most effective HR solutions that adapt to a rapidly changing world.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Integrity</Card.Title>
                <Card.Text>
                  At Bizworks, we hold ourselves to the highest ethical standards in every project, ensuring transparency and trust with our clients.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Excellence</Card.Title>
                <Card.Text>
                  Our commitment to excellence drives us to deliver top-tier HR software solutions, ensuring the success of our clients.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5 text-center">
          <Col>
            <h2>Our Vision</h2>
            <p>
              To become a global leader in HR technology, empowering organizations to create a better workplace and future through data-driven solutions and strategic innovation.
            </p>
          </Col>
        </Row>

        <Row className="text-center mt-4">
          <Col>
            <Button href="/job-board" variant="primary" size="lg">
              Join Our Team
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
