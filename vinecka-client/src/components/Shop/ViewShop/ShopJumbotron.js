import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import InputGroup from "react-bootstrap/InputGroup"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

import Dropzone from "react-dropzone-uploader";

import { BsUpload } from "react-icons/bs";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import options from '../../../config/options';
const {MAX_HEIGHT_JUMBO} = options

// CreateShop.js
export default ({ shopData, isOwner }) => {
  let history = useHistory();
  const url = shopData.url;
  const [currentUrl, setCurrentUrl] = useState(url)
  const [newUrl, setNewUrl] = useState(url)
  const [isUrlAvailible, setIsUrlAvailible] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [shopName, setShopName] = useState(shopData.shopName)
  const [error, setError] = useState('')
  const [description, setDescription] = useState(shopData.description)
  const [owner, setOwner] = useState(shopData.owner)
  const [imageLink, setImageLink] = useState('');
  const [showImageFromDb, setShowImageFromDb] = useState(shopData.imageLink ? shopData.imageLink : '')
  const [localUploading, setLocalUploading] = useState(false)

  const getImage = (image) => {
    try {
      const img = require(`../../../../../src/uploads/${image}`);
      return img;
    } catch {
      return null;
    }
  };

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: `http://localhost:5000/fileUpload/${shopData._id}` };
  };

  const deleteFile = (file) => {
    axios
      .get(`http://localhost:5000/deleteFile/${shopData._id}`, {
        params: file
      })
      .then(() => 
        {return}
      )
      .catch((err) => err && console.log(err));
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === "removed") {
      deleteFile(meta);
    }
    if (status === "done") {
      setImageLink(`${shopData._id}-${meta.name.replace(/_/g,'-')}`);
    }
  };

  useEffect(() => {
    if (imageLink) {
      axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-shop/imageLink/${imageLink}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    }
  }, [imageLink])

  useEffect(() => {
    axios
      .get(`http://localhost:5000/shop/link/${currentUrl}`)
      .then((res) => {
        if (res.data && currentUrl !== newUrl) setIsUrlAvailible(false)
        else setIsUrlAvailible(true)
      })
      .catch((err) => err && console.log(err))
  }, [currentUrl])

  const handleError = (error) => {
    console.log('Error connecting to the database: ', error)
    setError('Chyba pri aktualizacii dat, data neboli upravene v databaze.')
    return setTimeout(() => setError(''), 5000)
  }

  const handleUrlChange = () => {
    if (isUrlAvailible) {
      axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-shop/url/${currentUrl}`
      )
      .then((res) => {
        return setNewUrl(currentUrl);
      })
      .catch((err) => err && handleError(err))
      .then(() => history.push(`/${currentUrl}`))
    }
  }

  const handleShopNameChange = () => {
    if (shopName) {
      axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-shop/shopName/${shopName}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    }
  }

  const handleDescriptionChange = () => {
    if (description) {
      axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-shop/description/${description}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    }
  }

  const handleOwnerChange = () => {
    if (owner) {
      axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-shop/owner/${owner}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    }
  }

  return (
    <Jumbotron style={{background: `url(${getImage(showImageFromDb) ? getImage(showImageFromDb) : ''}) no-repeat`, backgroundSize: 'cover' }} fluid>
      <Container className="text-center">
      {!editMode ?
        <Row>
          <Col>
            <h2>{shopName}</h2>
            <p>{description}</p>
            <p>{owner}</p>
            <p><a className="link-no-deco" href="localhost:3000/testshop">www.vimko.sk/{currentUrl}</a></p>
          </Col>
        </Row>
        :
        <>
          <Row className="justify-content-center">
            <Col xs={8}>
              <input 
                className={'form-control text-center'}
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)} 
                onBlur={handleShopNameChange}
                name="shopName"
                placeholder="Nazov"
              />
              <textarea 
                style={{minHeight: '100px'}}
                className={'form-control text-center'}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                onBlur={handleDescriptionChange}
                name="description"
                placeholder="Popis"
              />
              <input 
                className={'form-control text-center'}
                value={owner} 
                onChange={(e) => setOwner(e.target.value)} 
                onBlur={handleOwnerChange}
                name="owner"
                placeholder="Majitel"
              />
              <div>
                <InputGroup>
              <p style={{marginRight: 10, marginTop: 5}}>www.vimko.sk/</p>
                  <input 
                    className={isUrlAvailible ? 'form-control text-center' : 'text-center form-control invalid-input'}
                    value={currentUrl} 
                    onChange={(e) => setCurrentUrl(e.target.value)} 
                    name="currentUrl"
                    onBlur={handleUrlChange}
                  />
                </InputGroup>
                {!isUrlAvailible && <p style={{color: "red"}}>Adresa uz existuje, vyberte prosim inu.</p>}
              </div>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col className="text-center">
              <Button variant="dark" onClick={() => setLocalUploading(!localUploading)}>Upload image</Button>
            </Col>
          </Row>
        </>
        }
        {(localUploading && editMode) ? 
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
        {isOwner &&
        <Row className="mt-4">
          <Col>
            <Alert style={{display: `${error ? 'block' : 'none'}`}} variant="danger">{error}</Alert>
            {isUrlAvailible ? 
            <Button onClick={() => setEditMode(editMode ? false : true)} variant="dark">{editMode ? 'Hotovo' : 'Upravit'}</Button> :
            <Button disabled onClick={() => setEditMode(editMode ? false : true)} variant="dark">{editMode ? 'Hotovo' : 'Upravit'}</Button>}
          </Col>
        </Row>}
      </Container>
    </Jumbotron>
  );
};