import { create } from 'xmlbuilder2'

export default ({ 
    orderId, 
    userInformation, 
    total, 
    addressId,
    carrierPickupPoint,
    paymentCheck,
    dobierka,
    result,
    kurierom,
    deliveryCheck
}) => {
    console.log(paymentCheck, dobierka, typeof paymentCheck, typeof dobierka, result)
    const {fullName, email, phone, address} = userInformation
    const splitName = fullName.split(' ')
    const splitAddress = address.split(',')
    const root = create({ version: '1.0' })
        .ele('createPacket')
            .ele('apiPassword').txt(process.env.REACT_APP_PACKETA_API_PASSWORD).up()
            .ele('packetAttributes')
                .ele('number').txt(orderId).up()
                .ele('name').txt(splitName[0]).up()
                .ele('surname').txt(splitName[1]).up()
                .ele('email').txt(email).up()
                .ele('phone').txt(phone).up()
                .ele('addressId').txt(deliveryCheck === kurierom ? 131 : addressId).up()
                .ele('value').txt(total).up()
                .ele('cod').txt(paymentCheck === dobierka ? result : '').up()
                .ele('eshop').txt('Vinecka.sk').up()
                .ele('street').txt(deliveryCheck === kurierom ? splitAddress[0].substring(0,splitAddress[0].search(/\d/)).trim() : '').up()
                .ele('houseNumber').txt(deliveryCheck === kurierom ? splitAddress[0].substring(splitAddress[0].search(/\d/)).trim() : '').up()
                .ele('city').txt(deliveryCheck === kurierom ? splitAddress[2] : '').up()
                .ele('zip').txt(deliveryCheck === kurierom ? `${splitAddress[1].substring(0,3)} ${splitAddress[1].substring(3)}` : '').up()
                .ele('carrierPickupPoint').txt(carrierPickupPoint ? carrierPickupPoint : '').up()
        .up();
    
    const xml = root.end({ prettyPrint: true });
    console.log(xml);
    return xml
}