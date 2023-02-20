const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv");
const connectDatabase = require("./config/database");            // import DB Connection


// routes 
const userRoutes = require("./routes/user.routes")
const categRoutes = require("./routes/category.routes")
const carRoutes = require("./routes/car.routes")

const app = express();
// env config
env.config();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

//XSS protected ... CSP 
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});
// Connecting to database
connectDatabase();

app.use("/api", userRoutes)           // all user routes
app.use("/api", categRoutes)          // all categ routes
app.use("/api", carRoutes)             // all car crud and routes

app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
})