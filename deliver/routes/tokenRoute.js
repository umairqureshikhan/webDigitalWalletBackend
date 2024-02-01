const express = require("express")
const tokenController = require("../controllers/tokenController")

const router = express.Router()


router.route("/:walletId/:accountId").post(tokenController.importToken).get(tokenController.getToken)





module.exports = router
