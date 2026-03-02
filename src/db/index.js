import mongoose from "mongoose"

//make a connectdb constant to use later in communaction with db

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Succesfully connected");

         mongoose.connection.once("open", () => {
            console.log("📌 DB Name:", mongoose.connection.name);
            console.log("📌 Host:", mongoose.connection.host);
        });

    }catch{
        console.error("Not connected",error);
        process.exit(1);
    }
}

export default connectDB;