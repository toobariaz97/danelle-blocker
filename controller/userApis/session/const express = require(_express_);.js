const express = require("express");
const { baseUrl } = require("../utils/url");
const {
    CreateNotification,
    SendPushNotification,
} = require("../utils/Notification");
const { check, validationResult } = require("express-validator");
const config = require("config");
const moment = require("moment");
//model
const paymentModel = require("../models/Payment");

const Booking = require("../models/Booking");

const stripe = require("stripe")("sk_test_RG4EfYiSTOT8IxuNxbeMeDiy");

exports.PAYADDITIONAL_AMOUNT = async (req, res) => {
    try {
        const {
            booking,
            payment_method,
            card_number,
            card_expiry,
            card_cvv,
            tip_amount,
        } = req.body;
        console.log("tiping_amount", tip_amount);
        let bookingdata = await Booking.findById({ _id: booking });
        if (!bookingdata) {
            throw new Error("Booking doesnt not Exists");
        }
        if (bookingdata.is_paid && bookingdata.status == "COMPLETED") {
            let charge = "";
            let m = card_expiry.split("/");
            let cardNumber = card_number;
            console.log("bloc12");

            let token = await stripe.tokens.create({
                card: {
                    number: cardNumber,
                    exp_month: m[0],
                    exp_year: m[1],
                    cvc: card_cvv,
                },
            });
            console.log("bloc13");
            if (token.error) {
                // throw new Error (token.error);
                return res.status(400).json({ message: token.error });
            }

            charge = await stripe.charges.create({
                amount: tip_amount * 100,
                description: "Third Charm  ",
                currency: "usd",
                source: token.id,
            });
            let paymentLog = new paymentModel({
                booking: booking,
                charge_id: charge.id ? charge.id : null,
                amount: booking.tip_amount,
                user: req.user._id ? req.user._id : null,
                type: payment_method,
                status: charge.id ? "paid" : "unpaid",
            });
            const notification = {
                notifiableId: null,
                notificationType: "Admin",
                title: "Booking Payment Received",
                body: "New Booking ",
                payload: {
                    type: "BOOKING",
                    id: req.user._id,
                },
            };

            await paymentLog.save();
            if (charge) {
                bookingdata.tip_amount = tip_amount;
            }
            await bookingdata.save();
            CreateNotification(notification);

            const notification2 = {
                notifiableId: req.user._id,
                notificationType: "BOOKING",
                title: "Additional Payment Successful",
                body: "Payment Successful",
                payload: {
                    type: "BOOKING",
                    id: paymentLog._id,
                },
            };
            SendPushNotification(notification2);
            res.status(200).json({
                message: "Aditional Payment Successfully Paid",
                booking: bookingdata,
            });
        }
    } catch (err) {
        console.log("Error", err);
        res.status(500).send({
            message: err.toString(),
        });
    }
};

exports.BOOKING_PAYMENT = async (req, res) => {
    try {
        const { booking, payment_method, card_number, card_expiry, card_cvv } =
            req.body;

        let bookingdata = await Booking.findOne({ _id: booking });
        if (!bookingdata) {
            throw new Error("Booking doesnot Exist");
        }
        if (bookingdata.is_paid) {
            res.status(200).json({ message: "Booking Already Paid" });
        }
        let charge = "";
        let m = card_expiry.split("/");
        let cardNumber = card_number;
        let token = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: m[0],
                exp_year: m[1],
                cvc: card_cvv,
            },
        });

        if (token.error) {
            // throw new Error (token.error);
            return res.status(400).json({ message: token.error });
        }

        charge = await stripe.charges.create({
            amount: bookingdata.payable_amount * 100,
            description: "Third Charm  ",
            currency: "usd",
            source: token.id,
        });
        let paymentLog = new paymentModel({
            booking: booking,
            charge_id: charge.id ? charge.id : null,
            amount: booking.payable_amount,
            user: req.user._id ? req.user._id : null,
            type: payment_method,
            status: charge.id ? "paid" : "unpaid",
        });

        const notification = {
            notifiableId: null,
            notificationType: "Admin",
            title: "Booking Payment Received",
            body: "New Booking ",
            payload: {
                type: "BOOKING",
                id: req.user._id,
            },
        };

        await paymentLog.save();
        bookingdata.is_paid = true;
        await bookingdata.save();
        CreateNotification(notification);

        const notification2 = {
            notifiableId: req.user._id,
            notificationType: "BOOKING",
            title: "Payment Successful",
            body: "Payment Successful",
            payload: {
                type: "BOOKING",
                id: paymentLog._id,
            },
        };
        SendPushNotification(notification2);
        res
            .status(200)
            .json({ message: "Payment Successfully Paid", booking: bookingdata });
    } catch (err) {
        res.status(500).send({
            message: err.toString(),
        });
    }
};

//get All Payments

exports.GET_ALL_PAYMENT_LOGS = async (req, res) => {
    try {
        const { page, limit, fieldname, order, keyword, selection, from, to } =
      0
        const CurrentField = fieldname ? fieldname : "createdAt";
        const currentOrder = order ? parseInt(order, 10) : -1;
        const sort = {};
        sort[CurrentField] = currentOrder;

        const searchParam = keyword
            ? {
                $or: [{ name: { $regex: `${keyword}`, $options: "i" } }],
            }
            : {};

        let Datefilter = "";
        if (from && to) {
            Datefilter =
                from && to
                    ? {
                        createdAt: {
                            $gte: moment(from).startOf("day").toDate(),
                            $lte: moment(to).endOf("day").toDate(),
                        },
                    }
                    : {};
            console.log("fromto", Datefilter);
        } else if (from) {
            console.log("from");
            Datefilter = from
                ? {
                    createdAt: {
                        $gte: moment(from).startOf("day").toDate(),
                        $lte: moment(new Date()).endOf("day").toDate(),
                    },
                }
                : {};
            console.log("from", Datefilter);
        } else if (to) {
            console.log.apply("to");
            Datefilter = to
                ? { createdAt: { $lte: moment(to).endOf("day").toDate() } }
                : {};
        }
        const payments = await paymentModel.paginate(
            {
                ...searchParam,
                ...Datefilter,
            },
            {
                page: currentpage,
                limit: per_page,
                lean: true,
                sort: "-_id",
            }
        );

        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};

exports.GET_MY_PAYMENTS = async (req, res) => {
    try {
        const { page, limit, fieldname, order, keyword, selection, from, to } =
            req.query;
        const currentpage = page ? parseInt(page, 10) : 1;
        const per_page = limit ? parseInt(limit, 10) : "";
        const CurrentField = fieldname ? fieldname : "createdAt";
        const currentOrder = order ? parseInt(order, 10) : -1;
        let offset = (currentpage - 1) * per_page;
        const sort = {};
        sort[CurrentField] = currentOrder;

        const searchParam = keyword
            ? {
                $or: [{ name: { $regex: `${keyword}`, $options: "i" } }],
            }
            : {};

        let Datefilter = "";
        if (from && to) {
            Datefilter =
                from && to
                    ? {
                        createdAt: {
                            $gte: moment(from).startOf("day").toDate(),
                            $lte: moment(to).endOf("day").toDate(),
                        },
                    }
                    : {};
            console.log("fromto", Datefilter);
        } else if (from) {
            console.log("from");
            Datefilter = from
                ? {
                    createdAt: {
                        $gte: moment(from).startOf("day").toDate(),
                        $lte: moment(new Date()).endOf("day").toDate(),
                    },
                }
                : {};
            console.log("from", Datefilter);
        } else if (to) {
            console.log.apply("to");
            Datefilter = to
                ? { createdAt: { $lte: moment(to).endOf("day").toDate() } }
                : {};
        }
        const payments = await paymentModel.paginate(
            {
                user: req.user._id,
                ...searchParam,
                ...Datefilter,
            },
            {
                ...currentpage,
                ...per_page,
                lean: true,
                sort: "-_id",
            }
        );

        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};

exports.GET_PAYMENT_DETAIL_BY_ID = async (req, res) => {
    let payment_id = req.params.payment_id;
    try {
        const payment = await paymentModel.findOne({
            _id: payment_id,
        });

        if (!payment)
            return res.status(400).json({ message: "payment Detail not found" });

        return res.json(payment);
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};
