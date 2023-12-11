const mongoose=require('mongoose')
const Schema= mongoose.Schema

const UserSchema= new Schema({
    fname:{type: String,required:true},
    username:{type:String,requried:true,unique:true},
    passwd:{type:String,requried:true},
    phone_n0:{type:Number ,requried:true},
    role:{type:String,default:'customer'}   
},{timestamps:true})

module.exports=mongoose.model('User',UserSchema)
