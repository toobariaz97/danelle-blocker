const stripe = require('stripe')('sk_test_51LAZmBHlJwzkHHn2DVM0crhhk8rlTFaF3bRHPrbftI5yKfy0UCmf2cRCOK3WKyVdZfrbAk5C4LovIu7SY58WzKJ100DRxRSNLS'); // Add your Secret Key Here
// const stripe = Stripe('pk_test_51LAZmBHlJwzkHHn2QGTr2muI6JCRAVxUAzFCpIHIOjkMb9cIcFhPDSz27vV848s32ZWD4IZXEfVRqWwiKoPXjEna00n6JeoFAz');

const payment=async(data)=>{
    // Create a new customer and then create an invoice item then invoice it:
    let {email,description}=data
stripe.customers
.create({
  email:email,
})
.then((customer) => {
  // have access to the customer object
  console.log(customer)
  return stripe.invoiceItems.create({
      customer: customer.id, // set the customer id
      amount: 2500, // 25
      currency: 'usd',
      description: description,
    })
    .then((invoiceItem) => {
      return stripe.invoices.create({
        collection_method: 'send_invoice',
        customer: invoiceItem.customer,
      });
    }).then((invoice) => {
      // New invoice created on a new customer
  console.log(invoice)
    })
    .catch((err) => {
      // Deal with an error
      console.log(err)
    });
});
}
module.exports=payment