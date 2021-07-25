import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connect mongodb");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

const __dirname = path.resolve();
app.use("/uploads", express.static("uploads"));
//javascript and css file
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  //index.html fro all page routes
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
  );
}

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
