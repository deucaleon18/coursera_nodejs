
const express =require('express')
const morgan=require('morgan')
const app = express()
const http=require('http')
const port=3000
const hostname='localhost'
const mongoose=require('mongoose')
const promoRouter=require('./routes/promoRouter')
const leaderRouter=require('./routes/leaderRouter')
require('dotenv').config();
const uri=process.env.MONGO_URI
const passport=require('passport')
const config=require('./config')
const session=require('express-session')
const userRouter=require('./routes/users')

// const Filestore=require('session-file-store')
try {
  // Connect to the MongoDB cluster
   mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );

} catch (e) {
  console.log("could not connect");
}

app.use(session({
  name:'session-id',
  secret:config.secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())

app.use('/users',userRouter)
const auth=(req,res,next)=>{

if(!req.user){
 var err=new Error("You are not authenticated")
 err.status=401
 return next(err)
}
else(next())
}

app.use(auth)



app.use('/leaders',leaderRouter)
app.use('/promotions',promoRouter)


const server=http.createServer(app)

server.listen(port,hostname,()=>{
    console.log(`Connected to http://${hostname}:${port}`)
})