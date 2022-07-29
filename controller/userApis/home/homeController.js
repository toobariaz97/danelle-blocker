const { Op } = require('sequelize');
const { products, online_session, banner, meal_plan, media } = require('../../../models')
const { apiSuccessWithData } = require('../../../helpers/apiHelpers')
exports.home = async (req, res) => {
    let where = {};
    let { title, description } = req.body;
    try {

        if (req.query.search) {
            where.title = {
                [Op.like]: `%${req.query.search}%`
            }
        }
        let findImage = await banner.findOne({ include: ["media"] })
        if (findImage == null) {

            let b = await banner.create({
                title: title,
                description: description,
            })
        }
        else {
            await banner.update(req.body, {
                where: {
                    id: findImage.id
                }
            })
        }
        let images;
        req.files.forEach(async (image) => {
            let find = await media.findOne({ where: { media_id: findImage.id } })
            if (find == null) {
                await media.create({
                    name: image.originalname,
                    media_type: banner.name,
                    media_id: findImage.id
                })
            }
            else {
                await media.update({
                    name: image.originalname,
                    media_type: banner.name,
                }, {
                    where: {
                        media_id: findImage.id

                    }
                })

            }
        });

        let product = await products.findAll({
            where
        });
        let mealPlan = await meal_plan.findAll({})
        let session = await online_session.findAll({})
        let response;
        response = {
            bannerId: findImage.id,
            bannerInfo: findImage,
            title: findImage.title,
            description: findImage.description,
            product: product,
            meal_Plan: mealPlan,
            session: session
        }

        return res.json(apiSuccessWithData("Home Data", response))


    } catch (error) {
        console.log(error)
    }
}