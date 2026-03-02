import express from "express"
import healthcheckroutes from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js"
const app = express();

app.use(express.json());
app.get('/',(req,res)=>{
    res.send("This is the home page");
    
});


//route for the healthcheck of the system
app.use("/api/vi/healthcheck",healthcheckroutes);

//routes for registering user
app.use("/api/vi/auth",authRouter)


app.get('/name',(req,res)=>{
   res.send("This is my name : " + process.env.username);
    
})

export default app;