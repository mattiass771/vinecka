import React from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { MdMailOutline } from "react-icons/md";
import { BiCodeAlt } from "react-icons/bi";
import { FaFacebookF,FaInstagram } from "react-icons/fa";

export default () => {
    return (
        <div className="pt-1 pb-3" style={{backgroundColor: 'rgba(55, 63, 39, 0.6)'}}>
        <Container>
          <Row className="text-center pt-4 pb-4 mt-4">
            <Col className="mb-2" md={6} lg={3}>
              <a rel="noopener noreferrer" target="_blank" href="https://github.com/mattiass771" style={{textDecoration: 'none', color: 'whitesmoke'}}>
                <BiCodeAlt style={{fontSize: '150%', marginTop: '-2px'}} /> by <strong>MZ</strong>
              </a>
            </Col>
            <Col className="mb-2" md={6} lg={3}>
              <a rel="noopener noreferrer" target="_blank" href="https://facebook.com" style={{textDecoration: 'none', color: 'whitesmoke'}}>
                <FaFacebookF style={{fontSize: '130%', marginTop: '-2px', marginRight: '-4px'}} />acebook.com<strong>/masvino</strong>
              </a>
            </Col>
            <Col className="mb-2" md={6} lg={3}>
              <a rel="noopener noreferrer" target="_blank" href="https://instagram.com" style={{textDecoration: 'none', color: 'whitesmoke'}}>
                <FaInstagram style={{fontSize: '150%', marginTop: '-2px'}} /><strong>#masvino</strong>
              </a>
            </Col>
            <Col className="mb-2" md={6} lg={3}>
              <MdMailOutline style={{fontSize: '150%', marginTop: '-2px', color: 'whitesmoke'}} /><strong style={{color: 'whitesmoke'}}>masvino@mail.com</strong>
            </Col>
          </Row>
        </Container>
      </div>
    )
}