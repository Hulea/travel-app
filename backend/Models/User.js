const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:15,
        unique:true
    },
    email:{
        type:String,
        require:true,
        max:30,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:5
    }
},

{timestamps:true});


module.exports = mongoose.model("User",UserSchema);