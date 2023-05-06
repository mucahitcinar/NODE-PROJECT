const User=require("../models/userModel")
const jwt=require("jsonwebtoken")
const AppError=require("./../utils/appError")
const {promisify}=require("util")
const sendEmail=require("./../utils/email")
const crypto=require("crypto")
var bodyParser = require('body-parser')

const signtoken=id=>jwt.sign({id},process.env.JWT_SECRET,
  {
    expiresIn:process.env.JWT_EXPIRE_IN
  }
  )
exports.signup=async(req,res,next)=>
{
try
{
    const newUser=await User.create(
      {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt:req.body.passwordChangedAt,
        role:req.body.role
      }
    )
   const token=signtoken(newUser._id)
    res.status(201).json(
        {
            status:"success",
            data:
            {
              token,
              user:newUser

            }
        }
    )

}
catch(err)
{
  next(err)
}


}


exports.login=async(req,res,next) =>
{
 try
 {
    //Check if email or password exists

    const { email,password}=req.body

    if(!email || !password)
    {
      return next(new AppError("Please provide email and password",400))
    }
    // check if user exists and password is correct

    const user=await User.findOne({email}).select("+password")

    if(!user || !await user.correctPassword(password,user.password))
    {
      return next(new AppError("Incorrect email or password",888))
    }

    // if everything is okey send token to client

    const token=signtoken(user._id)

    res.status(200).json(
      {
        status:'success',
        token

      }
    )
 }
 catch(err)
 {
  next(err)
 }
}


exports.protect=async(req,res,next)=>
{

  try
  {
  //Getting token and checking if it is there
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
  {
   token=req.headers.authorization.split(" ")[1]
  }

  if(!token)
  {
   return next(new AppError("You are not logged in.Please log in to get access",401))
  }

  //Token verification

  const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
  


  //check if user still exists

  const currentUser=await User.findById(decoded.id)
  if(!currentUser)
 {
   return next(
  new AppError("The user belonging to this token doest no longer exist",
  401)
   )
 }

  // //check if password changed

  if(currentUser.changedPasswordAfter(decoded.iat))
  {
   return next(new AppError("User recently changed password",
 401))
  }
 
req.user=currentUser



next()

  }
  catch(err)
  {
    next(err)
  }

}

exports.restrictTo=(...roles)=>
{
  return (req,res,next)=>
  {
    if(!roles.includes(req.user.role))
    {
      return next(new AppError("You do not have permission to perform this action",403))
    }

    next()
  }
}


exports.forgotPassword=async (req,res,next)=>
{
  try
   {//Get user based on POSTed email
   const user=await User.findOne({email:req.body.email})

   if(!user)
   {
    return next(new AppError("There is no any user with this email address",404))
   }


   //Generate the random reset token
   const resetToken= user.createPasswordResetToken()
   await user.save({validateBeforeSave:false})



   // send it to user s email
  try
  {
  const resetURL=`${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`
  const message= `Forgot your password?Submit a PATCH requestwith your new password
  passwordConfirm to: ${resetURL}.\n If you didnt forget your password,please ignore this email`

  await sendEmail({
    email:user.email,
    subject: "Your password reset token (valid for 10 min)",
    message

  })

  res.status(200).json({
    status:"success",
    message:"Token sent to email"
  })
  }
  catch(err)
  {
     user.passwordResetToken=undefined
     user.passwordResetExpires=undefined
     await user.save({validateBeforeSave:false})
     next(new AppError("There was an error while sending the email.Try again later",500))

  }


  //
   }
   catch(err)
   {
     next(err)
   }
}


exports.resetPassword=async(req,res,next)=>
{
  try
  {
    //Get user based on the token

    const hashedToken=crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex")

    
const user=await User.findOne(
  {passwordResetToken:hashedToken,
   passwordResetExpires:{$gt:Date.now()}
  })

    if(!user)
    {
      next(new AppError("Token is invalid or has expired",500))
    }
    
    
    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    await user.save()
    const token=signtoken(user._id)

    res.status(200).json(
      {
        status:"success",
        token
      }
    )
  //update changedpasswordat property for the user
  //Log the user in,send JWT
  
  }
  catch(err)
  {
    next(err)
  }
}



exports.updatePassword=async (req,res,next)=>
{
 
 try
 {

 //1)Get user from collection 
  const user=await User.findById(req.user.id).select("+password")

 //2)Check if the POSTed current password is correct

 const oldpassword=req.body.oldpassword
 
 if(!(await user.correctPassword(oldpassword,user.password)))
 {
   next(new AppError("Please enter the correct password"))
 }

 //3)If so update password

 if(req.body.newPassword==oldpassword)
 {
  next (new AppError("Please enter a new password that is different from previous one",401))
 }

 user.password=req.body.newPassword
 user.passwordConfirm=req.body.confirmNewPassword
 await user.save()

 
 
 //4)send JWT

 const token=signtoken(user._id)

 res.status(200).json({
  status:"success",
  token
 })
}
 catch(err)
 {
  next(err)
 }

 
}