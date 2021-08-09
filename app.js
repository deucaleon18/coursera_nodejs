//Basic dependancies
const express=require('express')
const app=express()
const http=require('http')
const morgan=require('morgan')
const session=require('express-session')
const mongoose=require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session);


//Auth

const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const passport=require('passport')
const authenticate=require("./authenticate")
const config=require("./config")



//Routes
const dishRouter=require("./routes/dishRouter")
const userRouter=require("./routes/users")
const promoRouter=require("./routes/promoRouter")
const leaderRouter=require("./routes/leaderRouter")
const favoriteRouter=require("./routes/favoriteRouter")


require('dotenv').config()
const uri=process.env.MONGO_URI

try{
    mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true},
        () => console.log("Mongoose is connected")
      );
    }
catch{
    err=>{
        console.log(err)
        console.log("Coudn't connect")
    }
}

const store = new MongoDBStore({
    uri:uri,
    collection: 'mySessions'
  });

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// app.use(expressValidator())
app.use(cookieParser())



app.use(session({
    name:"session-id",
    secret: '1234-4321-1234--4321',
    resave: false,
    saveUninitialized:true,
    store:store
    // cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use("/users",userRouter)


app.use("/dishes",dishRouter)
app.use("/leaders",leaderRouter)
app.use("/promotions",promoRouter)
app.use("/favorites",favoriteRouter)

app.get("/",(req,res)=>{
    console.log(req.user)
    res.send("HOME PAGE")
})

http.createServer(app)

const PORT=process.env.PORT||3443

const hostname="localhost"

app.listen(PORT,hostname,()=>{
    console.log(`Connected to http://${hostname}:${PORT}`)
})