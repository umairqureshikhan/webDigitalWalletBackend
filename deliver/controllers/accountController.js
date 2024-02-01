const Account = require("../models/accountModel")
const Wallet = require("../models/walletModel")
const CryptoJS = require("crypto-js")




exports.getAccount = async (req, res) => {
    const wallet = await Wallet.findById(req.params.walletId).populate("accounts")
    const accounts = wallet.accounts
    res.status(200).json({ status: "success", message: "accounts have been sent", accounts: accounts })
}


exports.decryptSeed = async (req, res) => {

    console.log(req.body)
    const esp = CryptoJS.AES.decrypt(req.body.sp, process.env.SALT).toString(CryptoJS.enc.Utf8)
    console.log(esp)

    return res.status(200).json({ status: "success", message: "data decrypted", data: { esp: esp } })

}

exports.addAccount = async (req, res) => {
    console.log("asaaaasdasfdfsdgsdga")
    console.log(req.params.walletId)
    // chek wallet exist
    const wallet = await Wallet.findById(req.params.walletId)
    if (!wallet) {
        return res.status(404).json({ status: "fail", message: "wallet not found" })

    }



    // create new account
    const account = new Account({
        accountNumber: wallet.accountCount + 1,
        name: req.body.name ? req.body.name : "Account " + (wallet.accountCount + 1),
        address: req.body?.address
    })

    account.wallet = wallet
    await account.save()

    // push account into wallet
    wallet.accounts.push(account)
    wallet.accountCount += 1
    await wallet.save()



    return res.status(201).json({ status: "success", message: "account has been created", data: { accountNumber: wallet.accountCount } })


}

