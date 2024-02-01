const express = require("express")
const walletRouter = require("./routes/walletRoute")
const tokenRouter = require("./routes/tokenRoute")
const accountRouter = require("./routes/accountRouter")
const networkRouter = require("./routes/networkRouter")



const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require('cors')


dotenv.config({ path: ".env" })




const app = express()
app.use(cors())
app.use(express.json())
const port = 8080


app.use("/api/v1/wallet", walletRouter)
app.use("/api/v1/network", networkRouter)
app.use("/api/v1/account", accountRouter)
app.use("/api/v1/token", tokenRouter)
// app.use("/api/v1/activity")



//  db connection
const dbUrl = process.env.DATABASE_URL.replace("<password>", process.env.DATABASE_PASSWORD)
console.log(dbUrl)
mongoose.connect(dbUrl, {
    "useCreateIndex": true,
    "useFindAndModify": false,
    "useNewUrlParser": true
}).then((con) => {
    // console.log(con.connection)
    console.log("connectipon successfull")
})





app.listen(port, () => {
    console.log("server is running on port", port)
})