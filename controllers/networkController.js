const Network = require("../models/networkModel")
const Wallet = require("../models/walletModel")


exports.addNetwork = async (req, res) => {

    // ToDo: check body
    console.log(req.body)


    // check walet exist
    const wallet = await Wallet.findOne( {seedHash: {$eq:req.body.walletHash} })

    if (!wallet) {
        return res.status(404).json({ status: "fail", message: "account not found" })

    }

    // create new network
    const network = new Network({
        ...req.body.network
    })

    network.wallet = wallet
    await network.save()

    // push new network to wallet
    wallet.networks.push(network)
    await wallet.save()


    return res.status(201).json({ status: "success", message: "network has been created", network:network })

}


exports.getNetwork = async (req, res) => {

    const wallet = await Wallet.findById(req.params.walletId).populate("networks")
    const networks = wallet.networks
    return res.status(200).json({ status: "success", message: "network has been sent", networks: networks })

}

