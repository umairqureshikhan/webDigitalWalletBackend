const express = require("express")
const networkController = require("../controllers/networkController")

const router = express.Router()



router.route("/").post(networkController.addNetwork).get(networkController.getNetwork)




module.exports = router