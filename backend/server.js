import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT=process.env.PORT||8080;



connectDB();



app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);

})
// Trigger nodemon restart
