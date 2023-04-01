const crypto=require("crypto")
const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")



const userSchema=new mongoose.Schema(
    {
        name:
        {
         type:String,
         required:[true,"Please tell us your name"]
        },
        email:
        {
            type:String,
            required:[true,"Please provide your email"],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,"Please provide a valid email"]
        }, 
        role:
        {
        type:String,
        enum:["user","guide","lead-guide","admin"]
        },
        password:
        {
         type:String,
         required:[true,"Please provide a password"],
         minlength:8,
         select:false
        }, 
        passwordConfirm:
         {
         type:String,
         required:[true,"Please confirm password"],
         select:false,
         validate: {
            // This only works on CREATE and SAVE!!!
            validator: function() {
              return this.password == this.passwordConfirm;
            },
            message: 'Passwords are not the same!'
          }
        },
         passwordChangedAt:
         {
          type:Date
         },
         passwordResetToken:
         {type:String},
         passwordResetExpires:
         {type:Date},



            
         
         
         
    }
)
userSchema.pre("save",async function(next){
if(!this.isModified("password")) return next()

this.password=await bcrypt.hash(this.password,12)

this.passwordConfirm=undefined

})

userSchema.pre("save",function(next)
{
  if(!this.isModified("password")||this.isNew) return next()

  this.passwordChangedAt=Date.now()-1000
  next()
  
})


userSchema.methods.correctPassword=async function(inputPassword,truePassword)
{
 return await bcrypt.compare(inputPassword,truePassword)
}


userSchema.methods.changedPasswordAfter= function(JWTTimestamp)
{
    if(this.passwordChangedAt)
   {
    let changedPasswordTime=parseInt(
    this.passwordChangedAt.getTime()/1000,10)

    
      return JWTTimestamp<changedPasswordTime
    }

// False measn no password change
    return false
}

userSchema.methods.createPasswordResetToken=function()
{
  const resetToken=crypto.randomBytes(32).toString("hex")

  this.passwordResetToken=crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex")

  this.passwordResetExpires=Date.now()+10*6*1000


  return resetToken

  next()
}

const User=new mongoose.model("User",userSchema)


module.exports=User