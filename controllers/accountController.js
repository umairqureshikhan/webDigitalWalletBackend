
const Account = require("../models/accountModel")
const Wallet = require("../models/walletModel")
const CryptoJS = require("crypto-js")




exports.getAccount = async (req, res) => {
    const wallet = await Wallet.findById(req.params.walletId).populate("accounts")
    const accounts = wallet.accounts
    res.status(200).json({ status: "success", message: "accounts have been sent", accounts: accounts })
}


exports.decrypt = async (req, res) => {

    console.log(req.body)
    const ed = CryptoJS.AES.decrypt(req.body.sd, process.env.SALT).toString(CryptoJS.enc.Utf8)
    console.log(ed)

    return res.status(200).json({ status: "success", message: "data decrypted", data: { ed: ed } })

}



exports.bulkEncrypt = async (req, res) => {

    const epks = req.body.epks
    console.log(epks)
    let spks = []
    for (let index = 0; index < epks.length; index++) {
         
        spks.push(CryptoJS.AES.encrypt(epks[index], process.env.SALT).toString())
        
    }

    const sp = CryptoJS.AES.encrypt(req.body.esp, process.env.SALT).toString()
console.log(req.body.esp)
    console.log(sp)
    console.log(spks)
    return res.status(200).json({ status: "success", message: "data encrypted", data: { spks: spks,sp:sp  } })

}



exports.addAccount = async (req, res) => {
    console.log("asaaaasdasfdfsdgsdga")
  
    // chek wallet exist
    const wallet = await Wallet.findOne( {seedHash: {$eq:req.body.walletHash} })
    if (!wallet) {
        return res.status(404).json({ status: "fail", message: "wallet not found" })

    }


const saltyEpk = CryptoJS.AES.encrypt(req.body.epk, process.env.SALT).toString()

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



    return res.status(201).json({ status: "success", message: "account has been created", account: account, sepk:saltyEpk })


}


