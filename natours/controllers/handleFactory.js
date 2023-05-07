const AppError=require("./../utils/appError")
const APIFEATURES=require("./../utils/apiFeaturs")

exports.deleteOne=Model=>async (req,res,next) =>
{
 try{
    const doc=await Model.findByIdAndDelete(req.params.id)
        if(!doc)
              {
               return  next(new AppError("No document was find by that id",404))
              } 
    
            res.status(200).json({
                status:"success",
                message:"DOCUMENT HAS BEEN DELETED SUCCESSFULLY"
    
            })
        }
        catch(err)
        {
            next(err)
        }
}


exports.createOne=Model=>async (req,res,next)=>

{
    try{
        const newDoc=await Model.create(req.body)

    res.status(200).json({
        status:"successfull",
        data: newDoc
    })}

    catch(err)
    {
        next(err)
    }
}

exports.updateOne=Model=>async(req,res,next)=>
{
   try{
          const doc= await Model.findByIdAndUpdate(req.params.id,req.body,{
              new:true,
              runValidators:true
          })
      
          if(!doc)
                {
                 return  next(new AppError("No Document was find by that id",404))
                }
      
          res.status(200).json({
              status:"success",
              data:{
                  doc
              }
          })
         }
         catch(err)
         {
          next(err)
         }
}

exports.getOne=(Model,popOps)=>async (req,res,next)=>{
    try
      {
       let query=Model.findById(req.params.id)
       if(popOps) query=Model.findById(req.params.id).populate(popOps)
       const doc=await query
       
       if(!doc)
       {
        return  next(new AppError("No Doc was find by that id",404))
       }

       res.status(200).json
       ({
           status:"success",
           data:
           {
             doc
           }
       })

       res.status(200)
      }
      catch(err)
      {
         next(err)
      }
 
    }        
    
    
exports.getAll=Model=>async (req,res,next)=>
{
  try
  {   

    
    let filtObj={}
    if(req.params.tourId) filtObj={tour:req.params.tourId}
   const features=new APIFEATURES(Model.find(filtObj),req.query).filter().sort().limit().paginate()
     const docs=await features.query
      res.status(200).json(
                {   status:"success",
                    results:docs.length,
                    data:
                    {
                        docs
                    }
                }
            )
        }
        catch(err)
        {
            next(err)
        }
}