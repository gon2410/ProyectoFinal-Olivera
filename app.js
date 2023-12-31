import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";


import sessionRouter from "./src/routes/session.js";
import productRouter from "./src/routes/productViews.js"
import cartRouter from "./src/routes/cart.js";
import productViewRouter from "./src/routes/productViews.js";
import cartViewRouter from "./src/routes/cartViews.js";

const app = express();

app.use(express.static("./src/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", handlebars.engine({ extname: ".hbs", defaultLayout: "main.hbs" }));
app.set("views", "./src/views");
app.set("view engine", ".hbs");

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port: ${httpServer.address().port}`);
})
httpServer.on("error", error => console.log(error));


mongoose.connect("mongodb+srv://goonolivera:xyzab3landa@cluster0.rdf8a7f.mongodb.net/ecommerce?retryWrites=true&w=majority")
.then(() => console.log("Database connected."))
.catch(err => console.log(err));

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://goonolivera:xyzab3landa@cluster0.rdf8a7f.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 20
    }),
    secret: "esteesmisecret",
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/session", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/products", productViewRouter);
app.use("/carts", cartViewRouter);
