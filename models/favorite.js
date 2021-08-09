const mongoose=require('mongoose')
const Schema=mongoose.Schema

const dishSchema=new Schema({

    dishId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dishes'
    }
})


const favoriteSchema=new Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dishes:[dishSchema]},
    {
        timestamps:true
    
})

module.exports=mongoose.model('Favorites',favoriteSchema)