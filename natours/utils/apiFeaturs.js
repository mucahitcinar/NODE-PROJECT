class APIFEATURES {
    constructor(query,queryString)
    {
        this.query=query
        this.queryString=queryString
    }

    filter()
    {
    
    let queryObj=JSON.parse(JSON.stringify(this.queryString))
    const outOfQuery=["page","sort","limit","fields"]
    outOfQuery.forEach(el=>delete queryObj[el])

    let queryStr=JSON.stringify(queryObj)
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
    this.query=this.query.find(JSON.parse(queryStr))

    return this
   }

   sort()
   {
    if(this.queryString.sort)
    {
       
        const sortBy=this.queryString.sort.split(",").join(" ")
        console.log(sortBy)
        this.query=this.query.sort(sortBy)
        //sort{'price ratingsAverage'}---->bu şekilde olması lazım
    }
    else
    {
        this.query=this.query.sort("_id")
    }
    return this
   }
   limit()
   {
   
    if(this.queryString.fields)
    {
        let choose=this.queryString.fields.split(",").join(" ")
        this.query=this.query.select(choose)
    }
    else
    {
        this.query=this.query.select("-__v")
    }

    return this

   }
   paginate()
   {
    const page=this.queryString.page*1 || 1;
    const limit =this.queryString.limit*1 || 100;
    const skip=(page-1)*limit

   

    this.query=this.query.skip(skip).limit(limit)

    return this

 }
   

}


module.exports=APIFEATURES