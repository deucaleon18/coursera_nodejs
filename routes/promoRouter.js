const express=require('express')
const promoRouter=express.Router()
const Promotions=require('../models/promotions')
const bodyParser=require('body-parser')
promoRouter.use(bodyParser.json())
promoRouter.route('/')

   .get((req,res,next)=>{
    Promotions.find({})
    .then((promotions)=>{
        if(promotions.length!=0)
       { console.log('These are the existing promotions',promotions)
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions)}
        console.log('There are no promotions currently')
        res.end('<h1>There are no promotions currently</h1>')
    },
        (err)=>next(err))
    .catch((err)=>next(err))
    })
    .post((req,res,next)=>{
        Promotions.create(req.body)
        .then((promotion)=>{
            res.statusCode=200,    
            res.setHeader('Content-Type', 'application/json');
            console.log('New promotion has been created ',promotion)
            res.json(promotion)
        },err=>next(err))
        .catch((err)=>next(err))
    })
    .put((req,res,next)=>{
        res.statusCode=403,
        console.log('PUT operation is not supported on this route')
        res.end('<h1> PUT operation is not supported on this route</h1>')
    })
    .delete((req,res,next)=>{
    
        Promotions.deleteMany({})
        .then((promotions)=>{
            console.log('All the promotions were deleted',promotions)
            res.statusCode=200
            res.json(promotions)
    })
        .catch((err)=>{
            next(err)
        })
    })

    promoRouter.route('/:promoId')
   .get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        if(promotion!=null)
        {console.log('This is the required promotion',promotion)
        res.statusCode=200,
        res.setHeader('Content-Type','application/json');
        res.json(promotion)}
         else{
            res.statusCode=404
            res.end('<h1>The current promotion does not exist</h1>')
        }}
       
        ,
        (err)=>next(err))
    .catch((err)=>next(err))
})
.post((req,res,next)=>{
    res.statusCode=403,
    res.end("<h1>POST operation is not supported on this route</h1>")
})
.put((req,res,next)=>{
  Promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
.then((promotion)=>{
    console.log('This is the updated promotion',promotion)
    res.statusCode=200,
    res.setHeader('Content-Type','application/json');
    res.json(promotion)},
    (err)=>next(err))
.catch((err)=>next(err))
})

.delete((req,res,next)=>{
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((promotion)=>{
        console.log('This promotion has successfully been deleted',promotion)
        res.statusCode=200,
        res.setHeader('Content-Type','application/json');
        res.json(promotion)},
        (err)=>next(err))
    .catch((err)=>next(err))
})



module.exports=promoRouter;