import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./db/db.js";
import Product from "./routes/Productroute.js";
import Feactures from "./routes/Feacturesroute.js";
import User from "./routes/Userroute.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import Cart from "./routes/cartroute.js";
import Order from "./routes/Orderrote.js";
import Promo from "./routes/Promoroute.js";
const app = express();

app.use(bodyParser.json({ limit: "50mb" })); // define the size limit
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

dotenv.config();

// database connection
connectToDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/v1", Product);
app.use("/api/feactures", Feactures);
app.use("/api/user", User);  
app.use("/api/order", Order); 
app.use("/api/cart", Cart);
app.use("/api/promo", Promo);
 
app.listen(process.env.PORT || 4000 , () => {
  console.log("server is running at port 4000");
});
    