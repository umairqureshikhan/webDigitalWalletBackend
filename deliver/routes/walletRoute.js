const express = require("express")
const walletController = require("../controllers/walletController")
const router = express.Router()



router.route("/").post(walletController.createWallet).get(walletController.getWallets)
router.route("/import").post(walletController.importWallet)
router.route("/:walletId").get(walletController.getWallet)


module.exports = router





