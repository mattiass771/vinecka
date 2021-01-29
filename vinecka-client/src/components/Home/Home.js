import React from "react";

import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//Home.js
export default () => {
  return (
    <Container>
      <br />
      <Row className="text-center">
        <Col>
          <h5>Start selling now!</h5>
        </Col>
      </Row>
      <Row className="text-center">
        <Col>
          <p>Create your shop in a few clicks - it's completely free!</p>
        </Col>
      </Row>
      <Row className="text-center">
        <Col>
          <Link to="/shop-page">
            <Button variant="dark">Open my Shop!</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};
