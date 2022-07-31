const { Op } = require("sequelize");
const { paginate } = require("sequelize-paginate");
const {
  apiError,
  apiSuccess,
  apiSuccessWithData,
} = require("../../../helpers/apiHelpers");
const {
  subscription_plan,
  subs_description,
  meal_plan,
} = require("../../../models");
const { resetPassword } = require("../account/resetPasswordController");

exports.createSubcription = async (req, res) => {
  let { title, description, price, details, status } = req.body;

  try {
    let subscription = await subscription_plan.create({
      title,
      type: "normal",
      status: status ? true : false,
    });
    if (!subscription.id) {
      return res.status(404).json(apiError("no data found"));
    } else {
      for (let i = 0; i < description.length; i++) {
        var addSubs = await subs_description.create({
          subscription_id: subscription.id,
          description: description[i],
          prices: price,
        });
        console.log(description[i]);
      }

      for (let i = 0; i < details.length; i++) {
        var addingMeals = await meal_plan.create({
          subscription_id: subscription.id,
          breakfast: details[i].breakfast,
          snack1: details[i].snack1,
          lunch: details[i].lunch,
          snack2: details[i].snack2,
          dinner: details[i].dinner,
          days: details[i].days,
        });
      }
      // console.log("description" + addSubs, "meals" + addingMeals)
    }
    const notification = {};

    return res
      .status(200)
      .json(
        apiSuccess("Subcription_plan  and meal_plan are added successfully")
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getAllSubcription = async (req, res) => {
  try {
    const whereStatement = {};
    const { status, startDate, endDate, search, page, limit } = req.query;
    if (status) {
      whereStatement.status = { [Op.like]: `%${status}%` };
    }
    if (startDate && endDate) {
      whereStatement.createdAt = { [Op.between]: [startDate, endDate] };
    }
    if (search) {
      whereStatement.title = { [Op.like]: `%${search}%` };
    }

    var currentpage = page ? parseInt(page) : 1;

    var per_page = limit ? parseInt(limit) : 10;

    let {
      docs: data,
      total,
      pages,
    } = await subscription_plan.paginate({
      include: [ "plan", "meal_plan"],
      where: whereStatement,
      page: currentpage,
      paginate: per_page,
    });

    let response = {
      data,
      current_page: currentpage,
      total,
      per_page: limit,
      last_page: pages,
    };
    return res
      .status(200)
      .json(apiSuccessWithData("subscription listing", response));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.viewSubscriptionByID = async (req, res) => {
  try {
    let subscription = await subscription_plan.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!subscription)
      return res.status(404).json(apiError("no subscription exist"));

    return res
      .status(200)
      .json(apiSuccessWithData("subscription details", subscription));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.editSubscription = async (req, res) => {
  let { details, price, description } = req.body;
  try {
    let isSessionExist = await subscription_plan.findOne({
      where: { id: req.params.id, type: "normal" },
    });
    if (isSessionExist) {
      console.log(isSessionExist.id);
      await isSessionExist.update({ title: req.body.title });

      for (let i = 0; i < description.length; i++) {
        await subs_description.update(
          {
            description: description[i],
            price: price,
          },
          { where: { subscription_id: isSessionExist.id } }
        );
      }

      for (let i = 0; i < details.length; i++) {
        await meal_plan.update(
          {
            breakfast: details[i].breakfast,
            snack1: details[i].snack1,
            lunch: details[i].lunch,
            snack2: details[i].snack2,
            dinner: details[i].dinner,
          },
          {
            where: { subscription_id: isSessionExist.id, days: req.query.days },
          }
        );
      }
      console.log(details);
    } else {
      return res.status(404).json(apiError("no session exist by this id"));
    }
    return res.status(200).json(apiSuccess("session updated successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    let subscription = await subscription_plan.findOne({
        include:["plan","users","meal_plan"],
      where: {
        id: req.params.id,
      },
    });

    if (!subscription) return res.status(404).json(apiError("not found"));

    await subscription.destroy();

    return res
      .status(200)
      .json(apiSuccess("subscription deleted successfully"));
  } catch (error) {
    console.log(error);
  }
};
