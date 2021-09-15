const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()

const pinRoute = require("./Routes/Pins")
const userRoute = require("./Routes/Users")

dotenv.config()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(
    () =>{
    console.log("MongoDB connected")
}).catch( error => console.log(error))

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

app.listen(8881, () => {
    console.log("Backend server is working")
})