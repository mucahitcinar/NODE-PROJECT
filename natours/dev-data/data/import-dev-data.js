const mongoose=require("mongoose")
const dotenv=require("dotenv")
const fs=require("fs")
const Tour=require("./../../models/tourModel")
dotenv.config({ path:"./config.env"})


const DB=process.env.DATABASE.replace(
    '<PASSWORD>',
process.env.PASSWORD)

mongoose.connect(DB,{
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: false
  })
.then(con=>console.log("CONNECTION SUCCESSFULL"))

//READ FILE

const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,"utf-8"))

//IMPORT DATA TO DB

const importData= async()=>{
    try{
     await Tour.create(tours)
     console.log("DATA SUCCESSFULLY IMPORTED")
    }
    catch(err)
    {
        console.log(err)
    }
    process.exit()
}


//DELETE DATA FROM DB



const deleteData= async()=>{
    try{
     await Tour.deleteMany()
     console.log("DATA SUCCESSFULLY DELETED")
    }
    catch(err)
    {
        console.log(err)
    }
    process.exit()
}

if(process.argv[2]==="--import")
{
  importData()
}
else if (process.argv[2]==="--delete")
{
    deleteData()
}






