import { configDotenv } from "dotenv";
import mongoose from "mongoose";


configDotenv(); 

function connectWithDB(){
  mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
    console.log("Data base Connected ...");
  })
  .catch((err) =>{
    console.log("Data Base connection failed ..." );
    process.exit(1); 
  })
}

export default connectWithDB;