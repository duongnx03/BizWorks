import React, { useState } from "react";
import { Form, Button, Container, Navbar, Nav, Col, Row, Spinner, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    // Thêm độ trễ 3 giây trước khi gửi email
    setTimeout(async () => {
      try {
        const response = await fetch("/api/contact/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            name: name,
            email: email,
            message: message,
          }),
        });
        if (response.ok) {
          setShowSuccess(true);
          setName("");  // Reset lại ô nhập Name
          setEmail("");  // Reset lại ô nhập Email
          setMessage("");  // Reset lại ô nhập Message
        } else {
          alert("Failed to send email.");
        }
      } catch (error) {
        alert("Error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleClose = () => setShowSuccess(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Bizworks</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/job-board">Job Board</Nav.Link>
              <Nav.Link href="/about">About Us</Nav.Link>
              <Nav.Link href="/contact">Contact Us</Nav.Link>
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
        <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#343a40" }}>
          Contact Us
        </h2>

        <Row className="justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <Form.Group controlId="formBasicName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="p-2"
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-2"
                />
              </Form.Group>

              <Form.Group controlId="formBasicMessage" className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="p-2"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 p-2" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Modal hiển thị thông báo thành công */}
      <Modal show={showSuccess} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Email Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your email has been sent successfully!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Contact;
