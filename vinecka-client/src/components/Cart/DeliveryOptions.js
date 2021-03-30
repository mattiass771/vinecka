import React, {useState} from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

const Packeta = window.Packeta || {};
const packetaApiKey = '810de6318fde2d34';

export default ({setSelectedPickupPoint, setDeliveryCheck, options, deliveryCheck, isDeliveryFree, localDeliveryPrice, boxCount}) => {
    const [deliveryHover, setDeliveryHover] = useState('')
    const { OSOBNY, ROZVOZ, ZASIELKOVNA, ZASIELKOVNA_PRICE, KURIER } = options

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
        language: 'sk'
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
                    style={{
                        backgroundColor: deliveryCheck === OSOBNY ? '#2b371b' : deliveryHover === OSOBNY ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    onMouseEnter={() => setDeliveryHover(OSOBNY)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(OSOBNY)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                >
                
                    <input 
                        style={{
                            cursor: 'pointer',
                            backgroundColor: deliveryCheck === OSOBNY ? 'red' : 'black'
                        }}
                        type='checkbox'
                        name='osobnyDeliveryCheck'
                        checked={deliveryCheck === OSOBNY}
                        onChange={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                    />&nbsp;
                    Osobný odber v Pezinku:
                    
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === OSOBNY ? '#2b371b' : deliveryHover === OSOBNY ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }}  
                    className="text-right" 
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
                        backgroundColor: deliveryCheck === ROZVOZ ? '#2b371b' : deliveryHover === ROZVOZ ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    md={{span: 3, offset: 2}}
                    onMouseEnter={() => setDeliveryHover(ROZVOZ)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ROZVOZ)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                >
                    
                    <input 
                        style={{
                            cursor: 'pointer',
                            backgroundColor: deliveryCheck === ROZVOZ ? 'red' : 'black'
                        }}
                        type='checkbox'
                        name='dovozDeliveryCheck'
                        checked={deliveryCheck === ROZVOZ}
                        onChange={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                    />&nbsp;
                    Náš rozvoz:
                    
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === ROZVOZ ? '#2b371b' : deliveryHover === ROZVOZ ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }} 
                    className="text-right" 
                    md={{span: 5}}
                    onMouseEnter={() => setDeliveryHover(ROZVOZ)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ROZVOZ)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                >
                    Bratislava, Pezinok, Vinosady, Limbach, Viničné - <strong>{isDeliveryFree ? 'zadarmo' : '1,90 €'}</strong><br/>
                    Modra, Šenkvice, Slovenský Grob,<br /> Svätý Jur, Dubová, Čierna Voda - <strong>{isDeliveryFree ? 'zadarmo' : '3,90 €'}</strong>
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
                        backgroundColor: deliveryCheck === ZASIELKOVNA ? '#2b371b' : deliveryHover === ZASIELKOVNA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    md={{span: 3, offset: 2}}
                    onMouseEnter={() => setDeliveryHover(ZASIELKOVNA)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ZASIELKOVNA)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                >
                    
                    <input 
                        style={{
                            cursor: 'pointer',
                            backgroundColor: deliveryCheck === ZASIELKOVNA ? 'red' : 'black'
                        }}
                        type='checkbox'
                        name='dovozDeliveryCheck'
                        checked={deliveryCheck === ZASIELKOVNA}
                        onChange={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                    />&nbsp;
                    Zásielkovňa:
                    
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === ZASIELKOVNA ? '#2b371b' : deliveryHover === ZASIELKOVNA ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }} 
                    className="text-right" 
                    md={{span: 5}}
                    onMouseEnter={() => setDeliveryHover(ZASIELKOVNA)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(ZASIELKOVNA)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                >
                    Od váhy, každá krabica (6 fliaš) vlastné poštovné - <strong>{isDeliveryFree ? 'zadarmo' : `${((Math.ceil(boxCount/6)*ZASIELKOVNA_PRICE)).toFixed(2)} €`}</strong> <br />
                    Fliaš: <strong>{boxCount}</strong>, Krabíc: <strong>{Math.ceil(boxCount/6)}</strong>.
                </Col>
            </Row>
            {/* <SlideDown className={"my-dropdown-slidedown"}> */}
                {deliveryCheck === ZASIELKOVNA &&
                    <Row className="justify-content-center text-center">
                        <Col>
                            <Button variant="dark" onClick={() => Packeta.Widget.pick(packetaApiKey, showSelectedPickupPoint, packetaOptions)}>Vyberte miesto vyzdvihnutia</Button>
                            <input type="hidden" id="packeta-point-id" />
                        </Col>
                    </Row>}
            {/* </SlideDown> */}
            <Row 
                style={{ 
                    color: deliveryCheck === KURIER ? 'whitesmoke' : '',
                    }} 
                className="mb-2"
            >
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === KURIER ? '#2b371b' : deliveryHover === KURIER ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopLeftRadius: '5px', 
                        borderBottomLeftRadius: '5px'
                    }} 
                    md={{span: 3, offset: 2}}
                    onMouseEnter={() => setDeliveryHover(KURIER)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(KURIER)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                >
                    
                    <input 
                        style={{
                            cursor: 'pointer',
                            backgroundColor: deliveryCheck === KURIER ? 'red' : 'black'
                        }}
                        type='checkbox'
                        name='dovozDeliveryCheck'
                        checked={deliveryCheck === KURIER}
                        onChange={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                    />&nbsp;
                    Kuriér:
                    
                </Col>
                <Col 
                    style={{
                        backgroundColor: deliveryCheck === KURIER ? '#2b371b' : deliveryHover === KURIER ? '#c6c6c6' : '', 
                        cursor: 'pointer',
                        borderTopRightRadius: '5px', 
                        borderBottomRightRadius: '5px'
                    }} 
                    className="text-right" 
                    md={{span: 5}}
                    onMouseEnter={() => setDeliveryHover(KURIER)}
                    onMouseLeave={() => setDeliveryHover('')}
                    onTouchStart={() => setDeliveryHover(KURIER)}
                    onTouchEnd={() => setDeliveryHover('')}
                    onClick={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                >
                    <strong>{isDeliveryFree ? 'zadarmo' : '6,90 €'}</strong>
                </Col>
            </Row>
            <Row className="pt-4" style={{borderBottom: '2px solid #c1c1c1'}} />
        </React.Fragment>
    )
}