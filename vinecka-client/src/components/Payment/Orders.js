import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';

import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from "react-bootstrap/InputGroup"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {BsTrashFill} from "react-icons/bs";
import DeleteModal from "./DeleteModal";

export default ({email, isOwner}) => {
    const [ordersData, setOrdersData] = useState([])
    const [statusObj, setStatusObj] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [expandedObj, setExpandedObj] = useState({})

    const [maxDate, setMaxDate] = useState(new Date())
    const [minDate, setMinDate] = useState(new Date('2021-01-01'))
    const [filterByStatus, setFilterByStatus] = useState('vsetky')

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [passDeleteId, setPassDeleteId] = useState('')
    // TODO: pridat moznost znovu zaplatit pri rejected order

    useEffect(() => {
        axios.get(`https://mas-vino.herokuapp.com/orders`)
            .then(res => {
                const result = res.data
                const validatedOrdersData = isOwner ? result : result.filter(obj => obj.userInformation.email === email)
                setOrdersData(validatedOrdersData)
            })
            .catch(err => err && console.log(err.data))
    }, [showDeleteModal, filterByStatus])

    const handleStatus = (e, _id) => {
        e.stopPropagation()
        const newVal = e.target.value
        let newObj = {}
        let expandObj = {}

        newObj[_id] = newVal
        setStatusObj({...statusObj, ...newObj})

        const oldValue = typeof expandedObj[_id] === 'string' ?? false
        expandObj[_id] = oldValue
        setExpandedObj({...expandedObj, ...expandObj})

        axios.put(`https://mas-vino.herokuapp.com/orders/${_id}/update-status/`, {status: newVal})
            .then(res => console.log(res.data))
            .catch(err => err && console.log(err))
            .then(() => setRefresh(!refresh))
    }

    const handleExpanded = (_id) => {
        let newObj = {}
        const oldValue = expandedObj[_id] ?? false
        newObj[_id] = !oldValue
        setExpandedObj({...expandedObj, ...newObj})
    }

    const ShowItemDataForOrder = ({passItemData}) => {
        let shopTotal = 0
        return passItemData.map((item, i) => {
            const { itemName, price, count, itemId } = item
            shopTotal += (count * Number(price.replace(/,/g, '.')))
            return (
                <React.Fragment key={itemId}>
                    <Col style={{border: '1px solid #cccccc'}} md={3}>
                        ({count}) <strong>{itemName}</strong>, {price}€
                    </Col>
                    {!passItemData[i+1] && 
                        <Col className="text-center" style={{border: '1px solid #cccccc', backgroundColor: "rgb(245, 245, 245)"}} md={2} order={12}>
                            <h6 >spolu: <strong>{shopTotal.toFixed(2).toString().replace(/\./g, ',')} €</strong></h6>
                        </Col>
                    }
                </React.Fragment>
            )
        })
    }


    const ShowOrderDetails = ({passShops}) => {
        return passShops.map((shop, i) => {
            const { shopName, itemData, shopId } = shop
            return (
                <Container key={shopId} fluid>
                    <Row>
                        <Col md={2}><h5>{shopName}:</h5></Col>
                    </Row>
                    <Row>
                        <ShowItemDataForOrder passItemData={itemData} />
                    </Row>
                    {passShops[i+1] && 
                    <hr />}
                </Container>
            )
        })
    }

    const ShowBuyerDetails = ({passUserInformation, buyerId}) => {
        const { fullName, phone, address, email } = passUserInformation
        return (
            <div className="text-center" key={buyerId}>
                <Row>
                    <Col md={2}><strong>{fullName}</strong></Col>
                    <Col md={2}><strong>{phone}</strong></Col>
                    <Col md={3}><strong>{email}</strong></Col>
                    <Col md={3}><strong>{address}</strong></Col>
                </Row>
                <hr />
            </div>
        )
    }

    const setFilter = (orders) => {
        const isStatusFilter = (typeof filterByStatus === 'string' && filterByStatus !== 'vsetky')
        const newOrdersData = orders.filter(data => {
            if (
                (moment(data.createdAt).toISOString() <= moment(maxDate).toISOString()) && 
                (moment(data.createdAt).toISOString() >= moment(minDate).toISOString()) &&
                ((isStatusFilter && data.status === filterByStatus) || !isStatusFilter)
            ) {
                return data
            }
        })
        return newOrdersData
    }

    const handleDeleteModal = (e, id) => {
        e.stopPropagation()
        let expandObj = {}
        const oldValue = expandedObj[id] ?? false
        expandObj[id] = oldValue

        setExpandedObj({...expandedObj, ...expandObj})
        setPassDeleteId(id)
        setShowDeleteModal(true)
    }

    const ShowOrders = () => {
        const filteredData = setFilter(ordersData)
        return filteredData.map(order => {
            const { _id, orderId, userInformation, result, createdAt, status, shops, userId: buyerId, deliveryType, paymentType, deliveryPrice } = order
            const statusColor = status === 'vytvorena' ? 'orange' : status === 'zaplatena' ? 'green' : status === 'odmietnuta' ? 'orangered' : status === 'ocakavana' ? '#D4A121' : status === 'prevodom' ? '#6B3030' : status === 'dobierka' ? '#2B371B' : status === 'odoslana' ? 'navy' : 'black';
            return (
                <tbody key={orderId}>
                    <tr onClick={() => handleExpanded(_id)}>
                        <td>{orderId}</td>
                        <td>{moment(createdAt).format("DD MMM YYYY, HH:mm")}</td>
                        <td>{result && result.toFixed(2).toString().replace(/\./g,',')} €</td>
                        <td>{deliveryType === 'osobny' ? 'osobny odber' : deliveryType}{deliveryPrice ? ` - ${Number(deliveryPrice).toFixed(2).toString().replace(/\./g, ',')} €` : ''}</td>
                        <td>{paymentType}</td>
                        <td style={{color: statusColor}}>
                            {isOwner ?
                            <Form.Control
                                style={{width: '80%', float: 'left', 
                                    backgroundColor: statusObj[_id] === 'vytvorena' ? 'orange' : statusObj[_id] === 'zaplatena' ? 'green' : statusObj[_id] === 'odmietnuta' ? 'orangered' : statusObj[_id] === 'ocakavana' ? '#D4A121' : statusObj[_id] === 'prevodom' ? '#6B3030' : statusObj[_id] === 'dobierka' ? '#2B371B' : statusObj[_id] === 'odoslana' ? 'navy' : statusColor, 
                                    color: "whitesmoke"}}
                                as="select"
                                value={statusObj[_id] || status}
                                onChange={(e) => handleStatus(e, _id)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option>zaplatena</option>
                                <option>odmietnuta</option>
                                <option>ocakavana</option>
                                <option>prevodom</option>
                                <option>dobierka</option>
                                <option>odoslana</option>
                            </Form.Control> : <strong style={{color: statusColor}}>{status}</strong>}
                            {isOwner &&
                                <BsTrashFill style={{float: "right", cursor: 'pointer', marginRight: '6px', color: "#333333"}} onClick={(e) => handleDeleteModal(e, _id)} />
                            }
                        </td>
                    </tr>
                    {expandedObj[_id] &&
                    <tr style={{backgroundColor: status === 'odmietnuta' ? '#ffecec' : 'rgb(250, 250, 250)' }}>
                        <td colSpan="6">
                            <ShowBuyerDetails passUserInformation={userInformation} buyerId={buyerId} />
                            <ShowOrderDetails passShops={shops} />
                        </td>    
                    </tr>}
                </tbody>
            )
        })
    }

    return (
        <>
        {isOwner && showDeleteModal &&
            <DeleteModal deleteId={passDeleteId} setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} />
        }
        <Row className="justify-content-center text-center mt-4 mx-2">
            <Col md={3} className="text-center">
                <InputGroup>
                    <strong>Od: </strong>&nbsp;&nbsp;
                    <DatePicker className="text-center" dateFormat="dd.MM.yyyy" maxDate={new Date()} selected={minDate} onChange={date => setMinDate(date)} />
                </InputGroup>    
            </Col>
            <Col md={3} className="text-center">
                <InputGroup>
                    <strong>Do: </strong>&nbsp;&nbsp;
                    <DatePicker className="text-center" dateFormat="dd.MM.yyyy" maxDate={new Date()} selected={maxDate} onChange={date => setMaxDate(date)} />
                </InputGroup>
            </Col>
            <Col md={3} className="text-center">
                <InputGroup>
                    <strong style={{marginTop: '5px'}}>Stav:</strong>&nbsp;&nbsp;
                    <Form.Control
                        as="select"
                        value={filterByStatus}
                        onChange={(e) => setFilterByStatus(e.target.value)}
                    >
                        <option>vsetky</option>
                        <option>zaplatena</option>
                        <option>odmietnuta</option>
                        <option>ocakavana</option>
                        <option>prevodom</option>
                        <option>dobierka</option>
                        <option>odoslana</option>
                    </Form.Control>
                </InputGroup>
            </Col>
        </Row>
        <Table style={{backgroundColor: "whitesmoke"}} striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Datum</th>
                    <th>Total</th>
                    <th>Doručenie</th>
                    <th>Platobná metóda</th>
                    <th>Stav</th>
                </tr>
            </thead>
            <ShowOrders />
        </Table>    
        </>
    )
}