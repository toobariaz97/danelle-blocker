const { Op } = require("sequelize");
const {
  apiError,
  apiSuccess,
  apiSuccessWithData,
} = require("../../../helpers/apiHelpers");
const {
  subscription_plan,
  subscription_details,
  subs_description,
  meal_plan,
} = require("../../../models");

exports.createCustomizeSubcription = async (req, res) => {
  // console.log(res, "response")
  let { title, type, price, description } = req.body;
  console.log(description);
  try {
    let subscription = await subscription_plan.create({
      title,
      type: "customize",
      status: req.body.status ? true : false,
    });
    console.log(subscription);

    if (subscription.id) {
      for (let i = 0; i < description.length; i++) {
        var descriptions = await subs_description.create({
          subscription_id: subscription.id,
          description: description[i].description,
          prices: description[i].price,
        });
        console.log(descriptions);
      }
    } else {
      return res.status(401).json(apiError("data insertion failed"));
    }
    return res
      .status(200)
      .json(apiSuccess("customize subscription added successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.editCustomizePlan = async (req, res) => {
  let { description, title } = req.body;
  try {
    let isSessionExist = await subscription_plan.findOne({
      where: { id: req.params.id, type: "customize" },
    });

    if (!isSessionExist) {
      return res.status(404).json(apiError("no data found"));
    } else {
      await isSessionExist.update({ title: title });
      description.forEach(async (element) => {
        console.log(element);
        await subs_description.update(
          {
            description: element.description,
            price: element.price,
          },
          {
            where: {
              subscription_id: isSessionExist.id,
            },
          }
        );
      });
    }
    return res.status(200).json(apiSuccess("Updated Successfully..."));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.viewPendingrequest = async (req, res) => {
  let { user } = req;
  const whereStatement = {};
  const {
    status,
    startDate,
    endDate,
    search,
    entries,
    page,
    customizeLog,
    approval_status,
  } = req.query;

  if (approval_status) {
    whereStatement.approval_status = "pending";
  }
  if (status) {
    whereStatement.status = status;
  }
  console.log(status);
  if (customizeLog) {
    whereStatement.type = customizeLog;
  }

  if (startDate && endDate) {
    whereStatement.createdAt = { [Op.between]: [startDate, endDate] };
  }
  // if (search) {
  //     whereStatement.title = { [Op.like]: `%${search}%` }
  // }
  var currentpage = page ? parseInt(page) : 1;

  var per_page = entries ? parseInt(entries) : 10;

  try {
    let {
      docs: data,
      total,
      pages,
    } = await subscription_details.paginate({
      include: ["users", "plan"],
      where: whereStatement,
      page: currentpage,
      paginate: per_page,
    });

    // let subscription= await subscription_plan.findAll({
    //   include:["meal_plan"],
    //   where:{
    //     id:data.subs_id
    //   }
    // })

    let response = {
      data,
      // subscription,
      current_page: currentpage,
      total,
      per_page: entries,
      last_page: pages,
    };
    return res
      .status(200)
      .json(apiSuccessWithData("pending request", response));
  } catch (error) {
    console.log(error);
  }
};

exports.viewPendingrequestDetails = async (req, res) => {
  try {
    let viewRequest = await subscription_details.findOne({
      include: ["users", "plan"],
      where: {
        id: req.params.id,
        approval_status: "pending",
      },
    });
    if (!viewRequest) return res.status(404).json(apiError("Not found"));

    let mealPlan = await subscription_plan.findOne({
      include: ["meal_plan"],
      where: {
        id: viewRequest.subs_id,
      },
    });
    let response = {
      subscription: viewRequest,
      // mealPlan: mealPlan,
    };
    return res
      .status(200)
      .json(apiSuccessWithData("panding request detail as per id", response));
  } catch (error) {
    console.log(error);
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    let request = await subscription_details.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!request) return res.status(404).json(apiError("Not found"));
    request.approval_status = req.body.approval_status;
    await request.save();
    return res
      .status(200)
      .json(apiSuccess(`approval status ${request.approval_status}`));
  } catch (error) {
    console.log(error);
  }
};
