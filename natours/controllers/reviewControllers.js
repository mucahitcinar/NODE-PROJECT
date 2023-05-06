const AppError=require("./../utils/appError")
const Review=require("../models/reviewModel")
const { create } = require("../models/tourModel")
const factory=require("./handleFactory")




exports.createReview= async (req,res,next)=>
{
    try
    {

     if(!req.body.tour) req.body.tour=req.params.tourId
     if(!req.body.user) req.body.user=req.user.id

     const newReview= await Review.create(req.body)


     res.status(200).json(
     {
        status:"success",
        data:
          newReview
     })

     next()
    }
    catch(err)
    {
        next(err)
    }
}


exports.getAllReviews=async (req,res,next)=>

{
    try
    {

       let filtObj={}
       if(req.params.tourId) filtObj={tour:req.params.tourId}
       const reviews=await Review.find(filtObj)

       res.status(200).json(
        {
            status:"success",
            data:
             reviews
        }
       )

       next()
    }
    catch(err)
    {
        next(err)
    }

}


exports.deleteReview=factory.deleteOne(Review)
exports.updateReview=factory.deleteOne(Review)