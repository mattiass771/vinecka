import React from 'react';
import {Link} from 'react-router-dom';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { BiCodeAlt } from "react-icons/bi";
import { MdMailOutline } from "react-icons/md";
import { FaFacebookF,FaInstagram } from "react-icons/fa";

export default ({setShowLawPopup}) => {

  const footerStyles = {
    transition: 'bottom 0.6s',
    width: '100%',
    zIndex: '+999',
    backgroundColor: '#ffffff'
  }

  return (
      <div className="pt-4 pb-3" style={{...footerStyles}}>
      <Container>
        <Row className="text-center">
          <Col className="my-2" lg={6} xl={3}>
            <a rel="noopener noreferrer" target="_blank" href="https://github.com/mattiass771" style={{textDecoration: 'none', color: '#2c1111'}}>
              <BiCodeAlt style={{fontSize: '150%', marginTop: '-2px'}} /> by <strong>MZ</strong>
            </a>
          </Col>
          <Col className="my-2" lg={6} xl={3}>
            <a rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/masvinosk-179187951980" style={{textDecoration: 'none', color: '#2c1111'}}>
              <FaFacebookF style={{fontSize: '130%', marginTop: '-2px', marginRight: '-4px'}} />acebook.com<strong>/masvino.sk</strong>
            </a>
          </Col>
          <Col className="my-2" lg={6} xl={3}>
            <a rel="noopener noreferrer" target="_blank" href="https://instagram.com/masvino.sk" style={{textDecoration: 'none', color: '#2c1111'}}>
              <FaInstagram style={{fontSize: '150%', marginTop: '-2px'}} /><strong>#masvino.sk</strong>
            </a>
          </Col>
          <Col className="my-2" lg={6} xl={3}>
            <Link to="/kontakt">
              <MdMailOutline style={{fontSize: '150%', marginTop: '-2px', color: '#2c1111'}} /><strong style={{color: '#2c1111'}}>masvino.sk@gmail.com</strong>
            </Link>
          </Col>
        </Row>
        <Row style={{fontSize: '80%'}}>
          <Col className="text-center my-2"  lg={6} xl={3}>
            <span style={{color: '#2c1111', cursor: 'pointer'}} onClick={() => setShowLawPopup('obchodne')}>Obchodné podmienky</span>
          </Col>
          <Col className="text-center my-2"  lg={6} xl={3}>
            <span style={{color: '#2c1111', cursor: 'pointer'}} onClick={() => setShowLawPopup('gdpr')}>Ochrana osobných údajov</span>
          </Col>
          <Col className="text-center my-2" lg={6} xl={3}>
            <span style={{color: '#2c1111', cursor: 'pointer'}} onClick={() => setShowLawPopup('reklamacny')}>Reklamačný poriadok</span>
          </Col>
          <Col className="text-center my-2" lg={6} xl={3}>
            <span style={{color: '#2c1111', cursor: 'pointer'}} onClick={() => setShowLawPopup('doprava')}>Doprava a platba</span>
          </Col>
        </Row>
      </Container>
    </div>
  )
}