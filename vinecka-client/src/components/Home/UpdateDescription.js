import React, {useState} from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

export default ({descriptionsPopup, setDescriptionsPopup, forceRefresh, setForceRefresh, descriptionsText}) => {
    const [description, setDescription] = useState(descriptionsText)

    const handleSave = () => {
        axios.put(`http://localhost:5000/home/general-description`, { descriptionGeneral: description })
            .then(res => {
                console.log(res.data)
                setForceRefresh(!forceRefresh)
                setDescriptionsPopup('')
            })
            .catch(err => err && err.data)
    }

    return (
        <Modal show={descriptionsPopup} onHide={() => setDescriptionsPopup(false)}>
            <Modal.Body className="text-center">
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        value={description}
                        className="form-control text-center"
                        name="description"
                        type="text"
                        style={{ resize: "none", minHeight: "400px" }}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="povinne"
                    />
                    </Col>
                </Row>
            <br />
            {description ?
                <Button variant="dark" onClick={() => handleSave()}>
                    Upravit
                </Button> :
                <Button disabled variant="dark">
                    Upravit
                </Button>
            }&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="dark" onClick={() => setDescriptionsPopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
    )
}