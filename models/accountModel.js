const mongoose = require("mongoose")

const AccountScehma = new mongoose.Schema(

    {
        accountNumber: {
            type: Number,
            required: [true, "username must be given"]
        },
        name: {
            type: String,
            required: [true, "name must be given"]
        },

        address: {
            type: String,
            required: [true, "address must be given"]
        },
        tokens:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Token"
            }],
        wallet:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet"
        }


    }

)



const Account = mongoose.model("Account", AccountScehma);



module.exports = Account;