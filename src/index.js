import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/index.js";


dotenv.config();
const port = process.env.PORT || 3000 ;



connectDB()
.then(()=>{
    app.listen(port,()=>{
      console.log("DB connected succesfull on port "+ port);
      
    });
})
.catch((err)=>{
  console.log("Db not connected", err);
  process.exit(1);
})
