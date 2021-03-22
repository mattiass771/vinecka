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
import { MdDelete } from "react-icons/md";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import defaultImage from "../../../default.jpg";

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfig } from '../../../config/options'

import options from '../../../config/options';

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
  const [overviewImage, setOverviewImage] = useState('');
  const [showImageFromDb, setShowImageFromDb] = useState(shopData.imageLink ? shopData.imageLink : '')
  const [localUploadingTitle, setLocalUploadingTitle] = useState(false)
  const [localUploadingOverview, setLocalUploadingOverview] = useState(false)
  const [textColor, setTextColor] = useState(shopData.textColor)

  ClassicEditor.defaultConfig = editorConfig

  useEffect(() => {
    if (textColor !== shopData.textColor) {
      axios
      .put(
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop/textColor/${textColor}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    } 
  }, [textColor])

  const getImage = (image) => {
    try {
      const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
      return img;
    } catch {
      return null;
    }
  };

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: `https://mas-vino.herokuapp.com/fileUpload/${shopData._id}` };
  };

  const deleteFile = (file) => {
    axios
      .get(`https://mas-vino.herokuapp.com/deleteFile/${shopData._id}`, {
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
      if (localUploadingTitle) {
        setImageLink(`${shopData._id}-${meta.name.replace(/_/g,'-')}`);
      } else if (localUploadingOverview) {
        setOverviewImage(`${shopData._id}-${meta.name.replace(/_/g,'-')}`);
      }
    }
  };

  const deleteCard = (e) => {
    axios
        .delete(
        `https://mas-vino.herokuapp.com/shop/${shopData._id}`
        )
        .then(() => history.push(`/vinarne`))
        .catch((err) => err && console.log(`Error ${err}`));
  };

  useEffect(() => {
    if (imageLink) {
      axios
      .put(
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop/imageLink/${imageLink}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    } 
  }, [imageLink])

  useEffect(() => {
    if (overviewImage) {
      axios
      .put(
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop/overviewImage/${overviewImage}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    } 
  }, [overviewImage])

  useEffect(() => {
    axios
      .get(`https://mas-vino.herokuapp.com/shop/link/${currentUrl}`)
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
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop/url/${currentUrl}`
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
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop/shopName/${shopName}`
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
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop-description/`,{description}
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
        `https://mas-vino.herokuapp.com/shop/${shopData._id}/update-shop/owner/${owner}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && handleError(err));
    }
  }

  const handleLocalUploadingOverview = () => {
    setLocalUploadingTitle(false)
    setLocalUploadingOverview(true)
  }

  const handleLocalUploadingTitle = () => {
    setLocalUploadingOverview(false)
    setLocalUploadingTitle(true)
  }

  return (
    <Jumbotron style={{
                      color: textColor === 'white' ? 'whitesmoke' : '#333333', 
                      fontSize: '120%',
                      background: `url(${showImageFromDb ? getImage(showImageFromDb) : defaultImage}) center center no-repeat`, 
                      backgroundSize: 'cover'                  
                      }} fluid>
                        
    <Container className="text-center">
      {!editMode ?
        <Row style={{padding: '15px', backgroundColor: textColor === 'white' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)', borderRadius: '7.5px'}}>
          <Col>
            <h2>{shopName}</h2>
            <p dangerouslySetInnerHTML={{__html: description}}></p>
            <p>{owner}</p>
          </Col>
        </Row>
        :
        <>
          <Row className="justify-content-md-center pb-2">
            <Col className="text-center">
              <Button variant={`${textColor === 'white' ? 'light' : 'dark'}`} onClick={() => setTextColor('white')} >Biely text</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button variant={`${textColor === 'white' ? 'dark' : 'light'}`} onClick={() => setTextColor('black')} >Cierny text</Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button
              onClick={(e) => deleteCard(e)}
              style={{
                width: "40px",
                height: "40px",
                marginBottom: "-40px",
                zIndex: "+5"
              }}
              variant="outline-danger"
            >
              <MdDelete style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
            </Button>
            <Col xs={8}>
              <input 
                className={'form-control text-center'}
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)} 
                onBlur={handleShopNameChange}
                name="shopName"
                placeholder="Nazov"
              />
              <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                      const data = editor.getData()
                      setDescription(data)
                  }}
                  onBlur={handleDescriptionChange}
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
              <Button variant="dark" onClick={() => handleLocalUploadingTitle()}>Upload title image</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button variant="dark" onClick={() => handleLocalUploadingOverview()}>Upload overview image</Button>
            </Col>
          </Row>
        </>
        }
        {((localUploadingTitle || localUploadingOverview) && editMode) ? 
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
                  Drop or click to choose {localUploadingTitle ? 'title' : 'overview'} image.
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