import React from 'react'

export default ({visible}) => {
    return (
        <>
            <div className="d-none d-md-block whitesmoke-bg-pnine text-center" style={{ transition: 'top 0.6s', zIndex: "+199", fontSize: '110%', position: 'sticky', padding: '5px 5px', top: visible ? '189px' : '0px' }}>
                Získavaš od nás zľavu 10% z celkovej sumy vášho prvého nákupu u nás!
            </div>
            <div className="d-block d-md-none whitesmoke-bg-pnine text-center" style={{ transition: 'top 0.6s', zIndex: "+199", fontSize: '90%', position: 'sticky', padding: '5px 5px', top: visible ? '169px' : '0px' }}>
                Získavaš od nás zľavu 10% z celkovej sumy vášho prvého nákupu u nás!
            </div>
        </>
    )
}