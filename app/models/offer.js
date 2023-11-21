const mongoose=require('mongoose')
const Schema = mongoose.Schema

const offerSchema = new Schema({
    i_name:{ type:String, required:true},
    ex_change:{ type:String, required:true},
    i_rate:{type:Number, required:true}
})
module.exports = mongoose.model('Offer',offerSchema)