const express=require("express")
const userControllers=require("./../controllers/usercontrollers")
const authController=require("./../controllers/authControllers")


const router=express.Router()


router.post("/signup",authController.signup)
router.post("/login",authController.login) 
router.patch("/updatePassword",authController.protect,authController.updatePassword)

router.post("/forgetPassword",authController.forgotPassword)
router.patch("/resetPassword/:token",authController.resetPassword) 

router 
.route("/")
.get(userControllers.getUsers)
.post(userControllers.createNewUser)

router
 .route("/:id")
 .patch(userControllers.updateUsers)
 .delete(userControllers.deleteUser)
 .get(userControllers.getOneUser)


module.exports=router
