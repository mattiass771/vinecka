import React, {useState} from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { Checkbox } from 'pretty-checkbox-react';
import '@djthoms/pretty-checkbox';

const Packeta = window.Packeta || {};
const packetaApiKey = process.env.REACT_APP_PACKETA_API_KEY;

export default ({setSelectedPickupPoint, setDeliveryCheck, options, deliveryCheck, isDeliveryFree, localDeliveryPrice}) => {
    const [deliveryHover, setDeliveryHover] = useState('')
    const { OSOBNY, ROZVOZ, ZASIELKOVNA, ZASIELKOVNA_PRICE, KURIER, ROZVOZ_FIRST ,ROZVOZ_SECOND ,KURIER_PRICE } = options

    const showSelectedPickupPoint = (point) => {
        let idElement = document.getElementById('packeta-point-id');
        if(point) {            
            idElement.value = point.id;
            setSelectedPickupPoint(point)
        }
        else {
            idElement.value = "";
            setSelectedPickupPoint('')
            return
        }
    };

    const packetaOptions = {
        country: 'sk',
        language: 'sk',
    }

    return (
        <React.Fragment key={'showDeliveryOptions'}>
            <Row className="justify-content-center text-center pt-4">
                <Col>
                    <h3>Výber doručenia</h3>
                </Col>
            </Row>
            <Row 
                style={{ 
                    color: deliveryCheck === OSOBNY ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                <Col 
                    md={{span: 4, offset: 2}}
                    className="pay-deli-left-options"
                    style={{
                        backgroundColor: deliveryCheck === OSOBNY ? '#141a10' : deliveryHover === OSOBNY ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }} 
                    onMouseEnter={() => setDeliveryHover(OSOBNY)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(OSOBNY)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='osobnyDeliveryCheck'
                        checked={deliveryCheck === OSOBNY}
                        onChange={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                    />&nbsp;
                    Osobný odber v Pezinku:
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === OSOBNY ? '#141a10' : deliveryHover === OSOBNY ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }}  
                    className="text-right pay-deli-right-options" 
                    md={{span: 4}}
                    onMouseEnter={() => setDeliveryHover(OSOBNY)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(OSOBNY)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                >
                    <strong>zadarmo</strong>
                </Col>
            </Row>
            {localDeliveryPrice &&
            <Row 
                style={{ 
                    color: deliveryCheck === ROZVOZ ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === ROZVOZ ? '#141a10' : deliveryHover === ROZVOZ ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }} 
                    className="pay-deli-left-options"
                    md={{span: 3, offset: 2}}
                    onMouseEnter={() => setDeliveryHover(ROZVOZ)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ROZVOZ)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='dovozDeliveryCheck'
                        checked={deliveryCheck === ROZVOZ}
                        onChange={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                    />&nbsp;
                    Náš rozvoz:
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === ROZVOZ ? '#141a10' : deliveryHover === ROZVOZ ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }} 
                    className="pay-deli-right-options text-right"
                    md={{span: 5}}
                    onMouseEnter={() => setDeliveryHover(ROZVOZ)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ROZVOZ)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                >
                    Bratislava, Pezinok, Vinosady, Limbach, Viničné - <strong>{isDeliveryFree ? 'zadarmo' : `${ROZVOZ_FIRST} €`}</strong><br/>
                    Modra, Šenkvice, Slovenský Grob,<br /> Svätý Jur, Dubová, Čierna Voda - <strong>{isDeliveryFree ? 'zadarmo' : `${ROZVOZ_SECOND} €`}</strong>
                </Col>
            </Row>}
            <Row 
                style={{ 
                    color: deliveryCheck === ZASIELKOVNA ? 'whitesmoke' : ''
                    }} 
                className="my-2"
            >
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === ZASIELKOVNA ? '#141a10' : deliveryHover === ZASIELKOVNA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }} 
                    className="pay-deli-left-options"
                    md={{span: 3, offset: 2}}
                    onMouseEnter={() => setDeliveryHover(ZASIELKOVNA)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ZASIELKOVNA)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                > 
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='dovozDeliveryCheck'
                        checked={deliveryCheck === ZASIELKOVNA}
                        onChange={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                    />&nbsp;
                    Zásielkovňa:
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === ZASIELKOVNA ? '#141a10' : deliveryHover === ZASIELKOVNA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }} 
                    className="pay-deli-right-options text-right"
                    md={{span: 5}}
                    onMouseEnter={() => setDeliveryHover(ZASIELKOVNA)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ZASIELKOVNA)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                >
                    <strong>{isDeliveryFree ? 'zadarmo' : `${ZASIELKOVNA_PRICE.toFixed(2)} €`}</strong>
                </Col>
            </Row>
            {deliveryCheck === ZASIELKOVNA &&
                <Row className="justify-content-center text-center">
                    <Col>
                        <Button variant="dark" onClick={() => Packeta.Widget.pick(packetaApiKey, showSelectedPickupPoint, packetaOptions)}>Vyberte miesto vyzdvihnutia</Button>
                        <input type="hidden" id="packeta-point-id" />
                    </Col>
                </Row>}
            <Row 
                style={{ 
                    color: deliveryCheck === KURIER ? 'whitesmoke' : '',
                    }} 
                className="mb-2"
            >
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === KURIER ? '#141a10' : deliveryHover === KURIER ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                    }} 
                    className="pay-deli-left-options"
                    md={{span: 3, offset: 2}}
                    onMouseEnter={() => setDeliveryHover(KURIER)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(KURIER)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                >
                    <Checkbox 
                        style={{
                            cursor: 'pointer',
                        }}
                        color="warning"
                        shape="curve"
                        animation="jelly"
                        name='dovozDeliveryCheck'
                        checked={deliveryCheck === KURIER}
                        onChange={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                    />&nbsp;
                    Kuriér:
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === KURIER ? '#141a10' : deliveryHover === KURIER ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }} 
                    className="pay-deli-right-options text-right"
                    md={{span: 5}}
                    onMouseEnter={() => setDeliveryHover(KURIER)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(KURIER)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                >
                    <strong>{isDeliveryFree ? 'zadarmo' : `${KURIER_PRICE} €`}</strong>
                </Col>
            </Row>
            <Row className="pt-4" style={{borderBottom: '2px solid #c1c1c1'}} />
        </React.Fragment>
    )
}