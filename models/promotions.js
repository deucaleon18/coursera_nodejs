const mongoose=require('mongoose')
const Schema=mongoose.Schema

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;
const promoSchema=new Schema({

        "name":{
        type:String,
        required:true
        }
        ,
        "image":{
            type:String,
            required:true
        },
        "label":{
            type:String,
            default:""
        },
        "price":{
            type:Currency,
            required:"true"
        },
        "description":{
            type:String,
            required:true
        },
        "featured":{
            type:Boolean,
            required:true
        }

})

const Promotions=mongoose.model('Promotions',promoSchema)
module.exports=Promotions