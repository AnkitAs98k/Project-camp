import express from "express"
import healthcheckroutes from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js"
import projectRoutes from "./routes/projects.routes.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("This is the home page");
    
});


//route for the healthcheck of the system
app.use("/api/v1/healthcheck",healthcheckroutes);

//routes for registering user
app.use("/api/v1/auth",authRouter)

//router for creating projects
app.use("/api/v1/projects",projectRoutes)

app.get('/name',(req,res)=>{
   res.send("This is my name : " + process.env.username);
    
})

export default app;