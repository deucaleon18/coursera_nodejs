const express=require('express')
const bodyParser=require('body-parser')
const leaderRouter=express.Router()

const Leaders=require('../models/leaders')

leaderRouter.use(bodyParser.json())
leaderRouter.route('/')

.get((req,res,next)=>{
Leaders.find({})
.then((leaders)=>{
    if(leaders.length!=0)
    {console.log('These are all the leaders',leaders)
    res.statusCode=200,
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders)}
console.log('There are no leaders currently')
res.end('<h1>There are no leaders currently</h1>')
},
    (err)=>next(err))
.catch((err)=>next(err))
})

.post((req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode=200,    
        res.setHeader('Content-Type', 'application/json');
        console.log('You have created a new leader',leader)
        res.json(leader)
    },err=>next(err))
    .catch((err)=>next(err))
})

.put((req,res,next)=>{
    res.statusCode=403,
    console.log('PUT operation is not supported on this route')
    res.end('<h1> PUT operation is not supported on this route</h1>')
})
.delete((req,res,next)=>{

    Leaders.deleteMany({})
    .then((leaders)=>{
        console.log('All the leaders were successfully deleted',leaders)
        res.statusCode=200
        res.json(leaders)
    })
    .catch((err)=>{
        next(err)
    })
})

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        if(leader!=null)
        {console.log('This is the required leader',leader)
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)}
        else{
            res.statusCode=404
            res.end('<h1>The current leader does not exist</h1>')
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
Leaders.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true})

.then((leader)=>{
    console.log('This is the updated leader',leader)
    res.statusCode=200,
    res.setHeader('Content-Type', 'application/json');
    res.json(leader)},
    (err)=>next(err))
.catch((err)=>next(err))
})

.delete((req,res,next)=>{
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((leader)=>{
        console.log('The leader has been successfully deleted',leader)
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)},
        (err)=>next(err))
    .catch((err)=>next(err))

})



module.exports=leaderRouter;