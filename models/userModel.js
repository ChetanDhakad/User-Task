const mongoose = require("mongoose");
const plm = require("passport-local-mongoose") //plm = passport local mongoose

const userSchema= new mongoose.Schema({
    username:String,
    password:String,
    contact:String,
    email: String,
    contact: String,
    task: String,
    heading:String,
},

    {timestamps:true}    

);


userSchema.plugin(plm)

const user = mongoose.model("user",userSchema)

module.exports = user;