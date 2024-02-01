const Account = require("../models/accountModel")
const Token = require("../models/tokenModel")
const Wallet = require("../models/walletModel")





exports.getToken = async (req, res) => {

    const { walletId, accountId } = req.params
    const account = await Account.findById(accountId).populate("tokens")
    if (!account) {
        return res.status(404).json({ status: "fail", message: "account not found" })
    }

    const tokens = account.tokens

    return res.status(200).json({ status: "success", message: "tokens have been sent", tokens: tokens })
}


exports.importToken = async (req, res) => {

    const { accountId } = req.params

    console.log(accountId)


    // chek wallet exist
    const wallet = await Wallet.findOne( {seedHash: {$eq:req.body.walletHash} })
    if (!wallet) {
        return res.status(404).json({ status: "fail", message: "wallet not found" })

    }


    // find account of id
    const account = await Account.findById(accountId)
    console.log(account)
    if (!account) {
        return res.status(404).json({ status: "fail", message: "account not found" })
    }

    // create token
    console.log(req.body) // token is in the req body

    const token = new Token({
        ...req.body
    })
    // Associate the token with the account
    token.account = account;

    await token.save()

    account.tokens.push(token)
    await account.save()





    // if account does not exist then throw error
    // Todo

    return res.status(201).json({ status: "success", message: "token has been imported", token:token })
}

