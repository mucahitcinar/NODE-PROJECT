const AppError=require("./../utils/appError")
const Review=require("../models/reviewModel")
const { create } = require("../models/tourModel")
const factory=require("./handleFactory")





exports.getAllReviews=factory.getAll(Review)
exports.getReview=factory.getOne(Review)
exports.createReview=factory.createOne(Review)
exports.deleteReview=factory.deleteOne(Review)
exports.updateReview=factory.updateOne(Review)