import React from 'react'

export default ({visible}) => {
    return (
        <>
            <div className="d-none d-md-block whitesmoke-bg-pnine text-center" style={{ transition: 'top 0.6s', zIndex: "+1", fontSize: '110%', position: 'sticky', padding: '5px 5px', top: visible ? '149px' : '72px' }}>
                Získavaš od nás zľavu 10% z celkovej sumy vášho prvého nákupu u nás!
            </div>
            <div className="d-block d-md-none whitesmoke-bg-pnine text-center" style={{ transition: 'top 0.6s', zIndex: "+1", fontSize: '90%', position: 'sticky', padding: '5px 5px', top: visible ? '129px' : '50px' }}>
                Získavaš od nás zľavu 10% z celkovej sumy vášho prvého nákupu u nás!
            </div>
        </>
    )
}