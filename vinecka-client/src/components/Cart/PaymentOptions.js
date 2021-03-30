import React, {useState} from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import vublogo from './icons/vub.png'
import postovka from './icons/postova-banka-logo.png'
import slsp from './icons/slsp12.png'
import csob from './icons/CSOB_logo.png'
import tatra from './icons/tatra_banka_blue.png'

import {RiMastercardFill, RiVisaFill} from 'react-icons/ri'

import { Checkbox } from 'pretty-checkbox-react';
import '@djthoms/pretty-checkbox';

export default ({setPaymentCheck, paymentCheck, options}) => {
    const [paymentHover, setPaymentHover] = useState('')
    const {KARTA, INTERNET_BANKING, PREVOD, DOBIERKA} = options

    return (
        <React.Fragment key={'showPaymentOptions'}>
            <Row className="justify-content-center text-center pt-4">
                <Col>
                    <h3>Platobná metóda</h3>
                </Col>
            </Row>
            <Row 
                style={{ 
                    color: paymentCheck === KARTA ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                <Col 
                    md={{span: 4, offset: 2}}
                    style={{
                        backgroundColor: paymentCheck === KARTA ? '#2b371b' : paymentHover === KARTA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    onMouseEnter={() => setPaymentHover(KARTA)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(KARTA)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === KARTA ? '' : KARTA)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='osobnyPaymentCheck'
                        checked={paymentCheck === KARTA}
                        onChange={() => setPaymentCheck(paymentCheck === KARTA ? '' : KARTA)}
                    />&nbsp;
                    Platobná karta
                </Col>
                <Col 
                    style={{
                        backgroundColor: paymentCheck === KARTA ? '#2b371b' : paymentHover === KARTA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }}  
                    className="text-right" 
                    md={{span: 4}}
                    onMouseEnter={() => setPaymentHover(KARTA)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(KARTA)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === KARTA ? '' : KARTA)}
                >
                    <RiMastercardFill style={{fontSize: "200%"}} />&nbsp;<RiVisaFill style={{fontSize: "200%"}} />&nbsp;&nbsp;
                </Col>
            </Row>
            <Row 
                style={{ 
                    color: paymentCheck === INTERNET_BANKING ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                <Col 
                    md={{span: 3, offset: 2}}
                    style={{
                        backgroundColor: paymentCheck === INTERNET_BANKING ? '#2b371b' : paymentHover === INTERNET_BANKING ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    onMouseEnter={() => setPaymentHover(INTERNET_BANKING)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(INTERNET_BANKING)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === INTERNET_BANKING ? '' : INTERNET_BANKING)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='osobnyPaymentCheck'
                        checked={paymentCheck === INTERNET_BANKING}
                        onChange={() => setPaymentCheck(paymentCheck === INTERNET_BANKING ? '' : INTERNET_BANKING)}
                    />&nbsp;
                    Internet Banking
                </Col>
                <Col 
                    style={{
                        backgroundColor: paymentCheck === INTERNET_BANKING ? '#2b371b' : paymentHover === INTERNET_BANKING ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }}  
                    className="text-right" 
                    md={{span: 5}}
                    onMouseEnter={() => setPaymentHover(INTERNET_BANKING)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(INTERNET_BANKING)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === INTERNET_BANKING ? '' : INTERNET_BANKING)}
                >
                    <img src={vublogo} style={{height: '30px', width: 'auto'}} />&nbsp;&nbsp;
                    <img src={postovka} style={{height: '28px', width: 'auto'}} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src={tatra} style={{height: '28px', width: 'auto'}} />&nbsp;&nbsp;
                    <img src={slsp} style={{height: '30px', width: 'auto'}} />&nbsp;&nbsp;
                    <img src={csob} style={{height: '26px', width: 'auto'}} />&nbsp;&nbsp;
                </Col>
            </Row>
            <Row 
                style={{ 
                    color: paymentCheck === PREVOD ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                <Col 
                    md={{span: 3, offset: 2}}
                    style={{
                        backgroundColor: paymentCheck === PREVOD ? '#2b371b' : paymentHover === PREVOD ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    onMouseEnter={() => setPaymentHover(PREVOD)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(PREVOD)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === PREVOD ? '' : PREVOD)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"   
                        name='osobnyPaymentCheck'
                        checked={paymentCheck === PREVOD}
                        onChange={() => setPaymentCheck(paymentCheck === PREVOD ? '' : PREVOD)}
                    />&nbsp;
                    Bankový prevod
                </Col>
                <Col 
                    style={{
                        backgroundColor: paymentCheck === PREVOD ? '#2b371b' : paymentHover === PREVOD ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }}  
                    className="text-right" 
                    md={{span: 5}}
                    onMouseEnter={() => setPaymentHover(PREVOD)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(PREVOD)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === PREVOD ? '' : PREVOD)}
                >
                    Po presmerovaní použite údaje ktoré sa vám zobrazia.
                </Col>
            </Row>
            <Row 
                style={{ 
                    color: paymentCheck === DOBIERKA ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                <Col 
                    md={{span: 3, offset: 2}}
                    style={{
                        backgroundColor: paymentCheck === DOBIERKA ? '#2b371b' : paymentHover === DOBIERKA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    onMouseEnter={() => setPaymentHover(DOBIERKA)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(DOBIERKA)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === DOBIERKA ? '' : DOBIERKA)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='osobnyPaymentCheck'
                        checked={paymentCheck === DOBIERKA}
                        onChange={() => setPaymentCheck(paymentCheck === DOBIERKA ? '' : DOBIERKA)}
                    />&nbsp;
                    Dobierka
                    
                </Col>
                <Col 
                    style={{
                        backgroundColor: paymentCheck === DOBIERKA ? '#2b371b' : paymentHover === DOBIERKA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }}  
                    className="text-right" 
                    md={{span: 5}}
                    onMouseEnter={() => setPaymentHover(DOBIERKA)}
                    onMouseLeave={() => setPaymentHover('')}
                    onTouchStart={() => setPaymentHover(DOBIERKA)}
                    onTouchEnd={() => setPaymentHover('')}
                    onClick={() => setPaymentCheck(paymentCheck === DOBIERKA ? '' : DOBIERKA)}
                >
                    Zaplatíte pri prevzaní zásielky.
                </Col>
            </Row>
            <Row className="pt-4" style={{borderBottom: '2px solid #c1c1c1'}} />
        </React.Fragment>
    )
}