import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';

import Table from 'react-bootstrap/Table'

export default () => {
    const [ordersData, setOrdersData] = useState([])
    const [shippedObj, setShippedObj] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [expandedObj, setExpandedObj] = useState({})

    useEffect(() => {
        axios.get(`http://localhost:5000/orders`)
            .then(res => setOrdersData(res.data))
            .catch(err => err && console.log(err.data))
    }, [])

    const handleShipping = (e, _id) => {
        e.stopPropagation()
        const newVal = e.target.checked
        let newObj = {}
        let expandObj = {}

        newObj[_id] = newVal
        setShippedObj({...shippedObj, ...newObj})

        const oldValue = false
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

    const ShowOrders = () => {
        return ordersData.map(order => {
            const {_id, orderId, userInformation, createdAt, status, shops, isShipped} = order
            const {fullName, email, phone, address} = userInformation
            const statusColor = status === 'vytvorena' ? 'orange' : status === 'zaplatena' ? 'green' : status === 'odmietnuta' ? 'red' : 'black';
            return (
                <tbody key={orderId}>
                    <tr onClick={() => handleExpanded(_id)}>
                        <td>{orderId}</td>
                        <td>{email}</td>
                        <td>{moment(createdAt).format("DD MMM YYYY, HH:mm:ss")}</td>
                        <td style={{color: statusColor}}>{(shippedObj[_id] ?? isShipped) ? <em style={{color: 'blue', float:'left'}}>odoslana</em> : status}
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
                            />
                        </td>
                    </tr>
                    {expandedObj[_id] &&
                    <tr >
                        <td className="text-center" colSpan="4">
                            lalala<br/>lalalaa<br/>sksakmfas
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
                    <th>Stav</th>
                </tr>
            </thead>
                <ShowOrders />
        </Table>    
    )
}