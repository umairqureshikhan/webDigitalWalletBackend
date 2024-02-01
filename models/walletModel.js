const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const walletScehma = new mongoose.Schema(

    {
        username: {
            type: String,
            required: [true, "username must be given"]
        },
        password: {
            type: String,
            required: [true, "username must be given"]
        },
        seedHash: {
            type: String,
            required: [true, "username must be given"]
        },
        accountCount: {
            type: Number,
            default: 0
        },
        accounts: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Account"
            }
        ],

        networks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Network"
            }
        ]

    }

)

// walletScehma.pre("save", async function (next) {

//     if (this.password.isModified("password")) {
//         try {

//             const hash = await bcrypt.hash(this.password, process.env.SALT)
//             this.password = hash
//             next()
//         }
//         catch (e) {
//             next(e)
//         }
//     }
// })


// walletScehma.methods.comparePassword(async function (password) {

//     if (!password) {
//         throw new Error("Password is missing")
//     }
//     try {

//         const isValid = await bcrypt.compare(password, this.password)
//         return isValid
//     }
//     catch (e) {

//     }
// })
const Wallet = mongoose.model("Wallet", walletScehma);



module.exports = Wallet;