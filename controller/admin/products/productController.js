const moment = require("moment");
const { Op, where } = require("sequelize");
const {
  apiSuccess,
  apiError,
  apiSuccessWithData,
} = require("../../../helpers/apiHelpers");
const { products, Sequelize, media } = require("../../../models");
const fs = require("fs");
const path = require("path");
const baseDir = path.join(__dirname, "../../../tmp/images");
exports.addProducts = async (req, res) => {
  try {
    // let product = await products.findOne({
    //     where: {
    //         title: req.body.title,
    //     },
    // })
    // if (product) return res.json("this product is already exist")
    // if (req.files == undefined) {
    //     return res.status(422).json(apiError("add an image"))
    // }
    let prdt = await products.create({
      title: req.body.title,
      description: req.body.description,
      prices: req.body.prices,
      quantity: req.body.quantity,
      status: req.body.status ? true : false,
    });
    if (prdt) {
      req.files.forEach(async (element) => {
        console.log(element);
        await media.create({
          name: element.originalname,
          media_type: "image",
          media_id: prdt.id,
        });
      });
    }

    return res.status(200).json(apiSuccess("Products addedd successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.editProducts = async (req, res) => {
  try {
    let prdt = await products.findOne({
      where: { id: req.params.id },
    });
    if (!prdt) return res.status(404).json(apiError("product not found"));

    await products.update(req.body, { where: { id: prdt.id } });
    console.log(prdt.id);
    let images = await media.findAll({
      where: { media_id: [prdt.id] },
    });
    images.forEach(async (element) => {
      fs.unlink(baseDir + "/" + element.name, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("image deleted");
        }
      });
      await element.destroy();
    });
    req.files.forEach(async (e) => {
      await media.create({
        name: e.originalname,
        media_type: "image",
        media_id: prdt.id,
      });
    });

    return res.status(200).json(apiSuccess("procuct updated successfully"));
  } catch (error) {
    console.log(error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const whereStatement = {};
    const { status, startDate, endDate, search, page, entries } = req.query;
    if (req.query.status) {
      whereStatement.status = { [Sequelize.Op.like]: `%${status}%` };
    }
    if (req.query.startDate && req.query.endDate) {
      whereStatement.createdAt = { [Op.between]: [startDate, endDate] };
    }
    if (req.query.search) {
      whereStatement.title = { [Op.like]: `%${search}%` };
    }

    var currentpage = page ? parseInt(page) : 1;

    var per_page = entries ? parseInt(entries) : 10;

    let {
      docs: data,
      total,
      pages,
    } = await products.paginate({
      include: ["media"],
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
    return res.json(apiSuccessWithData("All products data", response));
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiError("server error"));
  }
};

exports.viewProductByID = async (req, res) => {
  try {
    let product = await products.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!product) return res.status(404).json(apiError("product is not found"));

    return res.json(apiSuccessWithData("produc details", product));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.updateProductStatus = async (req, res) => {
  try {
    let isExist = await products.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(isExist);
    // console.log("ghere",isExist.dataValues.in_stock)
    if (!isExist) return res.status(404).json(apiError("not exist"));

    if (req.body.status == 1) {
      isExist.status = 1;
      await isExist.save();
      return res.status(200).json(apiSuccess("product active"));
    } else {
      isExist.status = 0;
      await isExist.save();
      return res.status(200).json(apiSuccess("product inactive"));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiError("Server Error"));
  }
};
