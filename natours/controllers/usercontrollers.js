const fs=require("fs")
const AppError=require("./../utils/appError")
const User=require("../models/userModel")
const factory=require("./handleFactory")

const filterObj=(obj,...allowedFields)=>
{
  let newObj={}

  Object.keys(obj).forEach(el=>
 {
  if(allowedFields.includes(el)) newObj[el]=obj[el]
 }
  )

  return newObj
}

exports.getAllUsers=factory.getAll(User)
exports.deleteUser=factory.deleteOne(User)
exports.getOneUser=factory.getOne(User)


exports.updateMe=async(req,res,next)=>{

try
{
      //1)Dont send req if user tries to use this route to update password
      if(req.body.password || req.body.passwordConfirm)
      {
          return next(new AppError("This route is not for updating password,please use update password route",
          400))
      }
  
      //2)Update the current user document
      let filteredBody=filterObj(req.body,"name","email")
      let updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,
      {
        new:true,
        runValidators:true
      })
      res.status(200).json(
      {
         status:"success",
         data:
         {
          updatedUser
         }
    
      })

}
catch(err)
{
    next(err)
}
  
}



