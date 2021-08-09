
const express=require('express')
const Favorites=require('../models/favorite')
const favoriteRouter=express.Router()
const bodyParser=require('body-parser')
const authenticate=require("../authenticate")
favoriteRouter.use(bodyParser.json())

favoriteRouter.route("/")


.get(authenticate.verifyUser,async(req,res,next)=>{
 await Favorites.find({user:req.user._id})
 .populate('dishes')
 .populate('user')
 .then((favorites)=>{
    res.statusCode=200
    res.setHeader('Content-Type','application/json')
    res.json(favorites)
 },err=>next(err))
.catch((err)=>next(err))
})

.post(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.find({user:req.user._id})
   .then((favorites)=>{

   })
   .catch((err)=>next(err))
})

.delete(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        for(var i=0;i<dishes.length;i++){
            favorites.dishes[i].pop()
        }
       favorites.save()
       .then((favorites)=>{
        res.statusCode=200
        res.setHeader('Content-Type','application/json')
        res.json(favorites)

       },err=>{next(err)})
       .catch((err)=>{next(err)})

    })
    .catch((err)=>{next(err)})
})


favoriteRouter.route("/:dishId")

.post(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then(async(favorites)=>{
        if(favorites!=null)
        await favorites.dishes.push(req.params.dishId)
       favorites.save()
       .then((favorites)=>{
        res.statusCode=200
        res.setHeader('Content-Type','application/json')
        res.json(favorites)

       }
       
       ,err=>{next(err)})
       .catch((err)=>{next(err)})

    })
    .catch((err)=>{next(err)})
})

.delete(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then(async(favorites)=>{
        await favorites.dishes.pop(req.params.dishId)
       favorites.save()
       .then((favorites)=>{
        res.statusCode=200
        res.setHeader('Content-Type','application/json')
        res.json(favorites)

       },err=>{next(err)})
       .catch((err)=>{next(err)})
    })
    .catch((err)=>{next(err)})
})
module.exports=favoriteRouter