const mongoose = require("mongoose")

const NetworkScehma = new mongoose.Schema(

    {
        name: {
            type: String,
            required: [true, "username must be given"]
        },
        providerURL: {
            type: String,
            required: [true, "username must be given"]
        },
        scanURL: {
            type: String,
            required: [true, "username must be given"]
        },
        coinName: {
            type: String,
            required: [true, "username must be given"]
        },
        chainId: {
            type: String,
            required: [true, "username must be given"]
        },
        wallet:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet"
        }


    }

)



const Network = mongoose.model("Network", NetworkScehma);



module.exports = Network;