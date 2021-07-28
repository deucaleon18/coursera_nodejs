const User=require('../models/user')
const passport=require('passport')
const express=require('express')
const userRouter=express.Router()
// const authenticate=require('../authenticate')
const bodyParser=require('body-parser')

userRouter.use(bodyParser.json())
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
            res.json({success:true,status:"Registeration is successful"})
        })
    }
    next()
})
})

userRouter.post("/login",passport.authenticate(),(req,res,next)=>{

//   var token=authenticate.getToken({_id:req.user._id});
  res.statusCode=200,
  res.setHeader=("Content-type","application/json")
  res.json({success:true,message:"User has been successfully logged in"})

})

userRouter.get('/logout',(req,res,next)=>{
    if(req.session)
    {req.session.destroy()
    res.clearCookie('session-id')
    res.statusCode=200;
     res.redirect('/')}
})

module.exports=userRouter;