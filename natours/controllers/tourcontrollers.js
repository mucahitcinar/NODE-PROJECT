
var bodyParser = require('body-parser')
const { query } = require('express')
const AppError = require('../utils/appError')
const Tour = require('./..//models/tourModel')
const APIFEATURES=require("./../utils/apiFeaturs")
const factory=require("./handleFactory")











exports.aliasing=(req,res,next)=>
{
   req.query.limit="5",
   req.query.fields="name ratingsAverage difficulty price summary"
   req.query.sort="-ratingsAverage,price"
   next()
}

exports.getAlltours=factory.getAll(Tour)
exports.getTour=factory.getOne(Tour)
exports.createNewtour=factory.createOne(Tour)
exports.updateTour=factory.updateOne(Tour)
exports.deleteTour=factory.deleteOne(Tour)
    


exports.getTourStats=async (req,res,next) =>
    {
      try
      {
        const stats= await Tour.aggregate([
            {
                $match:{ ratingsAverage:{$gte:4.5}}
            },

        {
          $group:
          {
            _id:{ $toUpper:"$difficulty"},
            num:{ $sum:1},
            numRatings:{ $sum:"$ratingsQuantity"},
            avgRating:{ $avg:"$ratingsAverage"},
            avgPrice:{$avg:"$price"},
            minPrice:{$min:'$price'},
            maxPrice:{$max:'$price'}

          }
        },
        {
            $sort:{ avgPrice:1}
        },
        // {
        //     $match:{ _id:{ $ne:"EASY"}}
        // }
        ])

        res.status(200).json(
            {
                status:"success",
                data:{
                    stats
                }
            }
        )
      }
      catch(err)
      {
        next(err)
      }

    }

exports.getMonthlyPlan=async (req,res,next)=>
{
    try
    { 
      let year=req.params.year*1

      const plan= await Tour.aggregate(
        [
            {
               $unwind:"$startDates"
            },
            {
              $match:{
                startDates:
                {
                  $gte:new Date(`${year}-01-01`),
                  $lte:new Date(`${year}-12-31`)
                }
              }
            },
            {
                $group:
                {
                  _id:{ $month:"$startDates"},
                  numTourStarts:{ $sum:1},
                  tours:{ $push:'$name'}
                },
            },
            {
                    $addFields:{month:"$_id"}
            },
            {
                $project:
                {
                    _id:0
                }
            },
            {
                $sort:{ numTourStarts:-1}
            },
            {
                $limit:12
            }


            ]
      )


      res.status(200).json(
        {
            status:"success",
            data:{
                plan
            }

        })


      
    }
    catch(err)
    {
        next(err)
    }
}