const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config({ path:"./config.env"})
const app=require("./app")

const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)

mongoose.connect(DB,{
    useNewUrlParser: true,
    useFindAndModify: true,
    useFindAndModify:false,
  
  })
.then(con=>console.log("CONNECTION SUCCESSFULL"))






const port=2000

app.listen(port,()=>console.log("SİSTEM İSTENDİĞİ GİBİ ÇALIŞIYOR ŞUAN"))



