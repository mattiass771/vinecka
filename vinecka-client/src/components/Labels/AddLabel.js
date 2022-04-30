import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import "react-datepicker/dist/react-datepicker.css";
import { Col, Row } from 'react-bootstrap'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import Dropzone from "react-dropzone-uploader";
import { BsUpload } from "react-icons/bs";

const token = process.env.REACT_APP_API_SECRET
const awstoken = process.env.REACT_APP_S3_TOKEN

export default ({labelPopup, setLabelPopup, refresh, setRefresh}) => {
    const [name, setName] = useState('')
    const [idFromName, setIdFromName] = useState('')
    const [price, setPrice] = useState(0)
    const [imageLink, setImageLink] = useState('')

    useEffect(() => {
        if (name) {
            const setNewId = name.replace(/\s/g, '-').toLowerCase()
            setIdFromName(setNewId)
        }
    }, [name])

    const deleteFile = (file) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/deleteFile/${idFromName}`, {token}, {
            params: file
          })
          .then(() => 
            {return}
          )
          .catch((err) => err && console.log(err));
    };

    const getUploadParams = ({ meta }) => {
        return { url: `${process.env.REACT_APP_BACKEND_URL}/fileUpload/${idFromName}?awstoken=${awstoken}` };
    };

    const handleChangeStatus = ({ meta, file }, status) => {
        if (status === "removed") {
        deleteFile(meta);
        }
        if (status === "done") {
        setImageLink(`${idFromName}-${(meta.name).toString().replace(/\s/g, '-').toLowerCase()}`);
        }
    };

    const handleSave = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/labels/add`, {name, price, imageLink, token})
            .then(res => {
                setRefresh(!refresh)
                setLabelPopup(false)
            })
            .catch(err => err && err.data)
    }
    
    return (
        <Modal enforceFocus={false} show={labelPopup} onHide={() => setLabelPopup(false)}>
            <Modal.Body className="text-center">
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        <label htmlFor="name">Nazov etikety:</label>
                        <input 
                            name="name"
                            className="form-control text-center"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="povinne"
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        <label htmlFor="price">Cena za etiketu:</label>
                        <input 
                            name="price"
                            className="form-control text-center"
                            value={price}
                            onChange={(e) => setPrice((e.target.value).replace(',', '.'))}
                            placeholder="volitelne"
                        />
                    </Col>
                </Row>
                <br />
                <SlideDown className={"my-dropdown-slidedown"}>
                {name &&
                <Row>
                    <Col>
                        <Dropzone
                            maxFiles={1}
                            multiple={false}
                            canCancel={false}
                            getUploadParams={getUploadParams}
                            onChangeStatus={handleChangeStatus}
                            accept="image/*"
                            inputContent={() => (
                                <p
                                className="text-center"
                                key="label"
                                style={{ marginTop: "15px", color: "#333333" }}
                                >
                                Pridat obrazok etikety. <br /> (povinne)
                                <br />
                                <BsUpload />
                                </p>
                            )}
                            classNames={{
                                dropzone: "dropzoning"
                            }}
                        />
                    </Col>
                </Row>}
            </SlideDown>
            <br />
            {(name && imageLink) ?
                <Button variant="dark" onClick={() => handleSave()}>
                    Pridat
                </Button> :
                <Button disabled variant="dark">
                    Pridat
                </Button>
            }&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="dark" onClick={() => setLabelPopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
        )
}