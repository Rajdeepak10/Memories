import express from 'express';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
//creation of app from expresss
const app = express();
dotenv.config()

//limiting the size of json data as well as urlencoded
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// allow cross orgin resourses sharing
app.use(cors());

//posts routes
app.use('/posts',postRoutes)
app.use('/user',userRoutes)


// const CONNECTION_URL="mongodb+srv://rajdeepakchauhan9:kunal%40100@cluster.p3ody54.mongodb.net/?retryWrites=true&w=majority"


const PORT = process.env.PORT || 5000;

//mongooose cluster connection 
mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>app.listen(PORT,()=> console.log(`server is running on Port : ${PORT}`)))
.catch((error)=>console.log(error.message))





