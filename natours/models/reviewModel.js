const mongoose=require("mongoose")

let reviewSchema=new mongoose.Schema(
    {
        review:
        {
            type:String,
            required:[true,"Review cant be empty!"]
        },
        rating:
        {
            type:Number,
            min:1,
            max:5
        },
        createdAt:
        {
            type:Date,
            default:Date.now()
        },
        tour:
        {
          type:mongoose.Schema.ObjectId,
          ref:"Tour",
          require:[true,"A review must have a tour"]

        },
        user:
        {
          type:mongoose.Schema.ObjectId,
          ref:"User",
          require:[true,"A review must have an author"]
        }

    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)


reviewSchema.pre(/^find/,function(next)
{
     this.populate
    (
    {
        path:"user",
        select:"name photo"
    })

     next()
})

const Review=new mongoose.model("Review",reviewSchema)

module.exports=Review