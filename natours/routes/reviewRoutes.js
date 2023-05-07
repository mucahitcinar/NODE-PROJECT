const express=require("express")
const reviewControllers=require("./../controllers/reviewControllers")
const authController=require("./..//controllers/authControllers")



const router=express.Router({mergeParams:true})


router
      .route("/")
      .post(authController.protect,authController
      .restrictTo("user"),
      reviewControllers.createReview)
      .get(reviewControllers.getAllReviews)
    


router
      .route("/:id")
      .delete(reviewControllers.deleteReview)
      .patch(reviewControllers.updateReview)
      .get(reviewControllers.getReview)

module.exports=router