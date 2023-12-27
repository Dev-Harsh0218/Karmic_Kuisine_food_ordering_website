const { Timestamp } = require('mongodb')
const mongoose=require('mongoose')
const Schema=mongoose.Schema

const orderStoreSchema= new Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    orderNo:{type:Number, required:true},
    items:{ type:Object, required:true},
    phone:{type:String, required:true},
    address:{type:String, required:true},
    payType:{type:String, default:'COD'},
    status:{type:String, default:'order_placed'},
},{timestamps:true})

module.exports= mongoose.model('order',orderStoreSchema)