const mongoose=require("mongoose")
const Schema=mongoose.Schema

const commentSchema=new Schema({
    comment:{
        type:"String",
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    }
})
const dishSchema=new Schema({
 "name":{
     type:"String",
     required:true
 },
 "description":{
     type:"String",
     required:true
 },
 "image":{
     type:"String",
     required:true
 },
 "category":{
    type:"String",
    required:false
 },
 "label":{
    type:"String",
    required:false,
    default:""
 },
 "featured":{
    type:"String",
    required:false
 },
 "comments":[commentSchema]},
 {
     timestamps:true
    
})



module.exports=mongoose.model('Dishes',dishSchema)