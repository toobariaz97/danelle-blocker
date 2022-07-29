const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, './tmp/videos')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const uploadVideos = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // console.log(req)
    var ext = path.extname(file.originalname);
    if (ext != ".mkv" && ext != ".mp4" && ext!= ".webm")
  {    return cb(new Error("Only videos are allowed"))
  }
  cb(null,true)
}

})
module.exports=uploadVideos;