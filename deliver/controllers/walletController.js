
const Account = require("../models/accountModel")
const Network = require("../models/networkModel")
const Token = require("../models/tokenModel")
const Wallet = require("../models/walletModel")
const CryptoJS = require("crypto-js")

exports.createWallet = async (req, res) => {


    // check body exist or not

    // First Method

    // first account bnana he
    const accountName = "Account 0"

    const account = new Account({
        name: accountName,
        accountNumber: 0,
        address: req.body.address

    })

    await account.save()

    const network = new Network({
        name: "Sepolia",
        providerURL: "https://rpc.sepolia.org",
        scanURL: "https://sepolia.etherscan.io",
        coinName: "Eth",
        chainId: "11155111"

    })
    await network.save()

    // Second Method
    // const account = await Account.create({
    //     name: accountName,
    //     accountNumber: 0,

    // })

    // await account.create()
    // first test network sepolia

    // const network = await Network.create({
    //     name: "Sepolia",
    //     providerURL: "https://rpc.sepolia.org",
    //     scanURL: "https://sepolia.etherscan.io",
    //     coinName: "Eth",
    //     chainId: "11155111"

    // })

    // await network.create()

    const pk = req.body.pk
    const sp = req.body.sp

    console.log(pk)
    const saltyPk = CryptoJS.AES.encrypt(pk, process.env.SALT).toString()
    const saltySp = CryptoJS.AES.encrypt(sp, process.env.SALT).toString()

    console.log(saltyPk)
    console.log(saltySp)

    const newWallet = new Wallet(req.body) //pk khudhi exclude kr de ga

    newWallet.accounts.push(account)
    newWallet.networks.push(network)
    await newWallet.save()
    // const data = {}
    // console.log(data)

    return res.status(201).json({ status: "success", message: "wallet has been ceated", data: { saltyPk: saltyPk, saltySp: saltySp } })

}

exports.importWallet = async (req, res) => {

    console.log(req.body)
    const wallet = await Wallet.findOne({ "seedHash": req.body.seedHash })
    console.log("wallet", wallet)
    if (!!wallet) {

        return res.status(200).json({ status: "success", message: "wallet has been imported" })
    }

    return res.status(404).json({ status: "fail", message: "wallet not found" })


}



exports.getWallets = async (req, res) => {
    const data = await Wallet.find({}).populate("accounts").populate("networks")
    return res.status(200).json({ status: "success", data: data })
}

exports.getWallet = async (req, res) => {

    console.log("aaaaaaaaaa")
    console.log(req.params.walletId)
    const data = await Wallet.findById(req.params.walletId).populate("accounts").populate("networks")
    return res.status(200).json({ status: "success", data: data })
}



