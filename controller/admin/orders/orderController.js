const moment = require("moment");
const { INTEGER } = require("sequelize");
const { Op } = require("sequelize");
const {
  apiError,
  apiSuccess,
  apiSuccessWithData,
} = require("../../../helpers/apiHelpers");
const { orders } = require("../../../models");

const { subscription_details } = require("../../../models");
const createNotifications = require("../../../utils/createNotfication");

exports.getOrders = async (req, res) => {
  try {
    const whereStatement = {};
    const { status, startDate, endDate, search, entries, page } = req.query;

    if (status) {
      whereStatement.status = { [Op.like]: `%${status}%` };
    }
    if (startDate && endDate) {
      whereStatement.createdAt = { [Op.between]: [startDate, endDate] };
    }

    if (search) {
      whereStatement.customer_name = { [Op.like]: `%${search}%` };
      console.log(typeof search);
    }


    var currentpage = page ? parseInt(page) : 1;

    var per_page = entries ? parseInt(entries) : 10;

    let {
      docs: data,
      total,
      pages,
    } = await orders.paginate({
      include: ["users", "products"],
      where: whereStatement,
      page: currentpage,
      paginate: per_page,
    });

    let response = {
      data,
      current_page: currentpage,
      total,
      per_page: entries,
      last_page: pages,
    };
console.log(response)
    return res.status(200).json(apiSuccessWithData("all orders", response));
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

exports.getOrderByStatus = async (req, res) => {
  try {
    let order = await orders.findAll({
      where: {
        status: req.query.status,
      },
    });
    if (!order) return res.status(404).json(apiError("no orders found"));
    return res.status(200).json(apiSuccessWithData("order by status", order));
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

exports.viewOrder = async (req, res) => {
  try {
    let order = await orders.findOne({
      include: ["users","products"],
      where: {
        id: req.params.id,
      },
    });
    if (!order) return res.status(404).json("no orders found");
    return res.json(apiSuccessWithData("Order details", order));
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

// exports.editOrder = async (req, res) => {

//     try {

//         let orderExist = await orders.findOne({
//             where: {
//                 id: req.params.id
//             }
//         })
//         if (!orderExist) return res.status(403).json("no order found");

//         await orderExist.update(req.body);
//         return res.status(200).json(apiSuccess("Updated successfully"))

//     } catch (error) {
//         console.log(error)
//     }
// }

// exports.orderCount = async (req, res) => {
//     try {
//         let ordCount = await orders.count({ where: { status: "deliver" } })

//         console.log(ordCount, "count od orders")
//         return res.json(ordCount)

//     } catch (error) {
//         console.log(error)
//     }
// }

exports.updateOrderStatus = async (req, res) => {
  let { admin } = req;
  let { status } = req.body;
  try {
    let os = await orders.findByPk(req.params.id);
    if (!os) return res.status(404).json(apiError("not exist"));
    os.status = status;

    await os.save();
    const notification = {
      notifiable_id: null,
      title: "Order updates",
      body: `Your order is ${os.status}`,
      notifiable_type: "Admin",
      name: "user",
      name_id: admin.id,
    };

    createNotifications(notification);
    console.log(notification);
    return res.status(200).json(apiSuccess("order updated successfull"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
