const express=require("express")
const tourControllers=require("./../controllers/tourcontrollers")
const authController=require("./..//controllers/authControllers")
const reviewRouter=require("./../routes/reviewRoutes")



const router=express.Router()


router.use("/:tourId/Reviews",reviewRouter)

router
     .route("/monthly-plan/:year")
     .get(tourControllers.getMonthlyPlan)
     

router
      .route("/tour-stats")
      .get(tourControllers.getTourStats)


router
     .route("/top-5-cheap")
     .get(tourControllers.aliasing,tourControllers.getAlltours)

router
    .route("/")
    .get(authController.protect,tourControllers.getAlltours)
    .post(tourControllers.createNewtour)

router
    .route("/:id")
    .patch(tourControllers.updateTour)
    .get(authController.protect,tourControllers.getTour)
    .delete(authController.protect,authController.restrictTo("admin","lead-guide"),tourControllers.deleteTour)



module.exports=router