const { type, json } = require("express/lib/response");
const { apiError, apiSuccessWithData } = require("../../../helpers/apiHelpers");
const {
  online_session,
  session_details,
  products,
  payments,
} = require("../../../models");
const addPayments = require("../../../utils/addPayments");

const payment = require("../../../utils/paymentGateway");
const stripe = require("stripe")(process.env.STRIPE_KEY); // Add your Secret Key Here

exports.getSessions = async (req, res) => {
  try {
    const whereStatement = {};
    const { status, startDate, endDate, search } = req.query;
    if (req.query.status) {
      whereStatement.status = { [Op.like]: `%${status}%` };
    }
    if (startDate && endDate) {
      whereStatement.createdAt = { [Op.between]: [startDate, endDate] };
    }
    if (search) {
      whereStatement.createdAt = { [Op.like]: `%${search}%` };
    }
    let Datefilter = "";
    if (startDate && endDate) {
      Datefilter =
        startDate && endDate
          ? {
              createdAt: {
                $gte: moment(startDate).startOf("day").toDate(),
                $lte: moment(endDate).endOf("day").toDate(),
              },
            }
          : {};
      console.log("startDateto", Datefilter);
    } else if (startDate) {
      console.log("startDate");
      Datefilter = startDate
        ? {
            createdAt: {
              $gte: moment(startDate).startOf("day").toDate(),

              $lte: moment(new Date()).endOf("day").toDate(),
            },
          }
        : {};
    }
    const session = await online_session.paginate({
      include: ["users"],
      where: whereStatement,
      Datefilter,
    });
    if (!session) return res.status(404).json(apiError("there is no session"));

    return res.json(apiSuccessWithData("Session listing", session));
  } catch (error) {
    console.log(error);
  }
};
exports.getSessionById = async (req, res) => {
  try {
    const session = await online_session.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!session) return res.json(apiError("there is no session"));
    payment(session);
    return res.json(apiSuccessWithData("session details", session));
  } catch (error) {
    console.log(error);
  }
};

exports.bookSession = async (req, res) => {
  let { user } = req;
  const { card_holder_name, card_number, exp_month, exp_year, card_cvv } =
    req.body;
  try {
    let sessionExist = await online_session.findOne({
      where: { id: req.params.id },
    });

    console.log("card number", card_number, req.body);

    if (!sessionExist) return res.status(404).json(apiError("No data exist"));

    let token = await stripe.tokens.create({
      card: {
        name: card_holder_name,
        number: card_number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvv: card_cvv,
      },
    });
    console.log(token);
    if (token.error) return res.status(400).json(token.error);

    console.log(req.body);
    let charge = await stripe.charges.create({
      amount: sessionExist.price,
      description: "Danyelle blocker",
      currency: "usd",
      source: token.id,
    });
    if(sessionExist.available_seats===0)
    {
      return res.json(apiError("There is no seats available"))
    }
    else
 {   sessionExist.available_seats= sessionExist.available_seats - 1;
    await sessionExist.save();}

    // console.log(sessionExist)
    let details = await session_details.create({
      session_id: sessionExist.id,
      user_id: user.id ? user.id : null,
      // total_price: charge.amount,
      // type: sessionExist.type
    });

    const payment = {
      payable_id: sessionExist.id,
      payable_type: "sessions",
      user_id: user.id,
      data: token,
      amount_paid: charge.amount,
    };

    await addPayments(payment);

    const response = {
      success: true,
      sessionDetails: details,
      payments: payment,
    };

    return res.json({ msg: "session booked successfully", response });
  } catch (error) {
    console.log(error);
  }
};
