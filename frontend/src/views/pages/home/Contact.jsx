import React from "react";
import { Navbar, Nav, Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Bizworks</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/job-board">Job Board</Nav.Link>
              {/* Add the Contact button here */}
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Button href="/login" variant="outline-light">
                Login
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h2 className="text-center">Contact Us</h2>
        <Form>
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" required />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" required />
          </Form.Group>

          <Form.Group controlId="formBasicMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Your message" required />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <div className="mt-5 text-center">
          <h4>Get in Touch</h4>
          <p>Email: contact@bizworks.com</p>
          <p>Phone: +1 (234) 567-8901</p>
          <p>Address: 123 Bizworks Lane, Business City, BC 12345</p>
        </div>
      </Container>
    </>
  );
};

export default Contact;
