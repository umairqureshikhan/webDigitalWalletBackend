const mongoose = require("mongoose")

const ActivityScehma = new mongoose.Schema(

    {
        txHash: {
            type: String,
            required: [true, "username must be given"]
        },
        status: {
            type: Boolean,
            required: [true, "username must be given"]
        },
        from: {
            type: String,
            required: [true, "username must be given"]
        },
        to: {
            type: String,
            required: [true, "username must be given"]
        },
        date: {
            type: Date,
            required: [true, "username must be given"]
        },
        network: {
            type: Date,
            required: [true, "username must be given"]
        },
        account:
        {
            type: Schema.Types.ObjectsId,
            ref: "Account"
        }


    }

)



const Activity = mongoose.model("Activity", ActivityScehma);



module.exports = Activity;