import React, {useState, useEffect} from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { MdMailOutline } from "react-icons/md";
import { BiCodeAlt } from "react-icons/bi";
import { FaFacebookF,FaInstagram } from "react-icons/fa";

export default ({showLawPopup, setShowLawPopup}) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0); 
  const [visible, setVisible] = useState(false);

  const limit = Math.max( 
    document.body.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.clientHeight, 
    document.documentElement.scrollHeight, 
    document.documentElement.offsetHeight 
  );  

  const footerStyles = {
    transition: 'bottom 0.6s',
    width: '100%',
    zIndex: '+2',
    backgroundColor: '#2b371b'
  }

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if ((limit - currentScrollPos) < 900 || currentScrollPos < 5) setVisible(true)
    else {
      setVisible(false);
    }
    setPrevScrollPos(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

    return (
        <div className="pt-4 pb-3 fixed-bottom" style={{...footerStyles, bottom: visible ? '0' : '-180px'}}>
        <Container>
          <Row className="text-center">
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
          <Row className="text-center my-2" style={{fontSize: '80%'}}>
            <Col>
              <span style={{color: 'whitesmoke', cursor: 'pointer'}} onClick={() => setShowLawPopup('obchodne')}>Obchodné podmienky</span>
            </Col>
            <Col>
              <span style={{color: 'whitesmoke', cursor: 'pointer'}} onClick={() => setShowLawPopup('gdpr')}>Ochrana osobných údajov</span>
            </Col>
            <Col>
              <span style={{color: 'whitesmoke', cursor: 'pointer'}} onClick={() => setShowLawPopup('reklamacny')}>Reklamačný poriadok</span>
            </Col>
            <Col>
              <span style={{color: 'whitesmoke', cursor: 'pointer'}} onClick={() => setShowLawPopup('doprava')}>Doprava a platba</span>
            </Col>
          </Row>
        </Container>
      </div>
    )
}