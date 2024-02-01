const mongoose = require("mongoose")

const TokenScehma = new mongoose.Schema(

    {
        name: {
            type: String,
            required: [true, "username must be given"]
        },
        address: {
            type: String,
            required: [true, "username must be given"]
        },
        symbol: {
            type: String,
            required: [true, "username must be given"]
        },
        decimal: {
            type: Number,
            required: [true, "username must be given"]
        },
        network: {
            type: String,
            required: [true, "username must be given"]
        },
        account:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account"
        }


    }

)



const Token = mongoose.model("Token", TokenScehma);



module.exports = Token;