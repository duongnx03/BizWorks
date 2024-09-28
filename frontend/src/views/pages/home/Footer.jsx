import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5">
      <Container>
        <Row className="py-4">
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              Bizworks is a leading HR management technology company, 
              dedicated to providing innovative solutions to enhance business performance.
            </p>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              <strong>Email:</strong> bizworks8386@gmail.com<br />
              <strong>Phone:</strong> (123) 456-7890<br />
              <strong>Address:</strong> 391A Nam Ky Khoi Nghia Street, Ward 14, District 3, HCM City, Vietnam
            </p>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <Nav className="flex-column">
              <Nav.Link href="https://www.facebook.com" target="_blank" className="text-light">
                <FaFacebook /> Facebook
              </Nav.Link>
              <Nav.Link href="https://www.twitter.com" target="_blank" className="text-light">
                <FaTwitter /> Twitter
              </Nav.Link>
              <Nav.Link href="https://www.linkedin.com" target="_blank" className="text-light">
                <FaLinkedin /> LinkedIn
              </Nav.Link>
              <Nav.Link href="https://www.instagram.com" target="_blank" className="text-light">
                <FaInstagram /> Instagram
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <p>&copy; {new Date().getFullYear()} Bizworks. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
