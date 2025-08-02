import mongoose from "mongoose";

const dbconnect = async()=>{
    try{
       
        await mongoose.connect(process.env.MONGOOSE_DB_URL);
        console.log(`connected to database`);
    }catch(error){
        console.log(`error into mongodb: ${error.message}`);
    }
}

export default dbconnect;