import React, {useState} from 'react'
import axios from 'axios'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import Dropzone from "react-dropzone-uploader";
import { BsUpload } from "react-icons/bs";

import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const IMAGE_PREFIX = 'homescreen-event-image'

export default ({eventsPopup, setEventsPopup, forceRefresh, setForceRefresh, eventsImage, eventsText}) => {
    const [description, setDescription] = useState(eventsText)
    const [imageLink, setImageLink] = useState(eventsImage)

    const getImage = (image) => {
        try {
            console.log(image)
          const img = require(`../../../../src/uploads/${image.replace(/_/g, '-')}`);
          return img;
        } catch {
          return null;
        }
    };

    const deleteFile = (file) => {
        axios
          .get(`https://mas-vino.herokuapp.com/deleteFile/${IMAGE_PREFIX}`, {
            params: file
          })
          .then(() => 
            {return}
          )
          .catch((err) => err && console.log(err));
    };

    const getUploadParams = ({ meta }) => {
        return { url: `https://mas-vino.herokuapp.com/fileUpload/${IMAGE_PREFIX}` };
    };

    const handleChangeStatus = ({ meta, file }, status) => {
        if (status === "removed") {
        deleteFile(meta);
        }
        if (status === "done") {
        setImageLink(`${IMAGE_PREFIX}-${meta.name}`);
        }
    };

    const handleSave = () => {
        axios.put(`https://mas-vino.herokuapp.com/home/events-description`, { descriptionEvents: description, imageLinkEvents: imageLink })
            .then(res => {
                console.log(res.data)
                setForceRefresh(!forceRefresh)
                setEventsPopup('')
            })
            .catch(err => err && err.data)
    }

    return (
        <Modal show={eventsPopup} onHide={() => setEventsPopup(false)}>
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
                <SlideDown className={"my-dropdown-slidedown"}>
                {
                imageLink ? 
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
                                Pridat obrazok udalosti. <br /> (povinne)
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
            {(description && imageLink) ?
                <Button variant="dark" onClick={() => handleSave()}>
                    Upravit
                </Button> :
                <Button disabled variant="dark">
                    Upravit
                </Button>
            }&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="dark" onClick={() => setEventsPopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
    )
}