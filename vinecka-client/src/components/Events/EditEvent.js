import React, {useState, useEffect} from 'react'
import axios from 'axios'
import moment from 'moment'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Col, Row } from 'react-bootstrap'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import Dropzone from "react-dropzone-uploader";
import { BsUpload } from "react-icons/bs";

export default ({eventPopup, setEventPopup, refresh, setRefresh, eventData}) => {
    const [startDate, setStartDate] = useState(moment(eventData.when, 'DD.MM.YYYY, HH:mm').valueOf());
    const [untilDate, setUntilDate] = useState(moment(eventData.until, 'DD.MM.YYYY, HH:mm').valueOf());

    const [name, setName] = useState(eventData.name)
    const [idFromName, setIdFromName] = useState(eventData.idFromName)
    const [link, setLink] = useState(eventData.link)
    const [description, setDescription] = useState(eventData.description)
    const [imageLink, setImageLink] = useState(eventData.imageLink)
    const [where, setWhere] = useState(eventData.where)
    const [when, setWhen] = useState(eventData.when)
    const [until, setUntil] = useState(eventData.until)

    const getImage = (image) => {
        try {
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
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

    useEffect(() => {
        setWhen(moment(startDate).format('DD.MM.YYYY, HH:mm'))
        if (untilDate <= startDate) {
            setUntilDate('')
        }
        console.log(until)
    },[startDate])

    useEffect(() => {
        if (untilDate > startDate) {
            setUntil(moment(untilDate).format('DD.MM.YYYY, HH:mm'))
        } else {
            setUntil('')
        }
        console.log(until)
    },[untilDate])

    const handleSave = () => {
        axios.post(`https://mas-vino.herokuapp.com/events/update-event/${eventData._id}`, {name, link, description, imageLink, where, when})
            .then(res => {
                console.log(res.data)
                setRefresh(!refresh)
                setEventPopup('')
            })
            .catch(err => err && err.data)
    }
    
    return (
        <Modal show={eventPopup} onHide={() => setEventPopup(false)}>
            <Modal.Body className="text-center">
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        <label htmlFor="name">Nazov udalosti:</label>
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
                        <label htmlFor="where">Miesto udalosti:</label>
                        <input 
                            name="where"
                            className="form-control text-center"
                            value={where}
                            onChange={(e) => setWhere(e.target.value)}
                            placeholder="volitelne"
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        <label htmlFor="link">Externy link udalosti:</label>
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
                        Cas a datum udalosti (povinne): <DatePicker className="text-center" minDate={new Date()} dateFormat="dd.MM.yyyy HH:mm" showTimeSelect selected={startDate} onChange={date => setStartDate(date)} />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        Dokedy bude udalost trvat (volitelne): <DatePicker className="text-center" dateFormat="dd.MM.yyyy HH:mm" showTimeSelect minDate={startDate} selected={untilDate} onChange={date => setUntilDate(date)} />
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
                    <img alt="event-image" style={{height:'110px', width: '160px'}} src={getImage(imageLink) ? getImage(imageLink) : imageLink} />
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
            {(name && description && imageLink && when) ?
                <Button variant="dark" onClick={() => handleSave()}>
                    Upravit
                </Button> :
                <Button disabled variant="dark">
                    Upravit
                </Button>
            }&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="dark" onClick={() => setEventPopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
        )
}