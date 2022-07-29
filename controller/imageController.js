const path = require("path");
exports.index = async(req, res) => {
    filePath = path.resolve(__dirname, `../tmp/images/${req.params.path}`);
    console.log(filePath)
    return res.sendFile(filePath);
};