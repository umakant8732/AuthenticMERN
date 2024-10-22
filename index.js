import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/user.route.js";
import connetDB from "./src/config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("uploads"));



app.use('/api/user', authRouter),

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false, 
    statusCode,
    message,
  });
});


app.get('/', (req, res) => {
  res.send("server is ready");
})

app.listen(port, () => {
  console.log(`Server Start on ${port}`);
})

connetDB();