const User=require('./models/user')
const express=require('express')
const userRouter=express.Router()

userRouter.get('/',(req,res,next)=>{
    res.send("<h1>Default Route</h1>")
})

userRouter.post("/signup",(req,res,next)=>{
User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
        res.StatusCode=500
        res.setHeader=("Content-Type","application/json")
        res.json({err:err})
    }
    else{
        passport.authenticate('local') (req,res,()=>{
            res.StatusCode=200
            res.setHeader=("Content-Type","application/json")
        })
    }
})
})

userRouter.post("/login",passport.authenticate(),(res,res,next)=>{
  res.statusCode=200,
  res.setHeader=("Content-type","application/json")
  res.json({success:true,message:"User has been successfully logged in"})

})

userRouter.get('/logout',(req,res,next)=>{
    req.session.destroy()
    res.clearCookie('session-id')
    res.statusCode=200
})