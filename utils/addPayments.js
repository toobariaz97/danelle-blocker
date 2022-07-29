const { payments } = require('../models');



const addPayments = async(paymentData) => {

    let { payable_id, payable_type, user_id, data, amount_paid } = paymentData;

    let payment = await payments.create({
        payable_id: payable_id,
        payable_type: payable_type,
        user_id: user_id,
        data: data,
        amount_paid: amount_paid
    })
    // console.log(payment)
}

module.exports = addPayments