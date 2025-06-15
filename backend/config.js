const mongoose= require('mongoose')

async function connectToMongoDB(url){
    try{
        await mongoose.connect(url);
        console.log("Database Connection Successfully");
    }catch(err){
        console.log('Connection Error',err.message);
    }
}
module.exports={
    connectToMongoDB
}