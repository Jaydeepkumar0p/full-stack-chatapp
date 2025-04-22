import express from 'express'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import cookieParser from 'cookie-parser'
import  db from './lib/db.js'
import path from 'path'
import {app,server} from './lib/socket.js'
import dotenv from 'dotenv'
import cors from 'cors'
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
const __dirname=path.resolve();

app.use(express.json({ limit: "10mb" }));         // increase limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));

dotenv.config();
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

const port=process.env.PORT || 5001;
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));


    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

server.listen(port,()=>{
    db();
    console.log("Server is running on port 5001")
})