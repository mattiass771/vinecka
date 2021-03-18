import React, { useEffect, useState } from "react";

import ShowItem from '../Shop/ViewShop/ShowItem';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";

import {BsTrashFill} from "react-icons/bs";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

//Shop.js
export default ({ userData, shopData }) => {
  const [initialData, setInitialData] = useState([])
  const {userId} = userData

  const [wineTypes, setWineTypes] = useState([])
  const [typeFilter, setTypeFilter] = useState([])
  const [tasteFilter, setTasteFilter] = useState([])
  const [colorFilter, setColorFilter] = useState([])
  const [colorDrop, setColorDrop] = useState('')
  const [tasteDrop, setTasteDrop] = useState('')
  const [typeDrop, setTypeDrop] = useState('')

  const [selectedFilters, setSelectedFilters] = useState([])

  const recalculateTypeFilter = (typeArr) => {
    let wtSet = new Set()
      for (let el of typeArr) {
        if (el.length !== 0) {
          el.forEach(val => val && wtSet.add(`${val[0].toUpperCase()}${val.substring(1).toLowerCase()}`))
        }
      }
    return setWineTypes([...wineTypes, ...wtSet])
  }
  
  useEffect(() => {
    if (initialData.length === 0) {
      setInitialData(shopData)
      const allWineTypes = shopData.map(shop => {
        const {shopItems} = shop
        const getWineTypes = shopItems.map(wine => wine.type)
        return getWineTypes
      })
      recalculateTypeFilter(allWineTypes)
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSelectedFilters([...colorFilter, ...tasteFilter, ...typeFilter])
  }, [typeFilter, tasteFilter, colorFilter])
  
  const filterData = (items) => {      
    if (typeFilter.length !== 0 || tasteFilter.length !== 0 || colorFilter.length !== 0) {
      const filteredDataByColor = colorFilter.length !== 0 ? items.filter(item => {
        if (colorFilter.includes((item.color).toLowerCase().trim())) {
          return item
        } 
      }) : items
      const filteredDataByTaste = tasteFilter.length !== 0 ? filteredDataByColor.filter(item => {
        if (tasteFilter.includes((item.taste).toLowerCase().trim())) {
          return item
        } 
      }) : filteredDataByColor
      const filteredDataByType = typeFilter.length !== 0 ? filteredDataByTaste.filter(item => {
        if (typeFilter.includes((item.type).toLowerCase().trim())) {
          return item
        } 
      }) : filteredDataByTaste
      return filteredDataByType
    } else {
      return null
    }
  }

  const handleColorDrop = (val) => {
    setColorDrop(val)
    setColorFilter([...colorFilter, val.toLowerCase().trim()].sort())
  }

  const handleTasteDrop = (val) => {
    setTasteDrop(val)
    setTasteFilter([...tasteFilter, val.toLowerCase().trim()].sort())
  } 
  
  const handleTypeDrop = (val) => {
    setTypeDrop(val)
    setTypeFilter([...typeFilter, val.toLowerCase().trim()].sort())
  }

  const getAllWineTypes = () => {
    return wineTypes.sort().map(type => {
      return <option key={type.toLowerCase()}>{type}</option>
    })
  }

  const ShowWines = () => {
    return initialData.map((shop,i) => {
      const {shopItems, url, _id: shopId} = shop
      const filteredShopItems = filterData(shopItems)
      return (
        <ShowItem key={`${shopId}-${i}`} shopItems={filteredShopItems ? filteredShopItems : shopItems} url={url} shopId={shopId} userId={userId} setShouldReload={false} shouldReload={false} isOwner={false} />
      )
    })
  }

  const handleRemoveFilter = (e) => {
    const nodeId = e.currentTarget.id
    if (colorFilter.includes(nodeId.toLowerCase())) {
      setColorFilter(colorFilter.filter(data => data !== nodeId.toLowerCase()))
    }
    if (tasteFilter.includes(nodeId.toLowerCase())) {
      setTasteFilter(tasteFilter.filter(data => data !== nodeId.toLowerCase()))
    }
    if (typeFilter.includes(nodeId.toLowerCase())) {
      setTypeFilter(typeFilter.filter(data => data !== nodeId.toLowerCase()))
    }
  }

  const ShowSelectedFilters = () => {
    const output = selectedFilters.map(filter => {
      return (
        <React.Fragment key={filter.toLowerCase()}>
          {filter[0].toUpperCase()+filter.substring(1).toLowerCase()} 
          &nbsp;
          <a id={filter} onClick={(e) => handleRemoveFilter(e)} className="link-no-deco" href="#">
            <BsTrashFill style={{marginTop: "-2px"}} />
          </a>&nbsp;&nbsp;&nbsp;&nbsp;
        </React.Fragment>
      )
    })
    return output
  } 
  
  return (
    <Container>
      <Row className="mb-4 mt-4 text-center justify-content-center">
        <Col xs={4}><hr style={{backgroundColor: '#2b371b', height: '1px', marginTop: '22px'}} /></Col>
        <Col xs={4}><h1>Filtre</h1></Col>
        <Col xs={4}><hr style={{backgroundColor: '#2b371b', height: '1px', marginTop: '22px'}} /></Col>
      </Row>
      <Row className="mb-4 text-center justify-content-center">
        <Col className="mb-1" xs={12} md={4}>
          <Form.Control
            as="select"
            value={colorDrop}
            onChange={(e) => handleColorDrop(e.target.value)}
          >
            {!colorDrop && <option>Farba</option>}
            <option>Biele</option>
            <option>Červené</option>
            <option>Ružové</option>
            <option>Ovocné</option>
          </Form.Control>
        </Col>
        <Col className="mb-1" xs={12} md={4}>
          <Form.Control
            as="select"
            value={tasteDrop}
            onChange={(e) => handleTasteDrop(e.target.value)}
          >
            {!tasteDrop && <option>Chut</option>}
            <option>Suché</option>
            <option>Polosuché</option>
            <option>Polosladké</option>
            <option>Sladké</option>
          </Form.Control>
        </Col>
        <Col className="mb-1" xs={12} md={4}>
          <Form.Control
            as="select"
            value={typeDrop}
            onChange={(e) => handleTypeDrop(e.target.value)}
          >
            {!typeDrop && <option>Odroda</option>}
            {getAllWineTypes()}
          </Form.Control>
        </Col>
      </Row>
      <SlideDown className={"my-dropdown-slidedown"}>
        {selectedFilters.length !== 0 &&
        <Row className="text-center justify-content-center">
          <Col>
              <strong>
                <ShowSelectedFilters />
              </strong>
          </Col>
        </Row>}
      </SlideDown>
      <Row className="mb-4 text-center justify-content-center">
        <Col xs={12}><hr style={{backgroundColor: '#2b371b', height: '2px', marginTop: '22px'}} /></Col>
      </Row>
      <Row className="text-center">
        <ShowWines />
      </Row>
    </Container>
  );
};