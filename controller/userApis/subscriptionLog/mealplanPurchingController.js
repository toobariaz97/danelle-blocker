const { Op } = require("sequelize");
const {
  apiError,
  apiSuccess,
  apiSuccessWithData,
} = require("../../../helpers/apiHelpers");
const {
  payments,
  subscription_details,
  subscription_plan,
  subs_description,
  customize_subscriptions,
} = require("../../../models");
const addPayments = require("../../../utils/addPayments");
const createNotifications = require("../../../utils/createNotfication");
const stripe = require("stripe")(process.env.STRIPE_KEY); // Add your Secret Key Here

exports.purchaseMeal = async (req, res) => {
  let { user } = req;
  const { card_holder_name, card_number, exp_month, exp_year, card_cvv } =
    req.body;

  try {
    let addMeal = await subscription_plan.findOne({
      include: ["plan", "meal_plan"],
      where: {
        id: req.params.id,
        type: "normal",
      },
    });

    if (!addMeal) return res.status(404).json(apiError("not exist"));
    console.log(addMeal.plan[0].prices);

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

    let charge = await stripe.charges.create({
      amount: req.body.amount,
      description: "Danyelle-blocker",
      currency: "usd",
      source: token.id,
    });
    // console.log("amount charge",charge);

    let details = await subscription_details.create({
      subs_id: addMeal.id,
      user_id: user.id,
      descriptions: null,
      status: addMeal.status,
      approval_status: "no neeD OF APPROVAL",
      type: addMeal.type,
      amount_paid: charge.amount,
    });
    const payment = {
      payable_id: details.id,
      payable_type: "subscription",
      user_id: user.id,
      data: token,
      amount_paid: charge.amount,
    };

    await addPayments(payment);
    const response = {
      subscription_details: details,
      payments: payment,
    };
    const notification = {
      title: "New meal Order",
      notfiable_id: addMeal.id,
      body: `Normal meal order recieved by user ${user.id} `,
      notifiable_type: "Admin",
      name: "Users",
      name_id: user.id,
    };
    createNotifications(notification);

    return res.json(apiSuccess("order place successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getCustomizeMealPlan = async (req, res) => {
  try {
    let customizePlan = await subscription_plan.findAll({
      include: ["plan", "meal_plan"],
      where: { type: "customize" },
    });
    if (!customizePlan)
      return res.status(404).json(apiError("no meal plan found"));

    return res
      .status(200)
      .json(apiSuccessWithData("Customize Plan list", customizePlan));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.customizeMealPurchase = async (req, res) => {
  let { user } = req;
  const { card_holder_name, card_number, exp_month, exp_year, card_cvv } =
    req.body;
  try {
    let addMeal = await subscription_plan.findOne({
      include: ["plan", "meal_plan"],
      where: {
        id: req.params.id,
        type: "customize",
      },
    });

    if (!addMeal) return res.status(404).json(apiError("not exist"));

    console.log(addMeal);
    let choosePlan = await subs_description.findAll({
      where: { id:{ [Op.in]:req.body.id}},
    });
    console.log(choosePlan);
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

    let charge = await stripe.charges.create({
      amount: req.body.amount,
      description: "Danyelle blocker",
      currency: "usd",
      source: token.id,
    });

    console.log(choosePlan, "descriptionsss");
    let details = await subscription_details.create({
        subs_id: addMeal.id,
        user_id: user.id,
        status: addMeal.status,
        amount_paid: charge.amount,
        type:addMeal.type,
        approval_status: "pending",
    });
    choosePlan.forEach(async(element) => {
        
        // let data= await subscription_details.findAll({})
        // console.log(details)
        // console.log("customize checkOut",details.dataValues.id)
        await customize_subscriptions.create({
            subscription_details_id: details.id,
            descriptions: element.description,
        });
        
    });
    const payment = {
      payable_id: addMeal.id,
      payable_type: "subscription",
      user_id: user.id,
      data: token,
      amount_paid: charge.amount,
    };

    await addPayments(payment);

    // const response = {
    //   subscription_details: details,
    //   payments: payment,
    // };
    const notification = {
      title: "New meal Order",
      notfiable_id: addMeal.id,
      body: `Customize meal order recieved by user ${user.id} `,
      notifiable_type: "Admin",
      name: "Users",
      name_id: user.id,
    };
    createNotifications(notification);

    return res.json(apiSuccess("order place successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.mealPlanPurchase = async (req, res) => {};
