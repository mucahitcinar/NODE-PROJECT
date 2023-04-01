const fs=require("fs")


const users=JSON.parse(fs.readFileSync(`./dev-data/data/users.json`))


exports.getUsers=(req,res)=>{
    res.status(200).json({
        status:"successssss",
        data:{
            users
        }
    })
}

exports.createNewUser=(req,res)=>{
    res.status(500).json({
        message:"THIS MODULE IS NOT WORKING YET",
        status:"success"
    })
}

exports.deleteUser=(req,res)=>{
    res.status(500).json({
        message:"THIS MODULE IS NOT WORKING YET",
        status:"success"
    })
}

exports.updateUsers=(req,res)=>{
    res.status(500).json({
        message:"THIS MODULE IS NOT WORKING YET",
        status:"success"
    })
}

exports.getOneUser=(req,res)=>{
    res.status(500).json({
        message:"THIS MODULE IS NOT WORKING YET",
        status:"success"
    })
}

