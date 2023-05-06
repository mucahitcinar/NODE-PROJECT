const AppError=require("./../utils/appError")


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
        
    
    
