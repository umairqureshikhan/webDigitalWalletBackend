
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
        providerURL: "https://ethereum-sepolia.publicnode.com",
        scanURL: "https://sepolia.etherscan.io",
        coinName: "Eth",
        chainId: "11155111"

    })
    await network.save()

 
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

    return res.status(201).json({ status: "success", message: "wallet has been ceated", data: { accountNumber:0,saltyPk: saltyPk, saltySp: saltySp } })

}

exports.importWallet = async (req, res) => {

    console.log(req.body)
    const wallet = await Wallet.findOne({ "seedHash": req.body.seedHash, "password": req.body.passwordHash })
    console.log("wallet", wallet)
    if (!!wallet) {

        return res.status(200).json({ status: "success", message: "wallet has been imported", noOfAccounts: wallet.accountCount, isAuthentic : true })
    }

    return res.status(404).json({ status: "fail", message: "wallet not found",isAuthentic : false, noOfAccounts:0 })


}



exports.getWallets = async (req, res) => {
    const data = await Wallet.find({}).populate("accounts.tokens").populate("networks")
    return res.status(200).json({ status: "success", data: data })
}

exports.getWallet = async (req, res) => {

    console.log("aaaaaaaaaa")
    console.log(req.body.walletHash)
    const data = await Wallet.findOne( {seedHash: {$eq:req.body.walletHash} }).populate("accounts").populate(
        {
          path: "accounts",
          populate : {
            path: "tokens",
            model: "Token"
          }
        }
       ).populate("networks")
    return res.status(200).json({ status: "success", wallet: data })
}



