import React from 'react'

import {GoChecklist} from 'react-icons/go'
import {FaTruckLoading} from 'react-icons/fa'
import {ImMan} from 'react-icons/im'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default () => {
    return (
        <Container>
            <Row style={{height: '65vh'}}>
                <Col style={{fontSize: '200%', marginTop: '25vh', textAlign: 'center'}}>
                    Momentálne prebieha inventúra dostupných vín. 
                    <br />
                    <br />
                    <ImMan  style={{fontSize: '250%'}} />
                    <GoChecklist style={{marginLeft: '-30px', marginRight: '20px'}} />
                    <FaTruckLoading style={{fontSize: '250%'}} />
                    <br />
                    <br />
                     Stránka bude plne funkčná do pár dní.
                </Col>
            </Row>
        </Container>
    )
}