const mongoose=require("mongoose")
const slugify=require("slugify")
const User=require("../models/userModel")


const tourSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"A TOUR MUST HAVE A NAME"],
            unique:true,
            maxlength:[40,"A tour name must have less or equal than 40 characters"],
            minlength:[10,"A tour name must have more or equal than 10 characters"]
        },
        slug:String,
        duration:
        {
            type:Number,
            required:[true,"A tour must have a duration"]
        }
        ,
        maxGroupSize:
        {
            type:String,
            required:[true,"A tour must have a group size"]
        },
        difficulty:
        {
            type:String,
            required:[true,"A tour must have a difficulty"],
            enum:
            {
                values:["easy","medium","difficult"],
                message:"Difficulty is either:easy,medium,difficult"
            }
        },

        ratingsAverage:
        {
            type:Number,
            default:4.5,
            min:[1,"A tour rating must be above 1.0"],
            max:[5,"A tour rating must be below 5.0"]
        },
        ratingsQuantity:
        {
            type:Number,
            default:0
        },
        price:
        {
            type:Number,
            required:[true,"A TOUR MUST HAVE A PRICE"]
        },
        priceDiscount:
        {type:Number,
         
         validate:{ validator:function(val){


            return val<this.price
         },
         message:"Discount price {{VALUE}} should be below regular price"

         }
        
        },

        summary:
        {
            type:String,
            trim:true,
            required:[true,"A TOUR MUST HAVE A SUMMARY"]
        },
        description:
        {
            type:String,
            trim:true
        },
        imageCover:{
            type:String,
            required:[true,"A TOUR MUST HAVE A COVER IMAGE"]
        },
        images:[String],
        createdAte:
        {
            type:Date,
            default:Date.now(),
            select:false
        },
        startDates:[Date],

        secretTour:
        {
            type:Boolean,
            default:false
        },
        startLocation:
        {
            type:
            
            {
                type:String,
                default:"Point",
                enum:["Point"]
            },
            coordinates:[Number],
            address:String,
            description:String
        },

        locations:
        [
            {type:
             {
                type:String,
                default:"Point",
                enum:["Point"]
              },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
            }
        ],
        guides:[],
    




    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)

tourSchema.virtual("durationWeeks").get(function()
{
    return this.duration/7
})

//virtual populate
tourSchema.virtual("reviews",
{
    ref:"Review",
    foreignField:"tour",
    localField:"_id"

})

//DOCUMENT MIDDLEWARE
//this middleware only works before .save and .create not before update
tourSchema.pre("save",function(next){

    this.slug=slugify(this.name,{lower:true})
    next()
})

tourSchema.pre("save",async function(next)
{
    const guidePromises=this.guides.map(async id=>await User.findById(id))

    this.guides=await Promise.all(guidePromises)
  

    next()
})
 
tourSchema.pre(/^find/,function(next){
     this.find({ secretTour :{ $ne:true}})
     this.start=Date.now()
    next()
})

tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} miliseconds`)
    next()
  
})


tourSchema.pre("aggregate",function(next){
    this.pipeline().unshift({ $match:{ secretTour:{$ne:true}}})
    next()
})

const Tour=mongoose.model('Tour',tourSchema)

 module.exports=Tour


