import React from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { MdMailOutline } from "react-icons/md";
import { BiCodeAlt } from "react-icons/bi";
import { FaFacebookF,FaInstagram } from "react-icons/fa";

export default () => {
    return (
        <div style={{background: 'rgba(52,58,64, 0.2)'}}>
        <Container>
          <Row className="text-center pt-4 pb-4 mb-4">
            <Col>
              <a rel="noopener noreferrer" target="_blank" href="https://github.com/mattiass771" style={{textDecoration: 'none', color: '#333333'}}>
                <BiCodeAlt style={{fontSize: '150%', marginTop: '-2px'}} /> by <strong>MZ</strong>
              </a>
            </Col>
            <Col>
              <a rel="noopener noreferrer" target="_blank" href="https://facebook.com" style={{textDecoration: 'none', color: '#333333'}}>
                <FaFacebookF style={{fontSize: '130%', marginTop: '-2px', marginRight: '-4px'}} />acebook.com<strong>/masvino</strong>
              </a>
            </Col>
            <Col>
              <a rel="noopener noreferrer" target="_blank" href="https://instagram.com" style={{textDecoration: 'none', color: '#333333'}}>
                <FaInstagram style={{fontSize: '150%', marginTop: '-2px'}} /><strong>#masvino</strong>
              </a>
            </Col>
            <Col>
              <MdMailOutline style={{fontSize: '150%', marginTop: '-2px'}} /><strong style={{color: '#333333'}}>masvino@mail.com</strong>
            </Col>
          </Row>
        </Container>
      </div>
    )
}