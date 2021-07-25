const express =require('express')
const morgan=require('morgan')
const app = express()
const http=require('http')
const port=3000
const hostname='localhost'
const mongoose=require('mongoose')
const promoRouter=require('./routes/promoRouter')
const leaderRouter=require('./routes/leaderRouter')
const uri="mongodb+srv://shubham37908:shantamveena@nodeprojects.xkeh1.mongodb.net/Coursera?retryWrites=true&w=majority"
const passport=require('passport')
const config=require('./config')
const session=require('express-session')
const userRouter=require('./routes/users')
app.use(session({
  secret: 'session-id',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


app.use(morgan('dev'))

app.use(passport.initialize())
app.use(passport.session())



app.use('/users',userRouter)
app.use('/leaders',leaderRouter)
app.use('/promotions',promoRouter)
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


const server=http.createServer(app)

server.listen(port,hostname,()=>{
    console.log(`Connected to http://${hostname}:${port}`)
})