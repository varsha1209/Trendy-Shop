import express from "express";
import mongoose from "mongoose";
import path from "path";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import config from "./config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

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
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"))
  );
}

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(config.PORT, () => {
  console.log("Server started at http://localhost:5000");
});
