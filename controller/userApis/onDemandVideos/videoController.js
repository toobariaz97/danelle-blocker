const { videos, subscribe_video } = require('../../../models')
const { apiError, apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers')
//get all videos
exports.getVideos = async (req, res) => {

    let video = await videos.findAll({});
    if (!video) return res.status(401).json("No vidoes available")
    return res.json(apiSuccessWithData("Listing of videos", video))
}


exports.subscribeVideo = async (req, res) => {

    let { user } = req
    try {

        let subscribeVideo = await videos.findByPk(req.params.id)
        if (!subscribeVideo) return res.status(404).json(apiError("no video found"));


        let video = await subscribe_video.create({
            email: req.body.email,
            video_id: subscribeVideo.id,
            user_id: user.id
        })

        return res.json(apiSuccess("Video subscribed"))


    } catch (error) {
        console.log(error)
    }
}