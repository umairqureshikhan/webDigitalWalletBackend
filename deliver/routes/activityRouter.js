const express = require("express")
const activityController = require("../controllers/activityController")

const router = express.Router()


router.route("/:walletId/:accountId/:networkId").post(activityController.addActivity).get(activityController.getActivity)




module.exports = {
    router
}