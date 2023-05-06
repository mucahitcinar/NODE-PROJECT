const fs=require("fs")
const AppError=require("./../utils/appError")
const User=require("../models/userModel")

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





exports.getAllUsers=async (req,res,next)=>
{
try
{
    let users=await User.find()
    res.status(200).json({
           status:"successssss",
           data:{
               users
           }
       })
   }
catch(err)
{
    next(err)
}
}


exports.createNewUser=(req,res)=>
{
    res.status(500).json({
        message:"THIS MODULE IS NOT WORKING YET",
        status:"success"
    })
}

exports.deleteMe=async (req,res)=>
{
try
{
    await User.findByIdAndUpdate(req.user.id,{active:false})
    res.status(200).json({
        
        status:"success",
        data:null
    })
}
catch(err)
{
    next(err)
}
    
}



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

exports.getOneUser=(req,res)=>{
    res.status(500).json({
        message:"THIS MODULE IS NOT WORKING YET",
        status:"success"
    })
}

