const { Op } = require("sequelize");
const {
  apiSuccess,
  apiSuccessWithData,
  apiError,
} = require("../../../helpers/apiHelpers");
const { videos } = require("../../../models");
const createNotifications = require("../../../utils/createNotfication");

exports.addVideo = async (req, res) => {
  let { admin } = req;
  let { title, description } = req.body;
  try {

let add;
    let video = req.files.find((e) => e.fieldname == "video");
    let image = req.files.find((e) => e.fieldname == "image");

    if (video && image) {
       add = await videos.create({
        title: title,
        description: description,
        video_name: video.originalname,
        thumbnail_name:image.originalname
      });
    }
    else{
      return res.status(403).json(apiError("Video and image can upload only"))
    }
    console.log(add)
    const notification = {
      title: "Video",
      notfiable_id: add.id,
      body: `new video ${add.title} is uploaded `,
      notifiable_type: "User",
      name: "Admin",
      name_id: admin.id,
    };
    createNotifications(notification)
    return res.status(200).json(apiSuccess("videos addes successfully"));
  } catch (error) {
    console.log(error);
  }
};

exports.deleteVideos = async (req, res) => {
  try {
    let video = await videos.findOne({ where: { id: req.params.id } });
    if (!video) return res.status(404).json("Video not found");
    await video.destroy();

    return res.json(apiSuccess("Video deleted successfully.."));
  } catch (error) {
    console.log(error);
  }
};

exports.editVideo = async (req, res) => {
  try {
    let video = await videos.findOne({ where: { id: req.params.id } });
    if (!video) return res.status(404).json("Video not found");

    video.title = req.body.title;
    video.description = req.body.description;
    if (req.file) {
      video.video_name = req.files.originalname;
    }
    if (req.file) {
      video.thumbnail_name = req.files.originalname;
    }
    await video.save();
    return res.status(200).json(apiSuccess("video updated successFully.."));
  } catch (error) {
    console.log(error);
  }
};

exports.getVideos = async (req, res) => {
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
    } = await videos.paginate({
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
    return res.status(200).json(apiSuccessWithData("video listing", response));
  } catch (error) {
    console.log(error);
  }
};
