import React, {useState} from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import homevina from './homevina.jpg'
import vinospodok from './vinospodok.jpg'
import etiketyspodok from './etiketyspodok.jpg'

const recky = [
    {
        meno: 'Milan',
        popis: `Chceli sme ochutnat nieco nové a podporiť
        slovenských vinárov a náhdone sme natrafili na
        vašu stránku. Objednávka bola rýchla a
        bez problémov, dodanie bolo hneď na druhý den.
        Ďakujeme a nazdravie`
    },
    {
        meno: 'Alena',
        popis: `Objednávali sme etikety ako pozornosť pre
        našich klientov. Oslovila nás možnosť vybrať si
        konkrétné vína, ku ktorým sme si vedeli navoliť
        rôzne etikety. Komunikácia s eshopom bola rýchla
        a efektívna a i napriek dlhšiemu času dodania
        sme boli veľmi spokojní. Určite sme nenakupovali
        naposledy.`
    },
    {
        meno: 'Peter',
        popis: `Ďakujem za rýchle vybavenie. Partnerka mala radosť
        z etikety a ja radosť z vína.`
    },
    {
        meno: 'Zuzana',
        popis: 'Jednoduchá objednávka, rýchle dodanie. Spokojnosť.'
    },
    {
        meno: 'Patrícia',
        popis: `Ďakujem za rýchle vybavenie a dodanie aj napriek
        naším požiadavkám a krátkemu času. Vďaka
        vašim vínam a etiketám bola naša svadba
        originálna. Ďakujeme moc a určite vás budeme
        odporúčať aj ďalej. :)`
    },
    {
        meno: 'Tomáš',
        popis: 'Rýchle dodanie, chutné vína. Vďaka.'
    },
]

export default ({userId, isOwner, shoppingCart, setShoppingCart, isMaintenance}) => {
    const randomRecka = Math.floor(Math.random() * 6)
    return (
        <Container>
            <Row
                style={{
                    background: `url(${homevina}) no-repeat center`,
                    height: '90vh',
                    margin: '16px 0px',
                    position: 'relative',
                    fontFamily: 'IBM Plex Sans'
            }}
            >
                <article
                    style={{
                        position: 'absolute',
                        left: '5%',
                        top: '10%',
                        width: '16rem',
                        border: '2px solid black',
                        padding: '3rem 1rem',
                        backgroundColor: 'rgba(0,0,0,0.0)',
                    }}
                >
                    <div style={{color: '#286b35', fontSize: '300%', fontFamily: 'Rozha One', letterSpacing: '2px'}}>
                        <div style={{lineHeight: '3rem'}}>
                            <p style={{fontSize: '210%'}}>Naše</p> 
                            <p style={{fontSize: '210%'}}>Vína</p> 
                        </div>
                        <div style={{lineHeight: '0rem'}}>
                            <p style={{fontSize: '100%', letterSpacing: '4px'}}>
                                <span style={{fontSize: '50%'}}>
                                    Malých Karpát
                                </span>
                            </p>
                        </div>
                    </div>
                    <p
                        style={{
                            letterSpacing: '-1px',
                        }}
                    >
                        masvino.sk ponúka jedinečné vína, ktoré vás oslovia
                        hneď po prvom ochutnaní. Malokarpatská oblasť
                        ukrýva množstvo bohatstva, ktoré slovenskí malí
                        vinári pretváraju do ich exkluzívných vín. Vyberte
                        si na našom eshope podľa svojej chuti a zažite
                        výnimočné príbehy, ktoré slovenské vína ponúkajú.
                    </p>
                </article>
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '5%',
                        height: 'auto',
                        width: '22rem',
                    }}
                >
                    <article
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.0)',
                            color: 'black',
                            padding: '1rem',
                            marginBottom: '1rem',
                        }}
                    >
                        <div style={{color: '#2c1111', fontSize: '300%', fontFamily: 'Rozha One', letterSpacing: '1px', lineHeight: '3rem'}}>
                            <p style={{fontSize: '150%'}}>Vyjadrite</p> 
                            <p style={{fontSize: '150%', letterSpacing: '-4px'}}>
                                <span style={{fontSize: '100%',color: '#333333'}}>sa&nbsp;</span>
                                etiketou
                            </p>
                        </div>
                        <p
                            style={{
                                letterSpacing: '-1px',
                            }}
                        >
                            Idete na návštevu, hľadáte vhodný darček alebo
                            chcete len niečo špeciálne? My vieme, aké ťažké
                            je nájsť niečo vhodné, čo poteší, neurazí a zároveň
                            vynikne. S vínom nikdy nič nepokazíte, no s vínom,
                            ktoré vyjadrí všetko za vás, budete jedineční.
                            masvino.sk vám ponúka etikety vhodné na narodeniny,
                            oslavy, svadby, rozchody, romantické vecery, ale aj
                            len tak na bežné dni, ktoré už viac bežné nebudú.
                            Tak šup, šup - nakuknite do našej ponuky a vyberajte.
                            ...ved predsa, kvety sa vypit nedajú!
                        </p>
                    </article>
                    {randomRecka >= 0 &&
                        <article
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.0)',
                                padding: '1rem',
                            }}
                        >
                            <div style={{color: '#2c1111',fontSize: '300%', fontFamily: 'Rozha One', letterSpacing: '1px', lineHeight: '3rem'}}>
                                {recky[randomRecka].meno}
                            </div>
                            <p
                                style={{letterSpacing: '-1px'}}
                            >
                                {recky[randomRecka].popis}
                            </p>
                        </article>
                    }
                </div>
            </Row>
            <Row>
                <Col>
                    <hr style={{backgroundColor: '#373737', paddingBottom: '2px'}} />
                </Col>
                <Col className="text-center">
                    <p style={{fontSize: '120%'}}>Najpredávanejšie vína</p>
                </Col>
                <Col>
                    <hr style={{backgroundColor: '#373737', paddingBottom: '2px'}} />
                </Col>
            </Row>
            <Row
                style={{
                    height: '200px'
                }}
            >
                <Col
                    style={{
                        width: '80px',
                        height: '200px',
                        backgroundColor: 'red',
                        margin: '0px 10px'
                    }}
                >

                </Col>
                <Col
                    style={{
                        width: '80px',
                        height: '200px',
                        backgroundColor: 'red',
                        margin: '0px 10px'
                    }}
                >

                </Col>
                <Col
                    style={{
                        width: '80px',
                        height: '200px',
                        backgroundColor: 'red',
                        margin: '0px 10px'
                    }}
                >

                </Col>
                <Col
                    style={{
                        width: '80px',
                        height: '200px',
                        backgroundColor: 'red',
                        margin: '0px 10px'
                    }}
                >

                </Col>
                <Col
                    style={{
                        width: '80px',
                        height: '200px',
                        backgroundColor: 'red',
                        margin: '0px 10px'
                    }}
                >

                </Col>
            </Row>
            <Row>
                <Col>
                    <hr style={{backgroundColor: '#373737', paddingBottom: '2px'}} />
                </Col>
            </Row>
            <Row>
                <Col
                    lg={6}
                    md={12}
                    className="my-2"
                >
                    <div
                        className="pad-over"
                        style={{
                            height: '600px',
                            background: `url(${etiketyspodok}) no-repeat center`,
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <article
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '15%',
                                height: '70%',
                                width: '21rem',
                                padding: '1rem',
                                backgroundColor: 'rgba(0,0,0,0.0)'
                            }}
                        >
                            <div style={{color: '#2c1111', fontSize: '300%', fontFamily: 'Rozha One', letterSpacing: '-2px', lineHeight: '4rem'}}>
                                <p style={{fontSize: '150%'}}>PRÍBEH</p> 
                                <p style={{fontSize: '150%'}}>LÁSKA</p> 
                                <p style={{fontSize: '150%'}}>ŽIVOT</p> 
                            </div>
                            <p
                                style={{
                                    letterSpacing: '-1px',
                                }}
                            >
                                Nechajte sa uniesť a vytvorte z vína príbeh,
                                ktorý vyjadrí všetko za vás. Či už ide o lásku,
                                smútok, zábavu alebo len tak o všedný deň.
                                My máme príbeh na každý deň vášho života.
                            </p>
                        </article>
                    </div>
                </Col>
                <Col
                    lg={6}
                    md={12}
                    className="my-2"
                >
                    <div
                        style={{
                            height: '600px',
                            background: `url(${vinospodok}) no-repeat center`,
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        className="pad-over"
                    >
                        <article
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '15%',
                                height: '70%',
                                width: '21rem',
                                backgroundColor: 'rgba(0,0,0,0.0)',
                                textAlign: 'right',
                                padding: '1rem'
                            }}
                        >
                            <div style={{color: '#2c1111', fontSize: '300%', fontFamily: 'Rozha One', letterSpacing: '-2px', lineHeight: '4rem'}}>
                                <p style={{fontSize: '150%'}}>ČERVENÉ</p> 
                                <p style={{fontSize: '150%'}}>BIELE</p> 
                                <p style={{fontSize: '150%'}}>RUŽOVÉ</p> 
                            </div>
                            <p
                                style={{
                                    letterSpacing: '-1px',
                                }}
                            >
                                Malokarpatská oblasť je rôznorodá,
                                rovnako ako aj vína našich slovenských vinárov.
                                Vyberte si farbu, chuť i druh, ktorý najviac uľahodí
                                vášmu srdcu a vychutnajte si explóziu chutí,
                                ktorú s láskou vyrábajú naši malí vinári z
                                Malých Karpát.
                            </p>
                        </article>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr style={{backgroundColor: '#373737', paddingBottom: '2px'}} />
                </Col>
            </Row>
        </Container>
    )
}