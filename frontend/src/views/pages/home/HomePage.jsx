import React from "react";
import { Button, Carousel, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import FeaturedEmployees from "./FeaturedEmployees";
import CompanyEvents from "./CompanyEvents";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Header/>
      <Carousel fade={true} interval={3000} controls={true} indicators={true}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://media.istockphoto.com/id/1455758589/vi/anh/doanh-nh%C3%A2n-l%C3%A0m-vi%E1%BB%87c-tr%C3%AAn-m%C3%A1y-t%C3%ADnh-x%C3%A1ch-tay-%C4%91%E1%BB%83-ti%E1%BA%BFp-th%E1%BB%8B-k%E1%BB%B9-thu%E1%BA%ADt-s%E1%BB%91-th%C3%B4ng-minh-tr%C3%AAn-m%C3%A0n-h%C3%ACnh-%E1%BA%A3o.jpg?s=2048x2048&w=is&k=20&c=6CIzsPxpOkjjQ6vvZShS1CCNrpdfN5Zn1q8ogRLnDE8="
            alt="First slide"
            style={{ height: "800px", objectFit: "cover" }} 
          />
          <Carousel.Caption>
            <h3 style={{ fontSize: "2.5rem", color: "#ffffff" }}>
              Welcome to Bizworks
            </h3>
            <p style={{ fontSize: "1.5rem", color: "#ffffff" }}>
              Leading the way in innovative HR management solutions.
            </p>
            <Button href="/job-board" variant="primary">
              Explore Job Board
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://media.istockphoto.com/id/1401017426/vi/anh/ph%C3%A2n-t%C3%ADch-d%E1%BB%AF-li%E1%BB%87u-%C4%91%E1%BB%83-s%E1%BB%AD-d%E1%BB%A5ng-trong-k%E1%BA%BF-ho%E1%BA%A1ch-t%C3%A0i-ch%C3%ADnh-c%E1%BB%A7a-m%E1%BB%99t-c%C3%B4ng-ty.jpg?s=2048x2048&w=is&k=20&c=Cru6wKXUMAKDP_QT9uSDPJ_kvYxNsZiKpRoM0C_Xg5U="
            alt="Second slide"
            style={{ height: "800px", objectFit: "cover" }} 
          />
          <Carousel.Caption>
            <h3 style={{ fontSize: "2.5rem", color: "#ffffff" }}>Our Vision</h3>
            <p style={{ fontSize: "1.5rem", color: "#ffffff" }}>
              Empowering businesses through technology and innovation.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://media.istockphoto.com/id/2063100119/vi/anh/kh%C3%A1i-ni%E1%BB%87m-ph%C3%A2n-t%C3%ADch-d%E1%BB%AF-li%E1%BB%87u-ti%E1%BA%BFp-th%E1%BB%8B-k%E1%BB%B9-thu%E1%BA%ADt-s%E1%BB%91-th%C3%B4ng-minh-n%E1%BB%AF-doanh-nh%C3%A2n-s%E1%BB%AD-d%E1%BB%A5ng-bi%E1%BB%83u-%C4%91%E1%BB%93-ph%C3%A2n.jpg?s=2048x2048&w=is&k=20&c=y0wDOBQwT5OhpbGjqLa2kmWtceMPkPw8bkQGtESjVgw="
            alt="Third slide"
            style={{ height: "800px", objectFit: "cover" }} 
          />
          <Carousel.Caption>
            <h3 style={{ fontSize: "2.5rem", color: "#ffffff" }}>
              Join Our Team
            </h3>
            <p style={{ fontSize: "1.5rem", color: "#ffffff" }}>
              Become part of a dynamic team at Bizworks.
            </p>
            <Button href="/job-board" variant="primary">
              View Open Positions
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Container className="mt-5 text-center">
      <h2>Why Choose Us?</h2>
      <p>
        Bizworks is a leading technology company specializing in providing advanced HR management software solutions. We take pride in offering businesses modern tools to optimize their recruitment processes, performance management, and talent development.
      </p>
      <p>
        Our software platform enables companies to easily manage employee records, track working hours, and generate detailed analytical reports, which support effective decision-making. We not only provide software but also partner with our clients in implementing and optimizing their workflows.
      </p>
      <p>
        By choosing Bizworks, you gain a reliable technology partner and a dedicated team of experts ready to support you on your journey toward sustainable growth. We are committed to delivering real value to every client through innovation and the application of advanced technology.
      </p>
      <Button href="/job-board" variant="primary" size="lg" className="mt-4">
        Explore Job Board
      </Button>
      <div style={{ marginBottom: '40px' }} />
    </Container>

    <FeaturedEmployees />
    <CompanyEvents/>
    <Footer/>
    </>
  );
};

export default Home;
