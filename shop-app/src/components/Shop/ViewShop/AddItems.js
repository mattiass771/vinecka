import React, { useState, useEffect } from "react";
import axios from "axios";

import Dropzone from "react-dropzone-uploader";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup"

import { BsUpload } from "react-icons/bs";
import {FaCheckSquare} from "react-icons/fa"

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

export default ({ showAddItems, setShowAddItems, shopData }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [canSaveItem, setCanSaveItem] = useState(false);
  const [localUploading, setLocalUploading] = useState(false)
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState("")
  const [sizesArr, setSizesArr] = useState([])
  const [colorsArr, setColorsArr] = useState([])

  const shopId = shopData._id;

  const resetPropsOnHide = () => {
    setImageLink("")
    setItemName("")
    setPrice("")
    setDescription("")
    setCanSaveItem(false)
    setLocalUploading(false)
    setShowAddItems(false)
  }

  const getImage = (image) => {
    try {
      const img = require(`../../../../../src/uploads/${image}`);
      return img;
    } catch {
      return null;
    }
  };

  const handleSaveItem = () => {
    if (imageLink && description && price && itemName) {
      axios
        .post(`http://localhost:5000/shop/${shopId}/add-item`, {
          itemName,
          price,
          description,
          imageLink,
          sizes: sizesArr,
          colors: colorsArr
        })
        .then(() => setShowAddItems(false))
        .catch((err) => err && console.log(err));
    }
  };

  const deleteFile = (file) => {
    axios
      .get(`http://localhost:5000/deleteFile/${shopId}`, {
        params: file
      })
      .then(() => 
        {return}
      )
      .catch((err) => err && console.log(err));
  };
  useEffect(() => {
    const isAlready = getImage(imageLink) ? getImage(imageLink) : imageLink;
    if (isAlready && imageLink && description && price && itemName) {
      setCanSaveItem(true);
    }
  }, [imageLink, description, price, itemName]);

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: `http://localhost:5000/fileUpload/${shopId}` };
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === "removed") {
      deleteFile(meta);
    }
    if (status === "done") {
      setImageLink(`${shopId}__${meta.name}`);
    }
  };

  const showElements = (arr, setFunction) => {
    return arr.map((val, i) => 
      i > 0 ? <Button onClick={() => setFunction(arr.filter(el => el !== val))} style={{marginLeft:"2px"}} size="sm" variant="outline-dark" key={val}>{val}</Button> : <Button onClick={() => setFunction(arr.filter(el => el !== val))} style={{marginLeft:"2px"}} size="sm" variant="outline-dark" key={val}>{val}</Button>
    )
  }

  const handleSizesKeyPress = (e) => {
    if (e.charCode === 13) {
      e.preventDefault()
      handleSizes()
    } else return
  }

  const handleColorsKeyPress = (e) => {
    if (e.charCode === 13) {
      e.preventDefault()
      handleColors()
    } else return
  }

  const handleColors = () => {
    const color = `${colors.substring(0,1).toUpperCase()}${colors.substring(1)}`
    const arrCopy = new Set([...colorsArr, color])
    const sorted = [...arrCopy]
    sorted.sort()
    setColorsArr(sorted)
    setColors('')
  }

  const handleSizes = () => {
    const arrCopy = [...sizesArr, sizes.toUpperCase()]
    arrCopy.sort()
    arrCopy.sort((a,b) => a-b)

    const copySet = new Set([...sizesArr, sizes.toUpperCase()])
    const sortBy = ['XXXXS', 'XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL']
    const sorted = sortBy.filter(val => copySet.has(val))
    const final = new Set([...sorted, ...arrCopy])
    setSizesArr([...final])
    setSizes('')
  }

  return (
    <Modal show={showAddItems} onHide={() => resetPropsOnHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Add an item to your shop.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-md-center">
          <Col className="form-group">
            <label htmlFor="shopName">Name your item:</label>
            <input
              value={itemName}
              className="form-control"
              type="text"
              name="shopName"
              onChange={(e) => setItemName(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              value={price}
              className="form-control"
              type="text"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <label htmlFor="sizes">Sizes:</label>
          </Col>
        </Row>
        <Row>
          <Col className="form-group">
          <InputGroup>
              <input
                value={sizes}
                className="form-control"
                type="text"
                name="sizes"
                onChange={(e) => setSizes(e.target.value)}
                onKeyPress={e => handleSizesKeyPress(e)}
              />
              <Button onClick={handleSizes} variant="dark">
                <FaCheckSquare style={{marginBottom:"3px",marginLeft:"-1px"}} />
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <p>{showElements(sizesArr, setSizesArr)}</p>
            <p className="text-center" style={{fontSize:"75%"}}><em>You can add your sizes in whatever format, its completely up to you. Click to remove added sizes.</em></p>
          </Col>
        </Row>
        <Row>
          <Col className="form-group">
          <InputGroup>
              <input
                value={colors}
                className="form-control"
                type="text"
                name="colors"
                onChange={(e) => setColors(e.target.value)}
                onKeyPress={e => handleColorsKeyPress(e)}
              />
              <Button onClick={handleColors} variant="dark">
                <FaCheckSquare style={{marginBottom:"3px",marginLeft:"-1px"}} />
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <p>{showElements(colorsArr, setColorsArr)}</p>
            <p className="text-center" style={{fontSize:"75%"}}><em>Click to remove added colors.</em></p>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="form-group">
            <label htmlFor="price">Description:</label>
            <textarea
              value={description}
              className="form-control"
              name="description"
              type="text"
              style={{ resize: "none", minHeight: "100px" }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="form-group">
            <label htmlFor="price">Image link:</label>
            <input
              value={imageLink}
              className="form-control"
              type="text"
              name="imageLink"
              onChange={(e) => setImageLink(e.target.value)}
            />
            <p className="text-center" style={{fontSize:"75%"}}><em>Because we are a small startup and we offer our services completely free for now, we encourage you to use some external image upload service (<a target="_blank" rel="noopener noreferrer" href="https://www.dropbox.com"><strong>dropbox</strong></a>, <a target="_blank" rel="noopener noreferrer" href="https://www.imgur.com"><strong>imgur</strong></a>, <a target="_blank" rel="noopener noreferrer" href="https://www.gyazo.com"><strong>gyazo</strong></a> and many others... ) and paste direct link to your image here. Thank you in advance! (Of course, if you want to upload images directly to our server, just click the link below.)</em></p>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="text-center">
            <Button variant="dark" onClick={() => setLocalUploading(true)}>Upload directly!</Button>
          </Col>
        </Row>
        <br />
        {localUploading ? 
        <SlideDown className={"my-dropdown-slidedown"}>
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
                  Drop or click to choose image.
                  <br />
                  <BsUpload />
                </p>
              )}
              classNames={{
                dropzone: "dropzoning"
              }}
            />
          </Col>
        </Row></SlideDown> : null
        }
        
      </Modal.Body>
      <Modal.Footer>
        {canSaveItem ? (
          <Button variant="dark" onClick={handleSaveItem}>
            Save Item
          </Button>
        ) : (
          <Button disabled variant="dark">
            Save Item
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
