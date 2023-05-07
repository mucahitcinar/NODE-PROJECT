const express=require("express")
const userControllers=require("./../controllers/usercontrollers")
const authController=require("./../controllers/authControllers")


const router=express.Router()


router.post("/signup",authController.signup)
router.post("/login",authController.login) 
router.patch("/updatePassword",authController.protect,authController.updatePassword)

router.post("/forgetPassword",authController.forgotPassword)
router.patch("/resetPassword/:token",authController.resetPassword) 

router.patch("/updateMe",authController.protect,userControllers.updateMe)

router.delete("/deleteMe",authController.protect,userControllers.deleteUser)

router 
.route("/")
.get(userControllers.getAllUsers)


router
 .route("/:id")
 .get(userControllers.getOneUser)


module.exports=router
