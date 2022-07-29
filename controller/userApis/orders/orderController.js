//dependencies
const { apiError, apiSuccessWithData } = require('../../../helpers/apiHelpers');
const userAuthorization = require('../../../middleware/userAuthorization');
const { orders, products, Sequelize, order_details, sequelize } = require('../../../models');
const addPayments = require('../../../utils/addPayments');
const createNotifications = require('../../../utils/createNotfication');
const { mt_rand } = require('../../../utils/helpers');
const stripe = require('stripe')(process.env.STRIPE_KEY); // Add your Secret Key Here


//contorller begins

//get order user done
exports.myOrders = async (req, res) => {
    let { user } = req;
    try {
        var order = await orders.findAll({
            include: ["products"],
            where: {
                customer_id: user.id
            }
        })
        if (!order) return res.status(404).json(apiError("No order found"));

        console.log(order)
        return res.json({ result: "success", msg: `user id ${user.id} orders`, res: order })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json(error)
    }
}

//getOrderController
exports.getOrderByStatus = async (req, res) => {
    let { user } = req;
    try {
        let order = await orders.findAll({
            include: ["users", "products"],
            where: {
                status: req.query.status,
                customer_id: user.id
            }
        })
        if (!order) return res.status(404).json(apiError("no orders found"))
        return res.json(order)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json(error)
    }
}

exports.viewOrder = async (req, res) => {
    let { user } = req;
    try {
        let order = await orders.findOne({
            include: ["products", "users"],
            where: {
                id: req.params.id,
                customer_id: user.id
            }
        })
        if (!order) return res.status(404).json(apiError("no orders found"))
        return res.json(apiSuccessWithData("order details", order))
    }
    catch (e) {
        return res.status(500).json(error)
    }
}

exports.placeOrder = async (req, res) => {

    let { user } = req;
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            orderItems,
            shipping_address,
            billing_address,
            card_details,
            same_as_shipping
        } = req.body;


        if (orderItems && orderItems.lenght === 0) return res.status(404).json(apiError("no order Items found"))

        let order = await orders.create({
            customer_id: user.id,
            order_number:mt_rand(2222, 99999),
            customer_name: customer_name,
            customer_email: customer_email,
            customer_phone: customer_phone,
            shipping_address: shipping_address,
            added_on: Sequelize.fn('NOW'),
            amount_paid: false,
            status: "pending",
            same_as_shipping: same_as_shipping
        })
        if (same_as_shipping == true) {
            order.billing_address = shipping_address;
            await order.save();
        }
        else {
            order.billing_address = billing_address;

            await order.save();
        }

        let token = await stripe.tokens.create({
            card: {
                number: card_details.card_number,
                exp_month: card_details.exp_month,
                exp_year: card_details.exp_year,
                cvv: card_details.card_cvv
            }
        });
        if (token.error) return res.status(400).json(token.error)

        let charge = await stripe.charges.create({
            amount: req.body.amount,
            description: "Danyelle blocker",
            currency: "usd",
            source: token.id,
        });

        orderItems.forEach(async (product) => {

            console.log(product)
          let p=await products.findOne({ where: { id: 1 } })
            if (p.quantity == 0) {
                return res.status(404).json(apiError("product is not available"))
            } else {
                p.quantity = p.quantity - product.qty;
                await p.save()
            }
            await order_details.create({
                order_id: order.id,
                product_id: product.product_id,
                Qty: product.qty,
                total_amount:charge.amount
            })
        })

        const payment = {
            payable_id: order.id,
            payable_type: "Orders",
            user_id: user.id,
            data: token,
            amount_paid: charge.amount
        }

        await addPayments(payment);

        const notification = {

            title: "New Order",
            notfiable_id: order.id,
            body: `New Order recieved by user ${user.id} `,
            notifiable_type: "Admin",
            name: "Users",
            name_id: user.id


        }
        createNotifications(notification);


        const response = {

            isSuccess: "true",
            order_id: order.id,
            name: order.customer_name,
            address: order.shipping_address,
            subtotal: charge.amount,
            date: order.createdAt,
            quantity: orderItems.qty,

        }

        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)

    }
}

