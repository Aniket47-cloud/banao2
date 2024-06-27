const mongoose=require('mongoose')

const MernSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})

const MernModel= mongoose.model("users",MernSchema)

module.exports=MernModel;