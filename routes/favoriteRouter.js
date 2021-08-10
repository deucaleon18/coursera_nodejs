
const express=require('express')
const Favorites=require('../models/favorite')
const favoriteRouter=express.Router()
const bodyParser=require('body-parser')
const authenticate=require("../authenticate")
favoriteRouter.use(bodyParser.json())

favoriteRouter.route("/")

.get(authenticate.verifyUser,async(req,res,next)=>{
 await Favorites.findOne({user:req.user._id})
 .populate('dishes._id')
 .populate('user')
 .then((favorites)=>{

    res.statusCode=200
    res.setHeader('Content-Type','application/json')
    res.json(favorites)

 },err=>next(err))
.catch((err)=>next(err))
})

.post(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.findOne({user:req.user._id})
   .then(async(favorites)=>{
       if(favorites!=null){
          
          for(let i=0;i<req.body.length;i++)
        
          {  if(favorites.dishes.indexOf(req.body[i])===-1)
            {await favorites.dishes.push(req.body[i])} 
           favorites.save()
           .then(async()=>{
            await Favorites.findOne({user:req.user._id})
            .populate('dishes._id')
            .populate('user')
            .then((favorites)=>{ res.statusCode=200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorites)
            }) .catch((err)=>next(err))
              
           }) .catch((err)=>next(err))
        } }

       else if(favorites==null){
         await Favorites.create({user:req.user._id})
         .then(async(favorites)=>{
            if(favorites.dishes.indexOf(req.body[i])===-1)
            {await favorites.dishes.push(req.body[i])} 
                favorites.save()
                .then(async()=>{
                    await Favorites.findOne({user:req.user._id})
                    .populate('dishes._id')
                    .populate('user')
                    .then((favorites)=>{ res.statusCode=200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favorites)
                    }) .catch((err)=>next(err))
                   
                }) .catch((err)=>next(err))
            })
        .catch((err)=>next(err))
       }

     else{
         return res.json(favorites)
     }

   },err=>{next(err)})
   .catch((err)=>next(err))
})



.delete(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.findOneAndRemove({user:req.user._id})
    .populate('user')
    // .populate('dishes._id')
    // .then((favorites)=>{
    //     for(let i=0;i<favorites.dishes.length;i++){
    //         favorites.dishes[i].remove()
    //     }
    //    favorites.save()
    //    .then(async()=>{
    //     await Favorites.findOne({user:req.user._id})
    //                 // .populate('dishes._id')
    //                 .populate('user')
                    .then((favorites)=>{ res.statusCode=200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favorites)
                    }) .catch((err)=>next(err))
    
    // })
    //    .catch((err)=>{next(err)})

    // })
    // .catch((err)=>{next(err)})
})


favoriteRouter.route("/:dishId")

.post(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.findOne({user:req.user._id})
   
    .then(async(favorites)=>{
        if(favorites!=null &&favorites.dishes.indexOf(req.params.dishId)===-1)
       { 
           await favorites.dishes.push(req.params.dishId)
       favorites.save()
       .then(async()=>{
        await Favorites.findOne({user:req.user._id})
        .populate('dishes._id')
        .populate('user')
        .then((favorites)=>{ res.statusCode=200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
        }) .catch((err)=>next(err))
    
    })
       .catch((err)=>{next(err)})
       }

     else if(favorites==null){
      await Favorites.create({user:req.user._id})
      .then(async(favorites)=>{
            await favorites.dishes.push(req.params.dishId)
            favorites.save()
            .then(async()=>{
                await Favorites.findOne({user:req.user._id})
                .populate('dishes._id')
                .populate('user')
                .then((favorites)=>{ res.statusCode=200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorites)
                }) .catch((err)=>next(err))
           }
         ) .catch((err)=>next(err))
      })
     .catch((err)=>next(err))
    }

       
    },err=>{next(err)})
    .catch((err)=>{next(err)})
})

.delete(authenticate.verifyUser,async(req,res,next)=>{
    await Favorites.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes._id')
    .then(async(favorites)=>{
        await favorites.dishes.pop(req.params.dishId)
       favorites.save()
       .then(async()=>{
        await Favorites.findOne({user:req.user._id})
                    .populate('dishes._id')
                    .populate('user')
                    .then((favorites)=>{ res.statusCode=200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favorites)
                    }) .catch((err)=>next(err))
    
    })
       .catch((err)=>{next(err)})
    })
    .catch((err)=>{next(err)})
})
module.exports=favoriteRouter

