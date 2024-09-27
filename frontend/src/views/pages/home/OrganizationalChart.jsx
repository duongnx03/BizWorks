import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import Header from "./Header";

const OrganizationalChart = () => {
  return (
    <>
      <Header />
    <Container className="my-5">
      <h2 className="text-center mb-5">Company Organizational Chart</h2>
      <Row className="text-center">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/zNRITe8NPqY/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="120" 
                height="120"
              />
              <Card.Title>Chief Executive Officer (CEO)</Card.Title>
              <Card.Text>Nguyen Van A</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center">
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/7KHCNCddn2U/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="120" 
                height="120"
              />
              <Card.Title>Chief Financial Officer (CFO)</Card.Title>
              <Card.Text>Tran Thi B</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/T6CxJyFj4vU/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="120" 
                height="120"
              />
              <Card.Title>Chief Technology Officer (CTO)</Card.Title>
              <Card.Text>Pham Van C</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/ABVC7BaKcXo/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="120" 
                height="120"
              />
              <Card.Title>Chief Marketing Officer (CMO)</Card.Title>
              <Card.Text>Le Thi D</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center">
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/OQMZwNd3ThU/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="100" 
                height="100"
              />
              <Card.Title>Human Resources Manager</Card.Title>
              <Card.Text>Ngo Van E</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/LkaNSBSNMV4/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="100" 
                height="100"
              />
              <Card.Title>Sales Manager</Card.Title>
              <Card.Text>Do Thi F</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/XqH2EgYa5dU/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="100" 
                height="100"
              />
              <Card.Title>IT Manager</Card.Title>
              <Card.Text>Trinh Van G</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Image 
                src="https://unsplash.com/photos/WNoLnJo7tS8/download?force=true&w=640" 
                roundedCircle 
                className="mb-3" 
                width="100" 
                height="100"
              />
              <Card.Title>Administrative Manager</Card.Title>
              <Card.Text>Nguyen Thi H</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default OrganizationalChart;
