const { online_session } = require('../../../models')
const { mt_rand } = require('../../../utils/helpers')
const moment = require('moment');
const createNotifications = require('../../../utils/createNotfication');
const { Op } = require('sequelize');
const { apiError, apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers');



exports.createSession = async (req, res) => {
    let { admin } = req
    try {
        let session = await online_session.findOne({
            where: {
                session_name: req.body.session_name
            }
        })
        if (session) return res.status(401).json(apiError("session already exist try another title"))


        let onlineSession = await online_session.create({

            // session_id: mt_rand(2222, 99999),
            session_name: req.body.session_name,
            price: req.body.price,
            date: req.body.date,
            time: req.body.time,
            duration: req.body.duration,
            total_seats: req.body.total_seats,
            available_seats: req.body.available_seats,
            description: req.body.description,
            image: req.file.originalname,
            status: req.body.status ? true : false,
        })
        const notification = {
            notifiable_id: null,
            title: "New Session Added",
            body: `New Session ${onlineSession.title} with the Id: ${onlineSession.id}`,
            notifiable_type: "User",
            name: "Admin",
            name_id: admin.id

        }
        createNotifications(notification)
        return res.status(200).json(apiSuccess("session created successfully"))

    }

    catch (error) {
        console.log(error);


        // return res.status(404).json("server error")
    }

}

exports.viewSessionByID = async (req, res) => {

    try {

        let session = await online_session.findByPk(req.params.id)
        if (!session) return res.status(401).json(apiError('no session found'));
        return res.status(200).json(apiSuccessWithData("sessaion details", session));


    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
exports.getAllSessions = async (req, res) => {
    
    try {
        const whereStatement = {}

        const { status, startDate, endDate, search, limit, page } = req.query;
        

        if (status) {
            whereStatement.status = { [Op.like]: `${status}` };
        }
        if (startDate && endDate) {
            whereStatement.createdAt = { [Op.between]: [startDate, endDate] }
        }
        if (search) {
            whereStatement.session_name = { [Op.like]: `%${search}%` }
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

        var currentpage = page ? parseInt(page) : 1;
        
        var per_page = limit ? parseInt(limit) : 10;
        
        let { docs: data, total, pages } = await online_session.paginate(
            {
                include: ["users"],
                where: whereStatement, Datefilter,
                page: currentpage,
                paginate: per_page,
            });
            
            let response = {
                data,
                current_page: currentpage,
                total,
                per_page: limit,
            last_page: pages,
        }
        return res.status(200).json(apiSuccessWithData("Session listing",response))
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.editSession = async (req, res) => {

    let { admin } = req;
    try {
        let isSessionExist = await online_session.
            findOne({
                where:
                    { id: req.params.id }
            });
        if (!isSessionExist) return res.status(401).json(apiError("no session found"));
        console.log(isSessionExist)


        await isSessionExist.update(req.body)

        const notification = {
            notifiable_id: null,
            title: "Session Updated",
            body: `checkout updated session ${isSessionExist.title} `,
            notifiable_type: "User",
                name: "Admin",
                name_id: admin.id
            
        }
        createNotifications(notification)
        return res.status(200).json(apiSuccess("session updated successfully"))


    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    
    }
}

exports.updateStatusSession = async (req, res) => {

    try {

        let isExist = await online_session.findOne({
            where: {
                id: req.params.id,

            }
        })
        console.log(isExist)
        // console.log("ghere",isExist.dataValues.in_stock)
        if (!isExist) return res.status(404).json(apiError("not exist"))

        if (req.body.status==1 ) {

            isExist.status = 1
            await isExist.save()
            return res.status(200).json(apiSuccess("Session is active"))
        }
        else {
            isExist.status = 0
            await isExist.save()
            return res.json(apiSuccess("session inactive"))
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    
    }


}

exports.getSessionDetails = async (req, res) => {

    try {

        let sessionDetails = await online_session.findAll({ include: ['users'] });
        return res.status(200).json(apiSuccessWithData("session details",sessionDetails))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    
    }

}