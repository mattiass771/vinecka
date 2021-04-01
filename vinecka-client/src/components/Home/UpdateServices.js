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

const IMAGE_PREFIX = 'homescreen-service-image'

export default ({servicesPopup, setServicesPopup, forceRefresh, setForceRefresh, servicesImage, servicesText}) => {
    const description = servicesText
    const [imageLink, setImageLink] = useState(servicesImage)

    const getImage = (image) => {
        try {
            console.log(image)
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
          return img;
        } catch {
          return null;
        }
    };

    const deleteFile = (file) => {
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/deleteFile/${IMAGE_PREFIX}`, {
            params: file
          })
          .then(() => 
            {return}
          )
          .catch((err) => err && console.log(err));
    };

    const getUploadParams = ({ meta }) => {
        return { url: `${process.env.REACT_APP_BACKEND_URL}/fileUpload/${IMAGE_PREFIX}` };
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
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/home/services-description`, { descriptionServices: description, imageLinkServices: imageLink })
            .then(res => {
                console.log(res.data)
                setForceRefresh(!forceRefresh)
                setServicesPopup('')
            })
            .catch(err => err && err.data)
    }

    return (
        <Modal show={servicesPopup} onHide={() => setServicesPopup(false)}>
            <Modal.Body className="text-center">
                <SlideDown className={"my-dropdown-slidedown"}>
                {
                imageLink ? 
                <Row className="justify-content-center text-center">
                    <Col className="form-group">
                    <img alt="update-services" style={{height:'110px', width: '160px'}} src={getImage(imageLink) ? getImage(imageLink) : imageLink} />
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
            <Button variant="dark" onClick={() => setServicesPopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
    )
}