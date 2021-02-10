import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';

import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

export default ({userId, isOwner}) => {
    const [ordersData, setOrdersData] = useState([])
    const [shippedObj, setShippedObj] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [expandedObj, setExpandedObj] = useState({})

    // TODO: pridat moznost znovu zaplatit pri rejected order

    useEffect(() => {
        axios.get(`http://localhost:5000/orders`)
            .then(res => {
                const result = res.data
                const validatedOrdersData = isOwner ? result : result.filter(obj => obj.userId === userId)
                setOrdersData(validatedOrdersData)
            })
            .catch(err => err && console.log(err.data))
    }, [])

    const handleShipping = (e, _id) => {
        e.stopPropagation()
        const newVal = e.target.checked
        let newObj = {}
        let expandObj = {}

        newObj[_id] = newVal
        setShippedObj({...shippedObj, ...newObj})

        const oldValue = expandedObj[_id] ?? false
        expandObj[_id] = oldValue
        setExpandedObj({...expandedObj, ...expandObj})

        axios.put(`http://localhost:5000/orders/${_id}/update-shipped/`, {isShipped: newVal})
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
        const { fullName, email, phone, address, iban } = passUserInformation
        return (
            <div className="text-center" key={buyerId}>
                <Row>
                    <Col md={{span: 2, offset: 1}}><strong>{fullName}</strong></Col>
                    <Col md={2}><strong>{phone}</strong></Col>
                    <Col md={3}><strong>{address}</strong></Col>
                    <Col md={{span: 3}}><strong>{iban ?? 'IBAN NENAJDENY'}</strong></Col>
                </Row>
                <hr />
            </div>
        )
    }

    const ShowOrders = () => {
        return ordersData.map(order => {
            const { _id, orderId, userInformation, createdAt, status, shops, isShipped, total, userId: buyerId } = order
            const { email } = userInformation
            const statusColor = status === 'vytvorena' ? 'orange' : status === 'zaplatena' ? 'green' : status === 'odmietnuta' ? 'red' : 'black';
            return (
                <tbody key={orderId}>
                    <tr onClick={() => handleExpanded(_id)}>
                        <td>{orderId}</td>
                        <td>{email}</td>
                        <td>{moment(createdAt).format("DD MMM YYYY, HH:mm:ss")}</td>
                        <td>{total.toFixed(2).toString().replace(/\./g,',')} €</td>
                        <td style={{color: statusColor}}>{(shippedObj[_id] ?? isShipped) ? <em style={{color: 'blue', float:'left'}}>odoslana</em> : status}
                            {status === 'zaplatena' && isOwner &&
                            <input 
                                style={{
                                    float: 'right', 
                                    cursor: 'pointer',
                                    paddingBottom: '-50px'
                                }}
                                type='checkbox'
                                name='checkShipping'
                                checked={shippedObj[_id] ?? isShipped}
                                onChange={(e) => handleShipping(e, _id)}
                            />}
                        </td>
                    </tr>
                    {expandedObj[_id] &&
                    <tr style={{backgroundColor: status === 'zaplatena' ? '#f4fff4' : status === 'odmietnuta' ? '#ffecec' : 'rgb(250, 250, 250)' }}>
                        <td colSpan="5">
                            <ShowBuyerDetails passUserInformation={userInformation} buyerId={buyerId} />
                            <ShowOrderDetails passShops={shops} />
                        </td>    
                    </tr>}
                </tbody>
            )
        })
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Datum</th>
                    <th>Total</th>
                    <th>Stav</th>
                </tr>
            </thead>
            <ShowOrders />
        </Table>    
    )
}