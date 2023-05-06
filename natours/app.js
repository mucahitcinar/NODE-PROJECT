const { deepStrictEqual } = require("assert")
const express=require("express")
const fs=require("fs")
const morgan =require("morgan")

const AppError=require("./utils/appError")
const globalErrorHandler=require("./controllers/errorControllers")
const toursRouter=require("./routes/tourRoutes")
const usersRouter=require("./routes/userRoutes")
const reviewRouter=require("./routes/reviewRoutes")

const app=express()
app.use(express.json())
app.use(morgan("dev"))
app.use(express.static(`${__dirname}/public`))


app.use("/api/v1/users",usersRouter)
app.use("/api/v1/tours",toursRouter)
app.use("/api/v1/reviews",reviewRouter)

app.all("*",(req,res,next)=> {
next(new AppError(`Can't find ${req.originalUrl} on this server!`,404))
 })


app.use(globalErrorHandler)



module.exports = app
   









