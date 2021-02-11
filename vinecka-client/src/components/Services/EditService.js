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

export default ({servicePopup, setServicePopup, refresh, setRefresh, serviceData}) => {
    const [name, setName] = useState(serviceData.name)
    const [idFromName, setIdFromName] = useState(serviceData.idFromName)
    const [link, setLink] = useState(serviceData.link)
    const [description, setDescription] = useState(serviceData.description)
    const [imageLink, setImageLink] = useState(serviceData.imageLink)

    const getImage = (image) => {
        try {
            console.log(image)
          const img = require(`../../../../src/uploads/${image.replace(/_/g, '-')}`);
          return img;
        } catch {
          return null;
        }
    };

    useEffect(() => {
        if (name) {
            const setNewId = name.replace(/\s/g, '-').toLowerCase()
            setIdFromName(setNewId)
        }
    }, [name])

    const deleteFile = (file) => {
        axios
          .get(`https://mas-vino.herokuapp.com/deleteFile/${idFromName}`, {
            params: file
          })
          .then(() => 
            {return}
          )
          .catch((err) => err && console.log(err));
    };

    const getUploadParams = ({ meta }) => {
        return { url: `https://mas-vino.herokuapp.com/fileUpload/${idFromName}` };
    };

    const handleChangeStatus = ({ meta, file }, status) => {
        if (status === "removed") {
        deleteFile(meta);
        }
        if (status === "done") {
        setImageLink(`${idFromName}-${meta.name}`);
        }
    };

    const handleSave = () => {
        console.log(serviceData)
        axios.post(`https://mas-vino.herokuapp.com/services/update-service/${serviceData._id}`, {name, link, description, imageLink})
            .then(res => {
                console.log(res.data)
                setRefresh(!refresh)
                setServicePopup('')
            })
            .catch(err => err && err.data)
    }
    
    return (
        <Modal show={servicePopup} onHide={() => setServicePopup(false)}>
            <Modal.Body className="text-center">
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        <label htmlFor="name">Nazov sluzby:</label>
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
                        <label htmlFor="link">Externy link sluzby:</label>
                        <input 
                            name="link"
                            className="form-control text-center"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="volitelne"
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        value={description}
                        className="form-control text-center"
                        name="description"
                        type="text"
                        style={{ resize: "none", minHeight: "200px" }}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="povinne"
                    />
                    </Col>
                </Row>
                <br />
                <SlideDown className={"my-dropdown-slidedown"}>
                {
                (name && imageLink) ? 
                <Row className="justify-content-center text-center">
                    <Col className="form-group">
                    <img style={{height:'110px', width: '160px'}} src={getImage(imageLink) ? getImage(imageLink) : imageLink} />
                    <Button onClick={() => setImageLink('')} variant="dark" size="sm" >Vymazat obrazok</Button>
                    </Col>
                </Row> :
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
                                Pridat obrazok sluzby. <br /> (povinne)
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
            {(name && description && imageLink) ?
                <Button variant="dark" onClick={() => handleSave()}>
                    Pridat
                </Button> :
                <Button disabled variant="dark">
                    Pridat
                </Button>
            }&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="dark" onClick={() => setServicePopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
        )
}